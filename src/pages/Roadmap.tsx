import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAssessmentResults, CareerPath } from "@/hooks/useAssessmentResults";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Compass,
  ArrowLeft,
  Sparkles,
  FileDown,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Target,
  TrendingUp,
  Award,
  AlertCircle,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
  Star,
  Loader2,
  Brain,
  Lightbulb,
  Shield,
  Rocket,
  DollarSign,
  Route,
  Map,
  ClipboardCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import MagneticButton from "@/components/ui/MagneticButton";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

const phaseIcons = [BookOpen, Building2, GraduationCap, Briefcase, Rocket, Shield];
const phaseColors = [
  { bg: "bg-primary", text: "text-primary-foreground", light: "bg-primary/10", border: "border-primary/30" },
  { bg: "bg-secondary", text: "text-secondary-foreground", light: "bg-secondary/10", border: "border-secondary/30" },
  { bg: "bg-accent", text: "text-accent-foreground", light: "bg-accent/10", border: "border-accent/30" },
  { bg: "bg-primary", text: "text-primary-foreground", light: "bg-primary/10", border: "border-primary/30" },
  { bg: "bg-secondary", text: "text-secondary-foreground", light: "bg-secondary/10", border: "border-secondary/30" },
  { bg: "bg-accent", text: "text-accent-foreground", light: "bg-accent/10", border: "border-accent/30" },
];

interface AIRoadmap {
  summary: string;
  strengthsAnalysis: string[];
  areasToImprove: string[];
  timeline: {
    phase: string;
    title: string;
    duration: string;
    description: string;
    tasks: { task: string; priority: string; resources: string }[];
    milestones: string[];
    tips: string;
  }[];
  scholarships: { name: string; eligibility: string; amount: string }[];
  alternativePaths: { name: string; reason: string }[];
  monthlyPlan: {
    month1to3: string;
    month4to6: string;
    month7to12: string;
  };
}

