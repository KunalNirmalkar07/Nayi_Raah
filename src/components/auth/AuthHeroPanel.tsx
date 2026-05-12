import { useState, useEffect } from "react";
import {
  Star, CheckCircle2, Sparkles, GraduationCap, BookOpen, Target,
  Brain, Map, TrendingUp, Users, Award, Zap, ArrowRight,
  ClipboardCheck, MessageCircle, BarChart3, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const successStories = [
  {
    name: "Arjun Kumar",
    role: "NIT Srinagar — B.Tech CSE",
    quote: "Nayi Raah's AI recommendations were spot-on. Got into my dream college with a clear preparation roadmap.",
    initials: "AK",
  },
  {
    name: "Priya Sharma",
    role: "Govt. Women's College, Jammu",
    quote: "Discovered my passion for biotechnology. The aptitude test revealed strengths I never knew I had.",
    initials: "PS",
  },
  {
    name: "Mohit Singh",
    role: "CA Aspirant, Baramulla",
    quote: "Chose Commerce stream confidently after the career matching. Now preparing for CA with clear goals.",
    initials: "MS",
  },
];

const stats = [
  { value: "2,500+", label: "Students Guided", icon: Users },
  { value: "92%", label: "Satisfaction Rate", icon: Star },
  { value: "45+", label: "Partner Colleges", icon: GraduationCap },
  { value: "85%", label: "Enrollment Boost", icon: TrendingUp },
];

const featureHighlights = [
  { icon: Brain, label: "AI Counselor", desc: "24/7 personalized career advice" },
  { icon: ClipboardCheck, label: "Assessments", desc: "Deep aptitude analysis" },
  { icon: Map, label: "Roadmaps", desc: "Step-by-step career paths" },
  { icon: BarChart3, label: "Progress", desc: "Track your milestones" },
];

const trustBadges = [
  { icon: Shield, text: "Verified & Secure" },
  { icon: Award, text: "Award Winning AI" },
  { icon: Zap, text: "Instant Results" },
];

const recentActivity = [
  { name: "Kavya M.", action: "Got admission to IIT Bombay", time: "2m ago" },
  { name: "Rohan D.", action: "Completed aptitude assessment", time: "5m ago" },
  { name: "Simran K.", action: "Generated career roadmap", time: "8m ago" },
];

const AuthHeroPanel = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const storyInterval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % successStories.length);
    }, 4500);
    return () => clearInterval(storyInterval);
  }, []);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % recentActivity.length);
    }, 3000);
    return () => clearInterval(activityInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="hidden lg:flex flex-col gap-4 h-full"
    >
      {/* ─── Main Hero Card ─── */}
      <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-primary-foreground overflow-hidden flex-1">
        {/* Static ambient orbs — no animation blur cost */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-[0.2em]">AI-Powered Guidance</span>
            </div>
            <h2 className="text-3xl font-display font-bold leading-tight mb-1">
              Your Dream Career
              <br />
              <span className="text-accent">Starts Here.</span>
            </h2>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Thousands of students across J&K found their path. Now it's your turn with AI-powered career clarity.
            </p>
          </motion.div>

          {/* 4-icon Feature Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {featureHighlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 bg-primary-foreground/8 border border-primary-foreground/10 rounded-xl p-3 hover:bg-primary-foreground/14 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-primary-foreground/90">{item.label}</div>
                  <div className="text-[10px] text-primary-foreground/50 leading-tight">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
                className="bg-primary-foreground/10 rounded-xl p-2.5 text-center border border-primary-foreground/5"
              >
                <stat.icon className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                <div className="text-base font-bold leading-none">{stat.value}</div>
                <div className="text-[9px] text-primary-foreground/50 mt-0.5 leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="space-y-1.5 mb-5"
          >
            {[
              "Personalized AI career recommendations",
              "Comprehensive aptitude & interest tests",
              "Step-by-step roadmaps with milestones",
              "J&K government college directory",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="text-xs text-primary-foreground/70">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="mt-auto bg-primary-foreground/8 border border-primary-foreground/10 rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-primary-foreground/50 font-semibold uppercase tracking-wider">Live Activity</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activityIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {recentActivity[activityIndex].name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary-foreground/90">
                    {recentActivity[activityIndex].name}
                  </span>
                  <span className="text-[11px] text-primary-foreground/55 ml-1">
                    {recentActivity[activityIndex].action}
                  </span>
                </div>
                <span className="text-[10px] text-primary-foreground/40 shrink-0">
                  {recentActivity[activityIndex].time}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ─── Testimonial Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-md relative overflow-hidden"
      >
        {/* Subtle gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary)), transparent)" }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-3 italic leading-relaxed">
              "{successStories[activeStory].quote}"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {successStories[activeStory].initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground leading-none">
                  {successStories[activeStory].name}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {successStories[activeStory].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4">
          {successStories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStory(i)}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === activeStory ? 24 : 8 }}
            >
              <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
              {i === activeStory && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Trust badges row */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-1">
              <badge.icon className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">{badge.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthHeroPanel;
