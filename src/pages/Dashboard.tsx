import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardCheck,
  MessageCircle,
  Map,
  User,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
  Star,
  Building2,
  TrendingUp,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import MagneticButton from "@/components/ui/MagneticButton";
import { useAssessmentResults } from "@/hooks/useAssessmentResults";
import { useSavedScholarships } from "@/hooks/useSavedScholarships";
import { getSavedDeadlineReminders } from "@/utils/deadlineUtils";
import { DeadlineReminders } from "@/components/scholarships/DeadlineReminders";

interface Profile {
  full_name: string;
  education_level: string | null;
  interests: string[] | null;
  district: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { latestResult, recommendedPaths } = useAssessmentResults();
  const { savedIds } = useSavedScholarships();
  const deadlineReminders = getSavedDeadlineReminders(savedIds);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);

      const [profileRes, assessmentRes, chatRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, education_level, interests, district, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("assessment_results")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("chat_history")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      setAssessmentCount(assessmentRes.count || 0);
      setChatCount(chatRes.count || 0);
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completed = 1;
    if (profile.education_level) completed++;
    if (profile.interests && profile.interests.length > 0) completed++;
    if (profile.district) completed++;
    return Math.round((completed / 4) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const topCareers = recommendedPaths.slice(0, 3);

  const progressSteps = [
    {
      title: "Complete Profile",
      status: profileCompletion >= 100 ? "completed" : "in-progress",
      description: "Add education, interests & location",
      href: "/profile",
    },
    {
      title: "Take Aptitude Test",
      status: assessmentCount > 0 ? "completed" : "pending",
      description: "Discover your strengths",
      href: "/assessment",
    },
    {
      title: "Explore Career Matches",
      status: assessmentCount > 0 ? "completed" : "pending",
      description: "AI-matched career options",
      href: "/roadmap",
    },
    {
      title: "Generate Roadmap",
      status: localStorage.getItem("roadmap_generated") === "true" ? "completed" : "pending",
      description: "Get your step-by-step plan",
      href: "/roadmap",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar userName="Loading..." />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-5">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Lightweight Base Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-background to-background" />

      <DashboardNavbar
        userName={profile?.full_name || "Student"}
        avatarUrl={profile?.avatar_url || undefined}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* ── Mobile Hero ── */}
          <motion.div variants={itemVariants} className="md:hidden pt-2 pb-6 px-1">
            <h1 className="text-[52px] font-extrabold tracking-tight leading-[1.05] text-slate-900 mb-4 font-display">
              Navigate.<br />
              <span className="font-serif italic text-teal-600 font-normal tracking-normal">Your future.</span>
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-[280px] mb-8 font-medium">
              Discover scholarships, explore career paths, and plan your journey across India.
            </p>
          </motion.div>

          {/* ── Desktop Hero Banner ── */}
          <motion.div
            variants={itemVariants}
            className="hidden md:grid grid-cols-12 gap-6 relative overflow-hidden rounded-[2rem] bg-card border border-slate-200 dark:border-slate-800 shadow-lg p-0 text-slate-950 min-h-[360px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-slate-100 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/10" />

            <div className="relative z-10 col-span-7 flex flex-col justify-center gap-5 px-8 lg:px-10 py-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm">
                Welcome back
              </span>
              <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {currentDate}
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-tight font-display max-w-2xl text-slate-950">
                {getGreeting()}, {profile?.full_name?.split(" ")[0] || "Student"}!
              </h1>
              <p className="text-slate-600 max-w-xl text-base leading-relaxed">
                {profileCompletion < 100
                  ? "Complete your profile to unlock personalized career and scholarship matches."
                  : assessmentCount > 0
                  ? `You have ${topCareers.length} career matches waiting. Build your roadmap with confidence.`
                  : "Ready to discover your potential? Start your journey with a quick assessment."}
              </p>
              <div>
                <Link to={profileCompletion < 100 ? "/profile" : assessmentCount > 0 ? "/roadmap" : "/assessment"}>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2.5 rounded-2xl h-14 px-8 shadow-sm transition-all duration-200"
                  >
                    {profileCompletion < 100 ? (
                      <User className="w-5 h-5" />
                    ) : assessmentCount > 0 ? (
                      <Map className="w-5 h-5" />
                    ) : (
                      <ClipboardCheck className="w-5 h-5" />
                    )}
                    {profileCompletion < 100 ? "Complete Profile" : assessmentCount > 0 ? "View Roadmap" : "Take Assessment"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 col-span-5 overflow-hidden rounded-[2rem] min-h-[360px] bg-gradient-to-br from-primary/10 via-white to-slate-100 border border-slate-200 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(to_bottom,_rgba(255,255,255,0.92),_rgba(248,250,252,0.92))]" />
              <img
                src="/Welcome.gif"
                alt="Welcome animation"
                className="relative w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* ── Bento Grid Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: User, value: `${profileCompletion}%`, label: "Profile", color: "text-primary", bg: "bg-primary/10", progress: profileCompletion },
              { icon: ClipboardCheck, value: assessmentCount.toString(), label: "Assessments", color: "text-secondary", bg: "bg-secondary/10", progress: Math.min((assessmentCount / 3) * 100, 100) },
              { icon: Target, value: assessmentCount > 0 ? topCareers.length.toString() : "—", label: "Matches", color: "text-accent", bg: "bg-accent/10", progress: assessmentCount > 0 ? 100 : 0 },
              { icon: MessageCircle, value: chatCount.toString(), label: "AI Chats", color: "text-success", bg: "bg-success/10", progress: Math.min((chatCount / 10) * 100, 100) },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="border border-slate-200 dark:border-slate-800 bg-card rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/5 transition-all duration-300 h-full">
                  <CardContent className="p-3 sm:p-4">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                      <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`} />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold tracking-tight font-display">{stat.value}</p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <Progress value={stat.progress} className="h-1 mt-2 bg-muted/20" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ── Bento Main Content ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Career Matches */}
            <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2">
              <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-sm rounded-[2rem] h-full overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-6 px-6">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 font-display uppercase tracking-widest text-accent">
                    <Star className="w-4 h-4" />
                    Top Career Matches
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {assessmentCount > 0 && topCareers.length > 0 ? (
                    <div className="space-y-3">
                      {topCareers.map((career, index) => (
                        <Link key={career.id} to="/roadmap">
                          <div className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all group">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                              #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate uppercase tracking-tighter">{career.name}</p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {career.stream} stream
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xl font-black text-primary transition-transform group-hover:scale-110 block">{career.matchScore}%</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link to="/roadmap" className="mx-auto w-fit text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 pt-2 transition-colors uppercase tracking-widest">
                        View Detailed Analysis <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-3xl bg-muted/20 flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground/80 mb-5 px-6">Discover your ideal path. Take our assessment to unlock personalized matches.</p>
                      <Link to="/assessment">
                        <Button size="sm" className="gap-2 rounded-xl font-bold uppercase tracking-wider h-11 px-8 shadow-xl shadow-primary/15">
                          <Zap className="w-4 h-4" /> Start Assessment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Journey Progress */}
            <motion.div variants={itemVariants}>
              <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-sm rounded-[2rem] h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-6 px-6">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 font-display uppercase tracking-widest text-primary">
                    <GraduationCap className="w-4 h-4" />
                    Your Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-2.5">
                    {progressSteps.map((step, index) => (
                      <Link key={index} to={step.href} className="block group">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black shadow-sm ${step.status === "completed"
                                ? "bg-success text-success-foreground"
                                : step.status === "in-progress"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                          >
                            {step.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate group-hover:text-primary transition-colors ${step.status === "pending" ? "text-muted-foreground/70" : ""}`}>
                              {step.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights Card */}
            <motion.div variants={itemVariants}>
              <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-sm rounded-[2rem] h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold font-display uppercase tracking-widest">AI Insights</span>
                  </div>
                  {assessmentCount > 0 && latestResult ? (
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Analytic", value: latestResult.scores.analytical || 0 },
                          { label: "Creative", value: latestResult.scores.creative || 0 },
                          { label: "Social", value: latestResult.scores.social || 0 },
                          { label: "Practical", value: latestResult.scores.practical || 0 },
                        ].map((t) => (
                          <div key={t.label} className="bg-muted/40 rounded-xl p-2.5 text-center group cursor-default hover:bg-muted/60 transition-colors">
                            <p className="text-xl font-black text-primary font-display">{t.value}<span className="text-[10px] text-muted-foreground font-medium ml-0.5">/9</span></p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{t.label}</p>
                          </div>
                        ))}
                      </div>
                      <Link to="/chat">
                        <Button size="sm" className="w-full gap-2 text-xs font-bold uppercase tracking-wider h-10 rounded-xl">
                          <MessageCircle className="w-4 h-4" /> Ask Expert AI
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <MessageCircle className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-muted-foreground text-xs font-medium mb-4 leading-relaxed">Personalized career analysis is waiting for you.</p>
                      <Link to="/assessment">
                        <Button size="sm" className="gap-2 text-xs font-bold uppercase tracking-widest h-9 px-6 rounded-lg">
                          Unlock <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Bottom Row: Quick Actions ── */}
          <motion.div variants={itemVariants}>
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 snap-x hide-scrollbar">
              {[
                { title: "Assessment", desc: "Discover strengths", icon: ClipboardCheck, href: "/assessment", gradient: "from-primary to-primary/80" },
                { title: "AI Counselor", desc: "Career guidance", icon: MessageCircle, href: "/chat", gradient: "from-secondary to-secondary/80" },
                { title: "Roadmap", desc: "Step-by-step plan", icon: Map, href: "/roadmap", gradient: "from-accent to-accent/80" },
                { title: "Colleges", desc: "Browse all India", icon: Building2, href: "/colleges", gradient: "from-success to-success/80" },
                { title: "Profile", desc: "Update details", icon: User, href: "/profile", gradient: "from-primary to-secondary" },
              ].map((action, i) => (
                <MagneticButton key={i} distance={0.1}>
                  <Link to={action.href} className="min-w-[130px] sm:min-w-0 shrink-0 snap-start block h-full">
                    <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-sm rounded-2xl hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all group h-full duration-300">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shadow-primary/10`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-black tracking-tight uppercase font-display">{action.title}</p>
                          <p className="text-[10px] text-muted-foreground hidden lg:block opacity-60 font-bold uppercase tracking-tighter">{action.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </MagneticButton>
              ))}
            </div>
          </motion.div>

          {/* ── Bottom Row: Deadlines + Help ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <DeadlineReminders reminders={deadlineReminders} maxItems={4} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-primary/20 rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12">
                    <Compass className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-black text-xl mb-2 font-display uppercase tracking-widest">Need Guidance?</h3>
                  <p className="text-xs text-muted-foreground mb-6 max-w-[280px] leading-relaxed font-medium">
                    Chat with our AI counselor for instant, personalized career advice for students across India.
                  </p>
                  <MagneticButton>
                    <Link to="/chat">
                      <Button className="gap-2 h-11 px-8 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                        <Sparkles className="w-4 h-4" />
                        Start Free Chat
                      </Button>
                    </Link>
                  </MagneticButton>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Student Resources ── */}
          <motion.div variants={itemVariants}>
            <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-sm rounded-[2rem] hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-bold flex items-center gap-2 font-display uppercase tracking-widest text-secondary">
                  <BookOpen className="w-4 h-4" />
                  Student Resources & Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6">
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 snap-x hide-scrollbar">
                  {[
                    {
                      title: "Scholarship Finder",
                      desc: "Find national grants",
                      icon: GraduationCap,
                      color: "text-primary",
                      bg: "bg-primary/10",
                      href: "/scholarships",
                      tip: "Browse and filter scholarships by state, category, and education level",
                    },
                    {
                      title: "Exam Calendar",
                      desc: "Upcoming dates",
                      icon: Calendar,
                      color: "text-destructive",
                      bg: "bg-destructive/10",
                      href: "/roadmap",
                      tip: "View entrance exam dates in your career roadmap",
                    },
                    {
                      title: "Study Tips",
                      desc: "AI study advice",
                      icon: Zap,
                      color: "text-accent",
                      bg: "bg-accent/10",
                      href: "/chat",
                      tip: "Get personalized study tips from our AI counselor",
                    },
                    {
                      title: "Career Trends",
                      desc: "Industry growth",
                      icon: TrendingUp,
                      color: "text-success",
                      bg: "bg-success/10",
                      href: "/chat",
                      tip: "Explore trending careers and industry growth data",
                    },
                  ].map((resource, i) => (
                    <Tooltip key={i} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link to={resource.href} className="min-w-[150px] sm:min-w-0 shrink-0 snap-start block">
                          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all text-center group cursor-pointer h-full">
                            <div className={`w-11 h-11 rounded-2xl ${resource.bg} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                              <resource.icon className={`w-5 h-5 ${resource.color}`} />
                            </div>
                            <p className="text-sm font-bold group-hover:text-primary transition-colors font-display uppercase tracking-tight">{resource.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">{resource.desc}</p>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="rounded-xl border-slate-200 dark:border-slate-800 bg-card shadow-xl">
                        <p className="text-[10px] font-bold uppercase tracking-wider max-w-[200px] leading-relaxed text-slate-800 dark:text-slate-200">{resource.tip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Developed for Future Leaders</p>
          <p className="text-muted-foreground/60 text-[9px] uppercase tracking-widest">
            © 2025 Nayi Raah. Empowering student excellence across India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
