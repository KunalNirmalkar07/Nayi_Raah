import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buildAIContext } from "@/utils/aiContext";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;

// Build once at module load — static data, no need to rebuild per message
const SYSTEM_CONTEXT = buildAIContext();

export const useCareerChat = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Career Counselor at **Nayi Raah**. 🎓\n\nI'm here to help you navigate your educational journey and career choices. Whether you're confused about which stream to choose, looking for college recommendations across India, or need guidance on entrance exams like JEE, NEET, CUET, NDA, or CLAT – feel free to ask me anything!\n\n**How can I help you today?**",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare messages for API (exclude welcome message if it's the default one)
    const apiMessages = messages
      .filter(m => m.id !== "welcome" || messages.length > 1)
      .map(m => ({ role: m.role, content: m.content }));
    
    apiMessages.push({ role: "user", content: input });

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, language }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (response.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error(errorData.error || "Failed to get response. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Create initial assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }]);

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
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map((m, i) => 
                  i === prev.length - 1 
                    ? { ...m, content: assistantContent } 
                    : m
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
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map((m, i) => 
                  i === prev.length - 1 
                    ? { ...m, content: assistantContent } 
                    : m
                )
              );
            }
          } catch { /* ignore */ }
        }
      }

      // Save to database if user is logged in
      if (user && assistantContent) {
        supabase.from("chat_history").insert([
          { user_id: user.id, role: "user", content: input },
          { user_id: user.id, role: "assistant", content: assistantContent },
        ]).then(({ error }) => {
          if (error) console.error("Failed to save chat history:", error);
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, user, language]);

  return { messages, isLoading, sendMessage, language, setLanguage };
};
