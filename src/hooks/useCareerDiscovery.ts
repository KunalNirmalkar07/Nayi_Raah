import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface MCQOption {
  label: string; // "A", "B", "C", "D"
  text: string;
}

export interface AssessmentContext {
  scores: { analytical: number; creative: number; social: number; practical: number };
  aptitudeScore: number;
  recommendedStream: string;
  careerMatches: { career: string; match: number; stream: string }[];
}

const DISCOVERY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-discovery`;

/** Parse [OPTIONS]...[/OPTIONS] block from content */
export function parseOptions(content: string): MCQOption[] {
  const match = content.match(/\[OPTIONS\]([\s\S]*?)\[\/OPTIONS\]/);
  if (!match) return [];
  const lines = match[1].trim().split("\n").filter(Boolean);
  return lines
    .map((line) => {
      const m = line.trim().match(/^([A-D])\)\s*(.+)/);
      return m ? { label: m[1], text: m[2].trim() } : null;
    })
    .filter(Boolean) as MCQOption[];
}

/** Strip [OPTIONS]...[/OPTIONS] block from message for display */
export function stripOptions(content: string): string {
  return content.replace(/\[OPTIONS\][\s\S]*?\[\/OPTIONS\]/, "").trim();
}

export const useCareerDiscovery = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentOptions, setCurrentOptions] = useState<MCQOption[]>([]);
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | null>(null);

  // Fetch latest assessment results on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("assessment_results")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const r = data[0];
          const scores = r.scores as Record<string, number>;
          const matches = (r.career_matches as { career: string; match: number; stream: string }[]) || [];
          setAssessmentContext({
            scores: {
              analytical: scores.analytical || 0,
              creative: scores.creative || 0,
              social: scores.social || 0,
              practical: scores.practical || 0,
            },
            aptitudeScore: scores.aptitudeScore || scores.aptitude || 0,
            recommendedStream: scores.recommendedStream?.toString() || "Science",
            careerMatches: matches.map((m) => ({
              career: m.career,
              match: m.match,
              stream: m.stream,
            })),
          });
        }
      });
  }, [user]);

  const processStream = async (
    response: Response,
    assistantId: string,
    existingMessages: Message[]
  ): Promise<string> => {
    let assistantContent = "";
    setMessages([
      ...existingMessages,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr) as { choices?: { delta?: { content?: string } }[] };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              )
            );
          }
        } catch (e) {
          console.warn("Could not parse stream chunk:", jsonStr);
          continue;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr) as { choices?: { delta?: { content?: string } }[] };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              )
            );
          }
        } catch {
          /* ignore */
        }
      }
    }

    return assistantContent;
  };

  const startDiscovery = useCallback(async () => {
    setIsStarted(true);
    setIsLoading(true);
    setMessages([]);
    setCurrentOptions([]);

    try {
      // Build initial message with assessment context
      let initialContent =
        "Hi! I want to discover my ideal career. Please help me figure out what career path is best for me.";

      if (assessmentContext) {
        initialContent += `\n\n[ASSESSMENT DATA]\nRecommended Stream: ${assessmentContext.recommendedStream}\nScores: Analytical=${assessmentContext.scores.analytical}, Creative=${assessmentContext.scores.creative}, Social=${assessmentContext.scores.social}, Practical=${assessmentContext.scores.practical}\nAptitude Score: ${assessmentContext.aptitudeScore}%\nTop Career Matches: ${assessmentContext.careerMatches.map((m) => `${m.career} (${m.match}%)`).join(", ")}\n[/ASSESSMENT DATA]`;
      }

      const response = await fetch(DISCOVERY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: initialContent }],
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start career discovery");
      }

      const assistantContent = await processStream(response, Date.now().toString(), []);
      const opts = parseOptions(assistantContent);
      setCurrentOptions(opts);
      setQuestionCount(1);
    } catch (error) {
      console.error("Discovery start error:", error);
      toast.error("Failed to start career discovery. Please try again.");
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  }, [assessmentContext]);

  const sendAnswer = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setCurrentOptions([]);

      const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: "user", content: input });

      try {
        const response = await fetch(DISCOVERY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 429) {
            toast.error("Rate limit reached. Please wait a moment.");
          } else if (response.status === 402) {
            toast.error("Service temporarily unavailable.");
          } else {
            toast.error(errorData.error || "Failed to get response.");
          }
          setIsLoading(false);
          return;
        }

        if (!response.body) throw new Error("No response body");

        const assistantContent = await processStream(
          response,
          (Date.now() + 1).toString(),
          updatedMessages
        );

        const opts = parseOptions(assistantContent);
        setCurrentOptions(opts);
        setQuestionCount((prev) => prev + 1);

        if (
          assistantContent.includes("[ROADMAP_READY]") ||
          assistantContent.includes("# 🎯 Your Personalized Career Roadmap") ||
          assistantContent.includes("## Your Top Career Matches")
        ) {
          setRoadmapGenerated(true);
          setCurrentOptions([]);
        }

        // Save to database
        if (user && assistantContent) {
          supabase
            .from("chat_history")
            .insert([
              { user_id: user.id, role: "user", content: input },
              { user_id: user.id, role: "assistant", content: assistantContent },
            ])
            .then(({ error }) => {
              if (error) console.error("Failed to save chat history:", error);
            });
        }
      } catch (error) {
        console.error("Discovery chat error:", error);
        toast.error("Failed to send message. Please try again.");
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, user]
  );

  const resetDiscovery = useCallback(() => {
    setMessages([]);
    setIsStarted(false);
    setRoadmapGenerated(false);
    setQuestionCount(0);
    setCurrentOptions([]);
  }, []);

  return {
    messages,
    isLoading,
    isStarted,
    roadmapGenerated,
    questionCount,
    currentOptions,
    assessmentContext,
    startDiscovery,
    sendAnswer,
    resetDiscovery,
  };
};
