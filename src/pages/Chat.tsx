import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Send,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  Briefcase,
  Map,
  HelpCircle,
  ArrowLeft,
  Loader2,
  Target,
  RotateCcw,
  MessageCircle,
  Download,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCareerChat } from "@/hooks/useCareerChat";
import { useCareerDiscovery, stripOptions } from "@/hooks/useCareerDiscovery";
import jsPDF from "jspdf";

const MARKDOWN_COMPONENTS = {
  h1: ({ children }: any) => <h2 className="text-lg font-bold mt-4 mb-2 first:mt-0 text-slate-900">{children}</h2>,
  h2: ({ children }: any) => <h3 className="text-base font-bold mt-3 mb-2 text-slate-900">{children}</h3>,
  h3: ({ children }: any) => <h4 className="text-sm font-bold mt-2 mb-1 text-slate-900">{children}</h4>,
  p: ({ children }: any) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-800">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc pl-4 mb-2 space-y-1 text-slate-800">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-slate-800">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed text-slate-800">{children}</li>,
  strong: ({ children }: any) => <strong className="font-semibold text-slate-900">{children}</strong>,
  code: ({ children }: any) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm text-slate-700 font-mono">{children}</code>,
};

const TypewriterMarkdown = ({ content, isTyping }: { content: string, isTyping: boolean }) => {
  const [displayedContent, setDisplayedContent] = useState(isTyping ? "" : content);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(contentRef.current);
      return;
    }

    const interval = setInterval(() => {
      setDisplayedContent((prev) => {
        const target = contentRef.current;
        if (prev === target) return prev;
        
        const diff = target.length - prev.length;
        const amountToAdd = Math.max(1, Math.floor(diff / 3));
        return target.substring(0, prev.length + amountToAdd);
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <ReactMarkdown components={MARKDOWN_COMPONENTS}>
      {displayedContent || "..."}
    </ReactMarkdown>
  );
};

const suggestedQuestions = [
  { icon: GraduationCap, text: "What career options are available for Science stream students?", color: "bg-primary/10 text-primary" },
  { icon: Briefcase, text: "How can I prepare for JEE Main exam?", color: "bg-secondary/10 text-secondary" },
  { icon: Map, text: "What are the best engineering colleges in India?", color: "bg-accent/10 text-accent" },
  { icon: HelpCircle, text: "How do I choose between B.Tech and B.Sc?", color: "bg-warning/10 text-warning" },
];

type ChatMode = "select" | "regular" | "discovery";

const Chat = () => {
  const regularChat = useCareerChat();
  const discovery = useCareerDiscovery();
  const [mode, setMode] = useState<ChatMode>("select");
  const [input, setInput] = useState("");
  const [showTypeOwn, setShowTypeOwn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeMessages = mode === "discovery" ? discovery.messages : regularChat.messages;
  const activeLoading = mode === "discovery" ? discovery.isLoading : regularChat.isLoading;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, discovery.currentOptions]);

  const handleSend = () => {
    if (!input.trim() || activeLoading) return;
    if (mode === "discovery") {
      discovery.sendAnswer(input);
      setShowTypeOwn(false);
    } else {
      regularChat.sendMessage(input);
    }
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleOptionClick = (optionText: string) => {
    if (activeLoading) return;
    discovery.sendAnswer(optionText);
    setShowTypeOwn(false);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  const startDiscoveryMode = () => {
    setMode("discovery");
    setShowTypeOwn(false);
    discovery.startDiscovery();
  };

  const startRegularMode = () => {
    setMode("regular");
  };

  const handleBack = () => {
    if (mode !== "select") {
      setMode("select");
      setShowTypeOwn(false);
      discovery.resetDiscovery();
    }
  };

  const downloadFullReport = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addPageIfNeeded = (extraHeight = 10) => {
      if (y + extraHeight > 270) {
        pdf.addPage();
        y = 20;
      }
    };

    // Title
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("Nayi Raah — Career Discovery Report", margin, y);
    y += 12;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, margin, y);
    y += 10;

    // Assessment Summary
    if (discovery.assessmentContext) {
      const ctx = discovery.assessmentContext;
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 8;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("📊 Assessment Summary", margin, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Recommended Stream: ${ctx.recommendedStream}`, margin, y);
      y += 6;
      pdf.text(`Aptitude Score: ${ctx.aptitudeScore}%`, margin, y);
      y += 6;
      pdf.text(`Analytical: ${ctx.scores.analytical} | Creative: ${ctx.scores.creative} | Social: ${ctx.scores.social} | Practical: ${ctx.scores.practical}`, margin, y);
      y += 6;

      if (ctx.careerMatches.length > 0) {
        pdf.text("Top Career Matches:", margin, y);
        y += 5;
        ctx.careerMatches.forEach((m) => {
          addPageIfNeeded(5);
          pdf.text(`  • ${m.career} (${m.match}% match, ${m.stream})`, margin + 2, y);
          y += 5;
        });
      }
      y += 6;
    }

    // Discovery Q&A
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    addPageIfNeeded(20);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("💬 Discovery Conversation", margin, y);
    y += 8;

    discovery.messages.forEach((msg) => {
      addPageIfNeeded(15);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(msg.role === "user" ? "You:" : "AI Counselor:", margin, y);
      y += 5;

      pdf.setFont("helvetica", "normal");
      const content = msg.role === "assistant"
        ? stripOptions(msg.content).replace("[ROADMAP_READY]", "").trim()
        : msg.content;

      const lines = pdf.splitTextToSize(content, maxWidth);
      lines.forEach((line: string) => {
        addPageIfNeeded(5);
        pdf.text(line, margin, y);
        y += 4.5;
      });
      y += 4;
    });

    pdf.save("Nayi-Raah-Career-Report.pdf");
  };

  return (
    <div className="h-[100dvh] bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">
      <nav className="shrink-0 z-50 bg-white border-b border-slate-100 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left Nav */}
            <div className="flex items-center z-10">
              {mode === "select" ? (
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Center Logo - Absolutely Centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary/10">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">Nayi Raah</span>
              </Link>
            </div>

            {/* Right Nav */}
            <div className="flex items-center z-10">
              {mode === "regular" && (
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => regularChat.setLanguage("english")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${regularChat.language === "english" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >English</button>
                  <button
                    onClick={() => regularChat.setLanguage("hindi")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${regularChat.language === "hindi" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >हिंदी</button>
                </div>
              )}
              {mode === "discovery" && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Target className="w-3 h-3" />
                    Q{discovery.questionCount}/12
                  </Badge>
                  {discovery.roadmapGenerated && (
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={downloadFullReport}>
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 min-h-0 w-full flex flex-col relative z-10">

          {/* ── Mode Selection ── */}
          {mode === "select" && (
            <div className="flex-1 min-h-0 overflow-y-auto w-full hide-scrollbar flex flex-col" data-lenis-prevent="true">
              <div className="flex flex-col items-center justify-start my-auto w-full gap-6 py-8 relative z-10">
                {/* Hero Row */}
                <div className="flex flex-col items-center justify-center gap-5 w-full max-w-2xl px-4 text-center">
                  {/* Lottie — adjusted shape for laptop screens */}
                  <div className="w-56 h-56 sm:w-64 sm:h-64 mb-2 shrink-0">
                  <DotLottieReact
                    src="https://assets-v2.lottiefiles.com/a/3281b124-596c-11f0-b0b0-7747580cf349/3zw31oBnii.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Heading + subtitle — centered */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    AI Career <span className="text-primary">Guidance</span>
                  </h1>
                  <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                    Analyze your skills, find the right colleges, and map out your career path. Select a module below to begin.
                  </p>
                </div>
              </div>

              {/* Assessment Context Badge */}
              {discovery.assessmentContext && (
                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-green-50 border border-green-200 max-w-lg w-full mx-auto">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-green-800">Assessment Results Linked</p>
                    <p className="text-[11px] text-green-700 truncate font-medium">
                      Stream: {discovery.assessmentContext.recommendedStream} • Top match: {discovery.assessmentContext.careerMatches[0]?.career || "N/A"}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white border-0 text-[10px] font-bold shrink-0">ACTIVE</Badge>
                </div>
              )}

              {/* Module Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl px-4">
                {/* Career Discovery Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startDiscoveryMode}
                  style={{ opacity: 1 }}
                  className="text-left p-8 rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-primary/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-slate-50 -mr-10 -mt-10 pointer-events-none" />
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20 relative z-10">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1.5 text-slate-900">Career Discovery</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Complete our interactive AI interview to generate your personalized step-by-step career roadmap.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className="bg-[#1e9f8a] text-white hover:bg-[#1a8e7a] border-0 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        RECOMMENDED <span className="text-orange-300">⏩</span>
                      </Badge>
                      {discovery.assessmentContext && (
                        <Badge variant="outline" className="text-[10px] border-green-200 text-green-700 font-bold bg-green-50">
                          AUTO-SYNC
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.button>

                {/* Ask Anything Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startRegularMode}
                  style={{ opacity: 1 }}
                  className="text-left p-8 rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-secondary/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-slate-50 -mr-10 -mt-10 pointer-events-none" />
                  <div className="w-16 h-16 rounded-full bg-[#1e4e8c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20 relative z-10">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1.5 text-slate-900">Ask Anything</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Chat freely about any career topic, college admission, scholarship, or specific exam queries.
                    </p>
                    <div className="mt-2 text-left">
                      <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white">
                        UNLIMITED CHAT
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
            </div>
          )}

          {/* ── Chat Interface (both modes) ── */}
          {mode !== "select" && (
            <div className="flex-1 min-h-0 flex flex-col container mx-auto px-4 py-4 max-w-4xl w-full">

              {/* Header (Title badges removed, actions preserved) */}
              <div className="text-center mb-2">
                {mode === "discovery" && discovery.roadmapGenerated && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { discovery.resetDiscovery(); startDiscoveryMode(); }}>
                      <RotateCcw className="w-3.5 h-3.5" /> Start Over
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={downloadFullReport}>
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </Button>
                  </div>
                )}
              </div>

              {/* Chat Area */}
              <Card className="flex-1 min-h-0 flex flex-col border-slate-200 overflow-hidden shadow-sm bg-white">
                <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-slate-50" ref={scrollRef} data-lenis-prevent="true">
                  <div className="space-y-4">
                    {activeMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3,
                          type: "spring",
                          stiffness: 250,
                          damping: 20
                        }}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          style={{
                            backgroundColor: message.role === "user" ? undefined : "#ffffff",
                            opacity: 1,
                          }}
                          className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                            message.role === "user"
                              ? "bg-primary text-white rounded-br-md"
                              : "text-slate-800 border border-slate-200 rounded-bl-md"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="text-sm text-slate-800 leading-relaxed">
                              <TypewriterMarkdown 
                                content={stripOptions((message.content || "...").replace("[ROADMAP_READY]", ""))}
                                isTyping={activeLoading && index === activeMessages.length - 1} 
                              />
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap text-white">{message.content}</p>
                          )}
                          <p className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-slate-400"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {activeLoading && activeMessages[activeMessages.length - 1]?.content === "" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex gap-3" 
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-sm self-start">
                          <div className="flex items-center gap-1.5 h-6 px-1">
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
                              className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }}
                              className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
                              className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* MCQ Options (discovery mode) */}
                {mode === "discovery" && !activeLoading && discovery.currentOptions.length > 0 && !discovery.roadmapGenerated && (
                  <div className="p-4 border-t border-slate-200" style={{ backgroundColor: '#f8fafc' }}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Choose an option or type your own answer:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3" style={{ transform: 'translateZ(0)' }}>
                      {discovery.currentOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleOptionClick(opt.text)}
                          style={{ backgroundColor: '#ffffff', opacity: 1 }}
                          className="flex items-center gap-3 p-3 sm:p-4 min-h-[60px] rounded-xl border-2 border-slate-200 hover:bg-primary/5 hover:border-primary transition-all text-left group shadow-sm"
                        >
                          <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors border border-teal-200">
                            {opt.label}
                          </span>
                          <span className="text-sm leading-snug text-slate-800 font-medium">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                    {!showTypeOwn ? (
                      <button
                        onClick={() => { setShowTypeOwn(true); setTimeout(() => textareaRef.current?.focus(), 100); }}
                        className="text-xs text-primary hover:text-primary/80 hover:underline font-semibold flex items-center gap-1 transition-colors"
                      >
                        ✏️ Type my own answer
                      </button>
                    ) : (
                      <div className="mt-3">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-end">
                          <textarea
                            ref={textareaRef}
                            value={input}
                            data-lenis-prevent="true"
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown as any}
                            placeholder="Type your own answer..."
                            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
                            className="flex-1 min-h-[52px] max-h-[120px] border-2 border-slate-300 rounded-xl placeholder:text-slate-400 p-3 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                            rows={1}
                          />
                          <Button type="submit" disabled={!input.trim()} size="sm" className="h-[44px] w-[44px] p-0 shrink-0 rounded-xl">
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Questions (regular mode only) */}
                {mode === "regular" && regularChat.messages.length === 1 && (
                  <div className="p-4 border-t border-slate-200" style={{ backgroundColor: '#f8fafc' }}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">💡 Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2" style={{ transform: 'translateZ(0)' }}>
                      {suggestedQuestions.map((q, index) => {
                        const Icon = q.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => { setInput(q.text); textareaRef.current?.focus(); }}
                            style={{ backgroundColor: '#ffffff', opacity: 1 }}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:bg-primary/5 hover:border-primary/40 transition-all text-left group shadow-sm"
                          >
                            <div className={`w-10 h-10 rounded-lg ${q.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-slate-800 font-medium line-clamp-2">{q.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                {(mode === "regular" || (mode === "discovery" && (discovery.roadmapGenerated || discovery.currentOptions.length === 0))) && (
                  <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 sm:gap-3 items-end">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        data-lenis-prevent="true"
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown as any}
                        placeholder={mode === "discovery" ? "Type your answer..." : "Ask me anything about careers, exams, or colleges..."}
                        className="flex-1 min-h-[52px] max-h-[200px] border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 p-3 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                        disabled={activeLoading}
                        rows={1}
                      />
                      <Button type="submit" disabled={activeLoading || !input.trim()} size="lg" className="h-[52px] w-[52px] p-0 shrink-0 rounded-xl">
                        {activeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </Button>
                    </form>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-center">
                      AI responses are for guidance only. Always verify important information.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

      </main>
    </div>
  );
};

export default Chat;