const Roadmap = () => {
  const { user } = useAuth();
  const { latestResult, recommendedPaths, isLoading } = useAssessmentResults();
  const { toast } = useToast();
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [profile, setProfile] = useState<{ district: string | null; education_level: string | null; full_name?: string; avatar_url?: string } | null>(null);
  const [aiRoadmap, setAiRoadmap] = useState<AIRoadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIRoadmap, setShowAIRoadmap] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Automatically select the top career match when results load
  useEffect(() => {
    if (!selectedCareer && recommendedPaths && recommendedPaths.length > 0) {
      setSelectedCareer(recommendedPaths[0]);
    }
  }, [selectedCareer, recommendedPaths]);

  // Load progress and roadmap state from assessment results
  useEffect(() => {
    if (latestResult?.scores) {
      const scores = latestResult.scores as {
        analytical: number;
        creative: number;
        social: number;
        practical: number;
        aptitudeScore?: number;
        recommendedStream?: string;
        completedTasks?: string[];
        roadmap_generated?: boolean;
      };
      if (scores.completedTasks) {
        setCompletedTasks(new Set(scores.completedTasks));
      }
      if (scores.roadmap_generated) {
        setShowAIRoadmap(true);
      }
    }
  }, [latestResult]);

  // Fetch user profile on load to provide context to AI
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("district, education_level, full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const handleGenerateAIRoadmap = async () => {
    if (!selectedCareer || !latestResult) return;
    setIsGenerating(true);
    setShowAIRoadmap(true);
    setAiRoadmap(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-roadmap", {
        body: {
          careerName: selectedCareer.name,
          careerStream: selectedCareer.stream,
          matchScore: selectedCareer.matchScore,
          scores: latestResult.scores,
          skills: selectedCareer.skills,
          requiredExams: selectedCareer.requiredExams,
          topColleges: selectedCareer.topColleges,
          userDistrict: profile?.district,
          userEducation: profile?.education_level,
        },
      });

      if (error) throw error;
      if (data?.roadmap) {
        setAiRoadmap(data.roadmap);
        
        // Persist roadmap generated state
        if (user && latestResult) {
          const currentScores = latestResult.scores as Record<string, unknown>;
          const updatedScores = {
            ...currentScores,
            roadmap_generated: true
          };
          await supabase
            .from("assessment_results")
            .update({ scores: updatedScores })
            .eq("id", latestResult.id);
        }
        
        localStorage.setItem("roadmap_generated", "true");
        toast({ title: "Roadmap Generated!", description: "Your AI-powered career roadmap is ready." });
      } else {
        throw new Error("No roadmap data received");
      }
    } catch (error) {
      console.error("AI roadmap generation failed:", error);
      toast({ title: "Generation Failed", description: "Could not generate roadmap. Please try again.", variant: "destructive" });
      setShowAIRoadmap(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedCareer || !roadmapRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(roadmapRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      pdf.setFontSize(20);
      pdf.setTextColor(0, 128, 128);
      pdf.text("Nayi Raah - Career Roadmap", 10, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on ${currentDate} for ${user?.email || "Student"}`, 10, 22);
      pdf.text(`Career: ${selectedCareer.name} (${selectedCareer.matchScore}% Match)`, 10, 28);
      pdf.line(10, 30, pageWidth - 10, 30);

      let position = 35;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight - 35;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight - 20;
      }

      pdf.save(`Nayi-Raah-${selectedCareer.name.replace(/\s+/g, "-")}-Roadmap.pdf`);
      toast({ title: "PDF Downloaded!", description: "Your roadmap has been exported successfully." });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({ title: "Export Failed", description: "Could not export PDF. Please try again.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(taskId)) newSet.delete(taskId);
    else newSet.add(taskId);
    
    setCompletedTasks(newSet);

    // Persist to database
    if (user && latestResult) {
      try {
        const currentScores = latestResult.scores as Record<string, unknown>;
        const updatedScores = {
          ...currentScores,
          completedTasks: Array.from(newSet)
        };
        const { error } = await supabase
          .from("assessment_results")
          .update({ scores: updatedScores })
          .eq("id", latestResult.id);
        
        if (error) console.error("Failed to persist task progress:", error);
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }
  };

  const calculateProgress = (career: CareerPath) => {
    const allTasks = career.timeline.flatMap((phase, pi) =>
      phase.tasks.map((_, ti) => `${career.id}-${pi}-${ti}`)
    );
    const completed = allTasks.filter((t) => completedTasks.has(t)).length;
    return Math.round((completed / allTasks.length) * 100);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const priorityColor = (p: string) => {
    if (p === "high") return "bg-destructive/10 text-destructive border border-destructive/20";
    if (p === "medium") return "bg-warning/10 text-warning border border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  // No assessment taken yet
  if (!isLoading && !latestResult) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar userName={profile?.full_name} avatarUrl={profile?.avatar_url} />

        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-24 h-24 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-warning" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Assessment Required</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Take the career assessment first to get your personalized roadmap.
              </p>
              <Link to="/assessment">
                <Button size="lg" className="gap-2">
                  <Target className="w-5 h-5" />
                  Take Assessment Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 h-16" />
        </nav>
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-6">
              <Skeleton className="h-12 w-1/3" />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-32" />))}
                </div>
                <div className="lg:col-span-2"><Skeleton className="h-96" /></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-28 md:pb-16 text-foreground font-sans mx-auto">
      {/* Lightweight Base Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Navigation */}
      <DashboardNavbar userName={profile?.full_name} avatarUrl={profile?.avatar_url} />

      <main className="pt-6 md:pt-12 pb-24 px-4 relative z-10" role="main">
        <div className="container mx-auto max-w-6xl">

          {/* Header & Assessment Summary */}
          <div>
            <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10 md:text-center md:flex md:flex-col md:items-center">
              <div className="flex items-center w-fit md:mx-auto mb-3">
                <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full py-1 px-3 font-bold text-[10px] uppercase tracking-widest">
                  ✨ AI-Powered
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 tracking-tighter font-display leading-tight">Your Career Roadmap</h1>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-xl md:mx-auto font-medium">
                Personalized path based on your assessment results.
              </p>
              
              <div className="flex md:justify-center gap-2.5 md:gap-3 mt-6 md:mt-8 w-full px-1 md:px-0">
                <MagneticButton distance={0.1}>
                  <Link to="/assessment" className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full md:w-auto md:px-8 gap-1.5 md:gap-2 h-11 md:h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-card hover:bg-primary/5 hover:text-primary transition-all text-[13px] md:text-base font-bold uppercase tracking-widest shadow-sm">
                      <Target className="w-4 h-4 text-primary md:w-5 md:h-5" />
                      Retake Test
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton distance={0.1}>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto md:px-8 gap-1.5 md:gap-2 h-11 md:h-14 flex-1 md:flex-none rounded-2xl border-slate-200 dark:border-slate-800 bg-card hover:bg-secondary/5 hover:text-secondary transition-all text-[13px] md:text-base font-bold uppercase tracking-widest shadow-sm"
                    onClick={handleExportPDF}
                    disabled={!selectedCareer || isExporting}
                    aria-label="Export roadmap as PDF"
                  >
                    <FileDown className="w-4 h-4 text-secondary md:w-5 md:h-5" />
                    {isExporting ? "Exporting" : <span>Export Roadmap</span>}
                  </Button>
                </MagneticButton>
              </div>
            </motion.header>

            {latestResult && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8" aria-label="Assessment summary">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 col-span-1 border shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Recommended</p>
                      <p className="text-sm md:text-lg font-black leading-tight uppercase tracking-tighter">{latestResult.scores.recommendedStream || "Science"}</p>
                    </div>
                  </div>

                  <div className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 col-span-1 border shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Score</p>
                      <p className="text-xl md:text-2xl font-black tracking-tight leading-tight">{latestResult.scores.aptitudeScore || 75}%</p>
                    </div>
                  </div>

                  <div className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 col-span-2 md:col-span-1 border shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Matches</p>
                      <p className="text-base md:text-lg font-black leading-tight uppercase tracking-tighter">{recommendedPaths.length} Careers Found</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6 lg:gap-10">
            {/* Career Options Sidebar */}
            <aside className="space-y-3 md:space-y-4 w-full" aria-label="Career matches">
              <div className="flex items-center justify-between px-1 md:px-0">
                <h2 className="text-base md:text-lg font-bold flex items-center text-slate-800">
                  <span className="hidden md:inline">⚡ Top Career Matches</span>
                  <span className="md:hidden opacity-80 uppercase tracking-wider text-xs">📍 Current Path</span>
                </h2>
              </div>

              {/* ── Mobile Horizontal Career Matches ── */}
              {showAIRoadmap && (
                <div className="md:hidden mt-2 mb-4 w-full">
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Other Career Paths</h3>
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-2 pb-2">
                    {recommendedPaths.map((career) => (
                      <button
                        key={career.id}
                        className={`shrink-0 flex items-center gap-2.5 transition-all px-4 py-3 text-[14px] font-bold rounded-[20px] ${
                          selectedCareer?.id === career.id
                            ? "bg-primary text-white shadow-xl shadow-primary/30"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10 shadow-sm"
                        }`}
                        onClick={() => { setSelectedCareer(career); setShowAIRoadmap(false); setAiRoadmap(null); }}
                      >
                        <span>{career.name}</span>
                        <Badge className={`px-2 py-0.5 font-bold text-[10px] ${selectedCareer?.id === career.id ? 'bg-white/20 text-white border-0' : 'bg-teal-50 text-teal-700 border-0'}`}>
                          {career.matchScore}%
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop & Pre-Gen Mobile Vertical Cards */}
              <div className={`${!showAIRoadmap ? "flex" : "hidden"} md:flex flex-col gap-4 mb-10`}>
                {recommendedPaths.slice(0, 5).map((career, index) => (
                  <motion.div key={career.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                    <button
                      className={`w-full text-left rounded-2xl transition-all p-5 flex flex-col bg-card shadow-sm border ${
                        selectedCareer?.id === career.id 
                          ? "border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20 bg-primary/5 dark:bg-slate-900" 
                          : "border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:bg-slate-900"
                      }`}
                      onClick={() => { setSelectedCareer(career); setShowAIRoadmap(false); setAiRoadmap(null); }}
                    >
                      <div className="flex items-start justify-between w-full mb-3 gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs shrink-0 border border-white/10">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-base leading-snug font-display tracking-tight">{career.name}</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-tighter font-bold">{career.stream} Stream</p>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                          {career.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-medium">
                        {career.description}
                      </p>
                      <div className="flex items-center justify-between text-primary font-bold text-xs w-full mt-auto pt-4 border-t border-white/5 uppercase tracking-widest">
                        <span>View Roadmap</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </aside>

            {/* Roadmap Details */}
            <section className="min-w-0" aria-label="Career roadmap details">
              <AnimatePresence mode="wait">
                {selectedCareer ? (
                  <motion.div key={selectedCareer.id + (showAIRoadmap ? "-ai" : "")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div ref={roadmapRef}>
                      {/* Generate AI Roadmap Banner */}
                      {!showAIRoadmap && (
                        <div className="mb-6 md:mb-8 px-1 md:px-0">
                          <Card className="border-slate-200 dark:border-slate-800 bg-card overflow-hidden rounded-3xl shadow-md border relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" aria-hidden="true" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10" aria-hidden="true" />
                            
                            <CardContent className="p-8 md:p-12 text-center relative z-10">
                              <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20" aria-hidden="true">
                                <Brain className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter font-display">Generate AI-Powered Roadmap</h3>
                              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed text-[15px] font-medium">
                                Get a high-fidelity, personalized plan with scholarships, monthly milestones, and expert guidance for <strong className="text-foreground tracking-tight">{selectedCareer.name}</strong>.
                              </p>
                              <MagneticButton>
                                <Button size="lg" className="w-full md:w-auto gap-2.5 px-10 h-14 text-sm rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 border-0 uppercase tracking-widest" onClick={handleGenerateAIRoadmap} disabled={isGenerating}>
                                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <Sparkles className="w-5 h-5 shrink-0" />}
                                  {isGenerating ? "Analyzing Strengths..." : "✨ Launch AI Roadmap"}
                                </Button>
                              </MagneticButton>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* AI Roadmap Loading */}
                      {showAIRoadmap && isGenerating && (
                        <Card className="border-border mb-8">
                          <CardContent className="p-10">
                            <div className="flex flex-col items-center justify-center space-y-5">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                                </div>
                              </div>
                              <h3 className="text-xl font-bold">Creating Your Personalized Roadmap</h3>
                              <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
                                AI is analyzing your profile and generating a detailed career roadmap for {selectedCareer.name}...
                              </p>
                              <div className="flex gap-2 mt-2">
                                {["Analyzing scores", "Finding scholarships", "Building timeline"].map((step, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                                    {step}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* AI Generated Roadmap */}
                      {showAIRoadmap && aiRoadmap && (
                        <div className="space-y-8">
                          {/* Summary Card */}
                          <Card className="border-primary/20 overflow-hidden mb-6 sm:mb-8">
                            <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" aria-hidden="true" />
                            <CardContent className="p-4 sm:p-6 md:p-8">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <h2 className="text-xl sm:text-[clamp(1.25rem,3vw,1.75rem)] font-bold tracking-tight">{selectedCareer.name}</h2>
                                    <Badge className="bg-success/10 text-success border-0 font-bold text-[10px] sm:text-sm">{selectedCareer.matchScore}% Match</Badge>
                                  </div>
                                  <p className="text-foreground/80 sm:text-foreground/70 leading-relaxed text-[13.5px] sm:text-[15px] max-w-prose">{aiRoadmap.summary}</p>
                                </div>
                              </div>

                              {/* Strengths & Areas to Improve */}
                              <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
                                <div className="bg-success/5 rounded-xl p-4 sm:p-6 border border-success/20" role="region" aria-label="Your strengths">
                                  <h4 className="font-bold text-sm sm:text-base mb-2.5 sm:mb-3 flex items-center gap-2 text-success">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                    Your Strengths
                                  </h4>
                                  <ul className="space-y-2 sm:space-y-3" role="list">
                                    {aiRoadmap.strengthsAnalysis?.map((s, i) => (
                                      <li key={i} className="text-[13px] sm:text-[14px] flex items-start gap-2.5 sm:gap-2.5 leading-relaxed text-foreground/90 sm:text-foreground/80">
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 h-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-warning/5 rounded-xl p-4 sm:p-6 border border-warning/20" role="region" aria-label="Areas to improve">
                                  <h4 className="font-bold text-sm sm:text-base mb-2.5 sm:mb-3 flex items-center gap-2 text-warning">
                                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                    Areas to Improve
                                  </h4>
                                  <ul className="space-y-2 sm:space-y-3" role="list">
                                    {aiRoadmap.areasToImprove?.map((a, i) => (
                                      <li key={i} className="text-[13px] sm:text-[14px] flex items-start gap-2.5 sm:gap-2.5 leading-relaxed text-foreground/90 sm:text-foreground/80">
                                        <Lightbulb className="w-3.5 h-3.5 sm:w-4 h-4 text-warning mt-0.5 shrink-0" aria-hidden="true" />
                                        <span>{a}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Monthly Plan */}
                          {aiRoadmap.monthlyPlan && (
                            <Card className="border-none shadow-none bg-transparent md:bg-card md:border-solid md:border-border md:shadow-sm mt-4 md:mt-0">
                              <CardContent className="p-0 sm:p-6 md:p-8">
                                <h3 className="text-[17px] sm:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 px-1 md:px-0">
                                  <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
                                  Your First Year Plan
                                </h3>
                                <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 md:pb-0 px-1 md:px-0">
                                  {[
                                    { label: "Month 1–3", sublabel: "Foundation", value: aiRoadmap.monthlyPlan.month1to3, icon: "🚀" },
                                    { label: "Month 4–6", sublabel: "Growth", value: aiRoadmap.monthlyPlan.month4to6, icon: "📈" },
                                    { label: "Month 7–12", sublabel: "Mastery", value: aiRoadmap.monthlyPlan.month7to12, icon: "🎯" },
                                  ].map((m, i) => (
                                    <div key={i} className={`snap-center shrink-0 w-[85%] sm:w-auto rounded-[20px] md:rounded-xl p-5 shadow-sm relative overflow-hidden transition-all bg-white text-slate-900 border border-slate-100 md:bg-transparent md:border-0`}>
                                      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-primary md:hidden`} aria-hidden="true" />
                                      <div className="text-2xl mb-3 relative z-10" aria-hidden="true">{m.icon}</div>
                                      <p className="font-bold text-[16px] md:text-[15px] relative z-10">{m.label}</p>
                                      <p className={`text-[12px] mb-3 md:mb-2 font-semibold md:font-medium relative z-10 capitalize md:uppercase tracking-wide text-primary md:text-slate-500`}>{m.sublabel}</p>
                                      <p className={`text-[13.5px] md:text-[13px] leading-relaxed relative z-10 text-slate-600`}>{m.value}</p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* AI Timeline */}
                          <Card className="border-none shadow-none bg-transparent md:bg-card md:border-solid md:border-border md:shadow-sm">
                            <CardContent className="p-0 sm:p-6 md:p-8">
                              <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                                <Route className="w-5 h-5 text-primary" />
                                Step-by-Step Roadmap
                              </h3>

                              <div className="relative">
                                <div className="absolute left-[11px] md:left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-secondary/40 to-accent/40" />
                                <div className="space-y-5 md:space-y-8">
                                  {aiRoadmap.timeline?.map((phase, phaseIndex) => {
                                    const Icon = phaseIcons[phaseIndex % phaseIcons.length];
                                    const colors = phaseColors[phaseIndex % phaseColors.length];

                                    return (
                                      <motion.div
                                        key={phase.phase}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: phaseIndex * 0.15 }}
                                        className="relative"
                                      >
                                        <div className={`absolute left-[-2px] md:left-0 w-7 h-7 md:w-12 md:h-12 rounded-full md:rounded-xl mt-0 md:mt-0 ${colors.bg} flex items-center justify-center z-10 shadow-md md:shadow-sm ring-4 ring-white md:ring-0 border border-white/50`}>
                                          <Icon className={`w-3.5 h-3.5 md:w-6 md:h-6 ${colors.text}`} />
                                        </div>
                                        <div className={`ml-[34px] md:ml-20 p-0 md:p-5 rounded-xl border-none md:border md:${colors.border} bg-transparent md:bg-card`}>
                                          
                                          {/* Mobile Premium Accordion View */}
                                          <div className="md:hidden">
                                            <Accordion type="single" collapsible defaultValue={phaseIndex === 0 ? "item-0" : ""} className="w-full">
                                              <AccordionItem value={`item-${phaseIndex}`} className={`border-b border-slate-100 bg-transparent mb-0 px-2`}>
                                                <AccordionTrigger className="py-4 hover:no-underline rounded-none transition-all">
                                                  <div className="flex flex-col items-start text-left w-full pr-2">
                                                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f172a]/40 mb-1">
                                                      Step {phaseIndex + 1}
                                                    </p>
                                                    <h5 className="font-bold text-[16px] leading-tight text-slate-900">{phase.title}</h5>
                                                    <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                                                      <Clock className="w-3.5 h-3.5 opacity-60" /> {phase.duration}
                                                    </p>
                                                  </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 pt-3 bg-slate-50/30">
                                                  {phase.description && (
                                                    <p className="text-[13px] text-slate-600 leading-relaxed mb-4 border-l-2 border-primary/20 pl-2.5">{phase.description}</p>
                                                  )}

                                                  {/* Tasks with priority */}
                                                  <div className="space-y-3">
                                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Key Tasks</p>
                                                    {phase.tasks?.map((t, ti) => (
                                                      <div key={ti} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-colors">
                                                        <Checkbox id={`m-ai-${phaseIndex}-${ti}`} className="mt-0.5 w-4 h-4 overflow-hidden rounded-[4px]" />
                                                        <div className="flex-1 min-w-0">
                                                          <Label htmlFor={`m-ai-${phaseIndex}-${ti}`} className="text-[13px] cursor-pointer leading-relaxed font-semibold text-slate-700 block">
                                                            {t.task}
                                                          </Label>
                                                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-md ${priorityColor(t.priority)}`}>
                                                              {t.priority}
                                                            </Badge>
                                                            {t.resources && (
                                                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                                                <BookOpen className="w-3 h-3" /> {t.resources}
                                                              </span>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>

                                                  {/* Milestones */}
                                                  {phase.milestones?.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">🏆 Milestones</p>
                                                      <div className="flex flex-wrap gap-2">
                                                        {phase.milestones.map((m, mi) => (
                                                          <Badge key={mi} variant="secondary" className="text-[11px] py-1 px-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0">{m}</Badge>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Tip */}
                                                  {phase.tips && (
                                                    <div className="mt-4 bg-teal-50 rounded-xl p-3.5 text-[13px] text-teal-900 leading-relaxed border border-teal-100">
                                                      <span className="font-bold flex items-center gap-1.5 mb-1"><Lightbulb className="w-4 h-4 text-teal-600" /> Pro Tip</span>
                                                      <span className="opacity-90">{phase.tips}</span>
                                                    </div>
                                                  )}
                                                </AccordionContent>
                                              </AccordionItem>
                                            </Accordion>
                                          </div>

                                          {/* Desktop Classic View */}
                                          <div className="hidden md:block">
                                            <div className="flex items-start justify-between mb-3">
                                              <div>
                                                <Badge variant="outline" className="text-[10px] mb-1.5 font-semibold">
                                                  STEP {phaseIndex + 1}
                                                </Badge>
                                                <h5 className="font-bold text-base leading-tight">{phase.title}</h5>
                                              </div>
                                              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3.5 h-3.5" /> {phase.duration}
                                              </p>
                                            </div>
                                            {phase.description && (
                                              <p className="text-sm text-muted-foreground leading-relaxed mb-4 border-l-2 border-primary/20 pl-3">{phase.description}</p>
                                            )}

                                            {/* Tasks with priority */}
                                            <div className="space-y-3">
                                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tasks</p>
                                              {phase.tasks?.map((t, ti) => (
                                                <div key={ti} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                                  <Checkbox id={`ai-${phaseIndex}-${ti}`} className="mt-0.5 overflow-hidden rounded-[4px]" />
                                                  <div className="flex-1 min-w-0">
                                                    <Label htmlFor={`ai-${phaseIndex}-${ti}`} className="text-sm cursor-pointer leading-relaxed font-medium block">
                                                      {t.task}
                                                    </Label>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                      <Badge className={`text-[10px] px-1.5 py-0 ${priorityColor(t.priority)}`}>
                                                        {t.priority}
                                                      </Badge>
                                                      {t.resources && (
                                                        <span className="text-[11px] text-muted-foreground font-medium">📚 {t.resources}</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>

                                            {/* Milestones */}
                                            {phase.milestones?.length > 0 && (
                                              <div className="mt-4 pt-4 border-t border-border">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">🏆 Milestones</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {phase.milestones.map((m, mi) => (
                                                    <Badge key={mi} variant="secondary" className="text-xs py-0.5 px-2">{m}</Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Tip */}
                                            {phase.tips && (
                                              <div className="mt-4 bg-primary/5 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed border border-primary/10">
                                                <span className="font-bold text-primary">💡 Pro Tip:</span> {phase.tips}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Scholarships */}
                          {aiRoadmap.scholarships?.length > 0 && (
                            <Card className="border-none shadow-none bg-transparent md:bg-card md:border-solid md:border-border md:shadow-sm mt-4 md:mt-0">
                              <CardContent className="p-0 sm:p-6 md:p-8">
                                <h3 className="text-[17px] sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 px-1 md:px-0">
                                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                                  Scholarships & Financial Aid
                                </h3>
                                <div className="flex md:grid md:grid-cols-2 gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 md:pb-0 px-1 md:px-0">
                                  {aiRoadmap.scholarships.map((s, i) => (
                                    <div key={i} className={`snap-center shrink-0 w-[85%] sm:w-auto rounded-[20px] md:rounded-xl p-5 shadow-sm relative overflow-hidden transition-all bg-white text-slate-900 border border-slate-100 md:bg-transparent md:border-0`}>
                                      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-primary md:hidden`} aria-hidden="true" />
                                      <h4 className="font-bold text-[15px] sm:text-base mb-1.5 sm:mb-2 relative z-10">{s.name}</h4>
                                      <p className={`text-[13px] sm:text-sm mb-3 sm:mb-4 leading-relaxed font-medium relative z-10 text-slate-500`}>{s.eligibility}</p>
                                      <Badge className={`relative z-10 border border-slate-200 md:border-transparent text-[11px] sm:text-xs font-bold px-3 py-1 bg-slate-50 md:bg-success/10 text-slate-700 md:text-success`}>{s.amount}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Alternative Paths */}
                          {aiRoadmap.alternativePaths?.length > 0 && (
                            <Card className="border-none shadow-none bg-transparent md:bg-card md:border-solid md:border-border md:shadow-sm mt-4 md:mt-0">
                              <CardContent className="p-0 sm:p-6 md:p-8">
                                <h3 className="text-[17px] sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 px-1 md:px-0">
                                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                  Alternative Career Paths
                                </h3>
                                <div className="flex flex-row md:flex-col gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 md:pb-0 px-1 md:px-0">
                                  {aiRoadmap.alternativePaths.map((alt, i) => (
                                    <div key={i} className={`snap-center shrink-0 w-[85%] md:w-auto flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 rounded-[20px] md:rounded-xl p-5 md:p-4 border shadow-sm md:shadow-none transition-all bg-white text-slate-900 border-slate-100 md:bg-slate-50 md:border-border`}>
                                      <div className={`w-12 h-12 md:w-10 md:h-10 rounded-2xl md:rounded-xl flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 md:border-0 md:bg-primary/10`}>
                                        <span className={`text-[16px] sm:text-sm font-bold text-slate-500 md:text-primary`}>{i + 1}</span>
                                      </div>
                                      <div>
                                        <p className="font-bold text-[16px] sm:text-sm mb-1 line-clamp-1 text-inherit md:text-slate-800">{alt.name}</p>
                                        <p className={`text-[13px] sm:text-sm leading-relaxed font-medium line-clamp-2 text-slate-500`}>{alt.reason}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                            <Button className="flex-1 min-w-[140px] sm:min-w-[200px] gap-2 h-10 sm:h-11 text-[13px] sm:text-sm" onClick={handleExportPDF} disabled={isExporting}>
                              <FileDown className="w-4 h-4" />
                              {isExporting ? "Exporting..." : <span className="hidden sm:inline">Download as PDF</span>}
                              {!isExporting && <span className="sm:hidden">Export</span>}
                            </Button>
                            <Button variant="outline" className="flex-1 sm:flex-none gap-2 h-10 sm:h-11 text-[13px] sm:text-sm" onClick={handleGenerateAIRoadmap} disabled={isGenerating}>
                              <Sparkles className="w-4 h-4" />
                              <span className="hidden sm:inline">Regenerate</span>
                              <span className="sm:hidden">Retry</span>
                            </Button>
                            <Link to="/chat" className="w-full sm:w-auto mt-1 sm:mt-0">
                              <Button variant="outline" className="w-full gap-2 h-10 sm:h-11 text-[13px] sm:text-sm">
                                <ExternalLink className="w-4 h-4" />
                                AI Chat
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Default static roadmap (shown before AI generation) */}
                      {!showAIRoadmap && (
                        <div className="space-y-6">
                          <Card className="border-none shadow-none md:border-solid md:border-border md:shadow-sm bg-transparent md:bg-card">
                            <CardContent className="p-0 sm:p-6 md:p-8">
                              {/* Desktop Header Info (Hidden on Mobile) */}
                              <div className="hidden md:flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5 sm:mb-6 px-4 md:px-0 pt-4 md:pt-0">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <h2 className="text-xl sm:text-2xl font-bold">{selectedCareer.name}</h2>
                                    <Badge className="bg-success/10 text-success border-0 font-bold text-[10px] sm:text-xs">{selectedCareer.matchScore}% Match</Badge>
                                  </div>
                                  <p className="text-[13.5px] sm:text-[15px] text-muted-foreground leading-relaxed">{selectedCareer.description}</p>
                                </div>
                                <div className="bg-muted rounded-xl p-3 sm:p-4 text-center min-w-[80px] sm:min-w-[100px] flex md:block items-center justify-between md:justify-center mt-3 md:mt-0">
                                  <p className="text-[11px] sm:text-xs text-muted-foreground mb-0 md:mb-1">Progress</p>
                                  <p className="text-2xl sm:text-3xl font-bold text-primary">{calculateProgress(selectedCareer)}%</p>
                                </div>
                              </div>
                              <div className="hidden md:block">
                                <Progress value={calculateProgress(selectedCareer)} className="h-2 sm:h-2.5 mb-6 sm:mb-8 rounded-full" />
                              </div>

                              {/* Mobile Only Quick Section Title */}
                              <h3 className="md:hidden text-lg font-bold mb-3 px-2 pt-2 flex items-center gap-2 text-slate-800">
                                <GraduationCap className="w-5 h-5 text-teal-600" /> Core Requirements
                              </h3>

                              <div className="flex md:grid md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0 px-2 md:px-0">
                                <div className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto rounded-[20px] md:rounded-xl p-5 md:p-5 shadow-sm md:shadow-none bg-white md:bg-primary/5 text-slate-900 md:text-slate-800 border border-slate-100 md:border-primary/10 relative overflow-hidden transition-all">
                                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-teal-600 md:bg-primary/20" aria-hidden="true" />
                                  <h4 className="font-bold mb-3 sm:mb-3 flex items-center gap-2 text-[15px] sm:text-sm relative z-10 text-slate-900 md:text-slate-800">
                                    <GraduationCap className="w-5 h-5 text-teal-600 md:text-primary" /> Required Exams
                                  </h4>
                                  <div className="flex flex-wrap gap-2 relative z-10">
                                    {selectedCareer.requiredExams.map((exam) => (
                                      <Badge key={exam} className="text-[11px] sm:text-xs py-1 px-3 bg-slate-50 text-slate-700 border border-slate-200 md:bg-white md:text-slate-700 md:border-slate-200">{exam}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto rounded-[20px] md:rounded-xl p-5 md:p-5 shadow-sm md:shadow-none bg-white md:bg-secondary/5 text-slate-900 border border-slate-100 md:border-secondary/10 relative overflow-hidden transition-all">
                                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-teal-600 md:bg-secondary/20" aria-hidden="true" />
                                  <h4 className="font-bold mb-3 sm:mb-3 flex items-center gap-2 text-[15px] sm:text-sm relative z-10 text-slate-900 md:text-slate-800">
                                    <Building2 className="w-5 h-5 text-teal-600 md:text-secondary-foreground" /> Top Colleges
                                  </h4>
                                  <div className="space-y-2.5 sm:space-y-2 relative z-10">
                                    {selectedCareer.topColleges.slice(0, 3).map((college) => (
                                      <p key={college.name} className="text-[13px] sm:text-sm flex items-center py-1 sm:py-0.5 gap-3 leading-tight text-slate-700 font-medium">
                                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 md:text-secondary-foreground" />
                                        </div>
                                        <span className="truncate">{college.name}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4 sm:mb-8 px-2 md:px-0">
                                <h4 className="font-bold mb-2.5 sm:mb-3 flex items-center gap-2 text-[14px] sm:text-sm text-slate-800">
                                  <Zap className="w-4 h-4 text-warning" /> Key Skills to Develop
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCareer.skills.map((skill) => (
                                    <Badge key={skill} className="bg-primary/5 md:bg-primary/10 text-primary border border-primary/10 md:border-0 py-1 sm:py-1 px-3 text-[11px] sm:text-xs rounded-full">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Static Timeline */}
                          <Card className="border-none shadow-none md:border-solid md:border-border md:shadow-sm bg-transparent md:bg-card">
                            <CardContent className="p-0 sm:p-6 md:p-8">
                              <h4 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 flex items-center gap-2 px-2 md:px-0">
                                <Route className="w-5 h-5 text-[inherit] md:text-primary" /> Your Journey
                              </h4>

                              <div className="relative">
                                <div className="absolute left-[13px] md:left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-secondary/40 to-accent/40" />
                                <div className="space-y-5 md:space-y-8">
                                  {selectedCareer.timeline.map((phase, phaseIndex) => {
                                    const Icon = phaseIcons[phaseIndex % phaseIcons.length];
                                    const colors = phaseColors[phaseIndex % phaseColors.length];
                                    return (
                                      <motion.div
                                        key={phase.phase}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: phaseIndex * 0.1 }}
                                        className="relative"
                                      >
                                        <div className={`absolute left-[0px] md:left-0 w-7 h-7 md:w-12 md:h-12 rounded-full md:rounded-xl mt-0 md:mt-0 ${colors.bg} flex items-center justify-center z-10 shadow-sm ring-4 ring-slate-50 md:ring-0 border border-white/50`}>
                                          <Icon className={`w-3.5 h-3.5 md:w-6 md:h-6 ${colors.text}`} />
                                        </div>
                                        <div className={`ml-[34px] md:ml-20 p-0 md:p-5 rounded-xl border-none md:border md:${colors.border} bg-transparent md:bg-card`}>
                                          
                                          {/* Mobile Premium Accordion View */}
                                          <div className="md:hidden">
                                            <Accordion type="single" collapsible defaultValue={phaseIndex === 0 ? "item-0" : ""} className="w-full">
                                              <AccordionItem value={`item-${phaseIndex}`} className="border-b border-slate-100/50 bg-transparent mb-0 px-2">
                                                <AccordionTrigger className="py-4 hover:no-underline rounded-none transition-all">
                                                  <div className="flex flex-col items-start text-left w-full pr-2">
                                                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f172a]/40 mb-1">
                                                      Step {phaseIndex + 1}
                                                    </p>
                                                    <h5 className="font-bold text-[16px] leading-tight text-slate-900">{phase.title}</h5>
                                                    <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                                                      <Clock className="w-3.5 h-3.5 opacity-60" /> {phase.duration}
                                                    </p>
                                                  </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-0 pb-4 pt-2">
                                                  <div className="space-y-3">
                                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 pl-2">Key Tasks</p>
                                                    {phase.tasks.map((task, taskIndex) => {
                                                      const taskId = `m-${selectedCareer.id}-${phaseIndex}-${taskIndex}`;
                                                      return (
                                                        <div key={taskId} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-colors">
                                                          <Checkbox
                                                            checked={completedTasks.has(taskId.replace('m-', ''))}
                                                            onCheckedChange={() => handleTaskToggle(taskId.replace('m-', ''))}
                                                            id={taskId}
                                                            className="mt-0.5 w-4 h-4 overflow-hidden rounded-[4px] shrink-0"
                                                          />
                                                          <Label
                                                            htmlFor={taskId}
                                                            className={`text-[13px] cursor-pointer leading-relaxed flex-1 block ${completedTasks.has(taskId.replace('m-', '')) ? "line-through text-slate-400" : "font-semibold text-slate-700"}`}
                                                          >
                                                            {task}
                                                          </Label>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            </Accordion>
                                          </div>

                                          {/* Desktop Classic View */}
                                          <div className="hidden md:block">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 gap-1.5">
                                              <div>
                                                <Badge variant="outline" className="text-[9px] sm:text-[10px] mb-1 sm:mb-1.5 font-semibold">
                                                  STEP {phaseIndex + 1}
                                                </Badge>
                                                <h5 className="font-bold text-[14px] sm:text-base leading-tight mt-0.5 sm:mt-0">{phase.title}</h5>
                                                <p className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-1 sm:mt-1.5">
                                                  <Clock className="w-3.5 h-3.5" /> {phase.duration}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="space-y-2 sm:space-y-2.5 mt-3 sm:mt-4">
                                              {phase.tasks.map((task, taskIndex) => {
                                                const taskId = `${selectedCareer.id}-${phaseIndex}-${taskIndex}`;
                                                return (
                                                  <div key={taskId} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                                    <Checkbox
                                                      checked={completedTasks.has(taskId)}
                                                      onCheckedChange={() => handleTaskToggle(taskId)}
                                                      id={taskId}
                                                      className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 overflow-hidden rounded-[4px] shrink-0"
                                                    />
                                                    <Label
                                                      htmlFor={taskId}
                                                      className={`text-[13px] sm:text-sm cursor-pointer leading-relaxed flex-1 block ${completedTasks.has(taskId) ? "line-through text-muted-foreground" : "font-medium"}`}
                                                    >
                                                      {task}
                                                    </Label>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                            <Link to="/chat" className="flex-1 min-w-[200px]">
                              <Button className="w-full gap-2 h-10 sm:h-11 text-[13px] sm:text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span className="hidden sm:inline">Get AI Guidance for {selectedCareer.name}</span>
                                <span className="sm:hidden">Get AI Guidance</span>
                              </Button>
                            </Link>
                            <Button variant="outline" className="gap-2 h-10 sm:h-11 text-[13px] sm:text-sm flex-1 sm:flex-none">
                              <ExternalLink className="w-4 h-4" />
                              Resources
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-96 text-center px-4">
                    <div className="w-[84px] h-[84px] rounded-[32px] bg-teal-50 text-teal-600 flex items-center justify-center mb-6 shadow-sm border border-teal-100 rotate-3 transition-transform hover:rotate-6">
                      <Route className="w-10 h-10" />
                    </div>
                    <h3 className="text-[22px] font-bold mb-3 text-slate-900">Select a Career Path</h3>
                    <p className="text-slate-500 max-w-[280px] leading-relax text-[15px] font-medium">
                      Pick a career track to instantly generate your personalized step-by-step roadmap.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>

        {showAIRoadmap && selectedCareer && (
          <div className="md:hidden px-4 pb-24 flex flex-col items-center">
             <MagneticButton>
               <Button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  variant="ghost"
                  className="w-full h-14 rounded-full border-white/10 glass hover:bg-white/10 text-foreground font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 mb-4 uppercase tracking-widest text-[13px]"
                >
                  {isExporting ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <FileDown className="w-5 h-5 text-secondary" />}
                  Export Roadmap to PDF
                </Button>
             </MagneticButton>
          </div>
        )}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2025 Nayi Raah. All Rights Reserved. Empowering students across India.
        </div>
      </footer>
    </div>
  );
};

export default Roadmap;
