import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Brain,
  Briefcase,
  Lightbulb,
  Users,
  Wrench,
  FileText,
  LucideIcon,
  Trophy,
  Target,
  Sparkles,
  TrendingUp,
  BookOpen,
  Cpu,
  Palette,
  HeartPulse,
  Scale,
  Building,
  ArrowLeft,
  Zap,
  GraduationCap,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import MagneticButton from "@/components/ui/MagneticButton";
import WordReveal from "../components/ui/WordReveal";
import { useAssessmentResults } from "@/hooks/useAssessmentResults"; // For refreshing results

// Expanded question bank
const questions = {
  interests: [
    {
      id: 1,
      question: "When you have free time at school or home, what do you usually prefer doing?",
      options: [
        { id: "a", icon: Brain, title: "Solving Puzzles or Coding", description: "I love figuring things out, playing strategy games, or tinkering with tech." },
        { id: "b", icon: Palette, title: "Drawing, Writing, or Music", description: "I enjoy being creative, creating art, or expressing my ideas." },
        { id: "c", icon: Users, title: "Hanging Out with Friends", description: "I get my energy from being around people and talking or organizing group activities." },
        { id: "d", icon: Wrench, title: "Building or Fixing Things", description: "I like hands-on activities, sports, or taking things apart to see how they work." },
      ],
    },
    {
      id: 2,
      question: "If you had to pick a club to join at school, which one would it be?",
      options: [
        { id: "a", icon: Cpu, title: "Science or Math Club", description: "Doing experiments, entering competitions, and discovering facts." },
        { id: "b", icon: Lightbulb, title: "Drama or Arts Club", description: "Acting, painting, debating, or writing stories." },
        { id: "c", icon: Heart, title: "Student Council or Volunteer Club", description: "Helping classmates, organizing events, and making a difference." },
        { id: "d", icon: Target, title: "Sports Team or Robotics", description: "Physical action or actively building real-world projects." },
      ],
    },
    {
      id: 3,
      question: "What is your favorite type of assignment?",
      options: [
        { id: "a", icon: FileText, title: "Research Projects", description: "Digging deep into data, facts, and compiling a detailed report." },
        { id: "b", icon: Palette, title: "Creative Presentations", description: "Making colorful slides, posters, or presenting an original idea." },
        { id: "c", icon: Users, title: "Group Work", description: "Collaborating with a team and discussing the topic together." },
        { id: "d", icon: Wrench, title: "Practical Experiments", description: "Doing a lab experiment or creating a physical working model." },
      ],
    },
    {
      id: 4,
      question: "Which of these documentaries would you most likely watch?",
      options: [
        { id: "a", icon: Brain, title: "Mysteries of the Universe", description: "Exploring space, physics, or how things are scientifically connected." },
        { id: "b", icon: Sparkles, title: "Behind the Scenes of a Movie", description: "Seeing how artists create sets, animations, and sound design." },
        { id: "c", icon: Users, title: "Inspiring Leaders in History", description: "Learning about people who changed society and led movements." },
        { id: "d", icon: TrendingUp, title: "How Mega-Structures are Built", description: "Watching engineers design and construct massive buildings or bridges." },
      ],
    },
  ],
  aptitude: [
    {
      id: 5,
      question: "If a shop sells 3 pens for ₹15, how much will 5 pens cost?",
      options: [
        { id: "a", title: "₹20" },
        { id: "b", title: "₹25" },
        { id: "c", title: "₹30" },
        { id: "d", title: "₹35" },
      ],
      correctAnswer: "b",
    },
    {
      id: 6,
      question: "Find the odd one out from this group:",
      options: [
        { id: "a", title: "Apple" },
        { id: "b", title: "Banana" },
        { id: "c", title: "Carrot" },
        { id: "d", title: "Mango" },
      ],
      correctAnswer: "c", // Carrot is a vegetable
    },
    {
      id: 7,
      question: "If tomorrow is Wednesday, what day was yesterday?",
      options: [
        { id: "a", title: "Sunday" },
        { id: "b", title: "Monday" },
        { id: "c", title: "Tuesday" },
        { id: "d", title: "Thursday" },
      ],
      correctAnswer: "b",
    },
    {
      id: 8,
      question: "Rohan walks 5km North, turns Right and walks 5km. Which direction is he facing?",
      options: [
        { id: "a", title: "North" },
        { id: "b", title: "South" },
        { id: "c", title: "East" },
        { id: "d", title: "West" },
      ],
      correctAnswer: "c",
    },
    {
      id: 9,
      question: "What comes next in the sequence: 10, 20, 40, 80, ___?",
      options: [
        { id: "a", title: "100" },
        { id: "b", title: "120" },
        { id: "c", title: "140" },
        { id: "d", title: "160" },
      ],
      correctAnswer: "d",
    },
    {
      id: 10,
      question: "Complete the pair: Book is to Reading as Fork is to...?",
      options: [
        { id: "a", title: "Cooking" },
        { id: "b", title: "Writing" },
        { id: "c", title: "Eating" },
        { id: "d", title: "Kitchen" },
      ],
      correctAnswer: "c",
    },
  ],
  personality: [
    {
      id: 11,
      question: "How do you usually study for a big exam?",
      options: [
        { id: "a", icon: BookOpen, title: "Quietly by Myself", description: "I make a clear schedule and focus on reviewing facts step-by-step." },
        { id: "b", icon: Palette, title: "Using Mind Maps", description: "I use highlighters, drawings, and visual notes to remember better." },
        { id: "c", icon: Users, title: "In a Study Group", description: "I prefer quizzing my friends and discussing the topics out loud." },
        { id: "d", icon: Wrench, title: "Doing Practice Tests", description: "I jump straight into solving past papers and learning from mistakes." },
      ],
    },
    {
      id: 12,
      question: "When you play a team sport or video game, what is your role?",
      options: [
        { id: "a", icon: Target, title: "The Strategist", description: "I figure out the best tactics and plan the team's moves." },
        { id: "b", icon: Lightbulb, title: "The Creative Player", description: "I try unexpected tricks and find creative ways to win." },
        { id: "c", icon: HeartPulse, title: "The Supporter", description: "I make sure my teammates are okay, communicate well, and boost morale." },
        { id: "d", icon: Zap, title: "The Action Taker", description: "I want to be right in the middle of the action doing the heavy lifting." },
      ],
    },
    {
      id: 13,
      question: "Imagine you are building a website for a school project. What part do you want to do?",
      options: [
        { id: "a", icon: Cpu, title: "Writing the Code", description: "I want to handle the logic, database, and make sure it works without bugs." },
        { id: "b", icon: Palette, title: "Designing the Look", description: "I want to pick the colors, fonts, and make it look beautiful." },
        { id: "c", icon: Users, title: "Writing the Content", description: "I want to write the words and make sure the message connects with the readers." },
        { id: "d", icon: Target, title: "Testing and Launching", description: "I want to test all the buttons on my phone and get it published fast." },
      ],
    },
    {
      id: 14,
      question: "What makes you feel most proud of yourself?",
      options: [
        { id: "a", icon: Brain, title: "Solving a Hard Problem", description: "Figuring out a math equation or a puzzle that stumped everyone else." },
        { id: "b", icon: Sparkles, title: "Creating Something New", description: "Finishing a painting, story, or a unique project of my own." },
        { id: "c", icon: Heart, title: "Helping a Friend", description: "Giving good advice or helping someone when they were in trouble." },
        { id: "d", icon: Trophy, title: "Winning or Completing a Task", description: "Crossing the finish line or ticking everything off my checklist." },
      ],
    },
    {
      id: 15,
      question: "If something breaks at home (like a toy or a gadget), what do you do?",
      options: [
        { id: "a", icon: Brain, title: "Search for the Manual", description: "I look up logically why it stopped working before touching it." },
        { id: "b", icon: Lightbulb, title: "Repurpose It", description: "I try to use the broken parts to build something completely different." },
        { id: "c", icon: Users, title: "Ask for Help", description: "I go to my parents or an expert to guide me on fixing it." },
        { id: "d", icon: Wrench, title: "Take It Apart", description: "I immediately take out my screwdriver and open it up to see inside." },
      ],
    },
  ],
};

import { careerPathsData, CareerPath } from "@/data/careers";

const allQuestions = [...questions.interests, ...questions.aptitude, ...questions.personality];

interface AssessmentResults {
  scores: {
    analytical: number;
    creative: number;
    social: number;
    practical: number;
  };
  aptitudeScore: number;
  careerMatches: {
    career: string;
    match: number;
    stream: string;
    icon: LucideIcon;
  }[];
  recommendedStream: string;
}

const Assessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  // Fetch user profile for navbar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const estimatedTimeLeft = Math.ceil((totalQuestions - answeredCount) * 1.5);

  const getCurrentSection = () => {
    if (currentQuestionIndex < 4) return "interests";
    if (currentQuestionIndex < 10) return "aptitude";
    return "personality";
  };

  const getSectionProgress = (sectionId: string) => {
    if (sectionId === "interests") {
      return [1, 2, 3, 4].filter((q) => answers[q]).length;
    }
    if (sectionId === "aptitude") {
      return [5, 6, 7, 8, 9, 10].filter((q) => answers[q]).length;
    }
    return [11, 12, 13, 14, 15].filter((q) => answers[q]).length;
  };

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateResults = (): AssessmentResults => {
    const scores = { analytical: 0, creative: 0, social: 0, practical: 0 };
    let aptitudeCorrect = 0;

    // Calculate personality/interest scores
    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      if (qId <= 4 || qId >= 11) {
        if (answer === "a") scores.analytical += 1;
        if (answer === "b") scores.creative += 1;
        if (answer === "c") scores.social += 1;
        if (answer === "d") scores.practical += 1;
      }
    });

    // Calculate aptitude score
    questions.aptitude.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        aptitudeCorrect++;
      }
    });

    const aptitudeScore = Math.round((aptitudeCorrect / questions.aptitude.length) * 100);

    // Calculate career matches
    const careerMatches = Object.values(careerPathsData).map((career) => {
      let matchScore = 0;
      const totalTraits = Object.values(career.traits).reduce((a, b) => a + b, 0);

      matchScore += (scores.analytical / 9) * (career.traits.analytical / totalTraits) * 100;
      matchScore += (scores.creative / 9) * (career.traits.creative / totalTraits) * 100;
      matchScore += (scores.social / 9) * (career.traits.social / totalTraits) * 100;
      matchScore += (scores.practical / 9) * (career.traits.practical / totalTraits) * 100;

      // Boost by aptitude
      matchScore = matchScore * 0.7 + aptitudeScore * 0.3;

      return {
        career: career.name,
        match: Math.min(Math.round(matchScore), 99),
        stream: career.stream,
        icon: career.icon,
      };
    }).sort((a, b) => b.match - a.match).slice(0, 5);

    // Determine recommended stream
    let recommendedStream = "Science";
    if (scores.creative > scores.analytical && scores.creative > scores.practical) {
      recommendedStream = "Arts";
    } else if (scores.social > scores.analytical && scores.practical >= scores.analytical) {
      recommendedStream = "Commerce";
    }

    return { scores, aptitudeScore, careerMatches, recommendedStream };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);

      if (user) {
        await supabase.from("assessment_results").insert({
          user_id: user.id,
          assessment_type: "comprehensive",
          scores: {
            ...calculatedResults.scores,
            aptitudeScore: calculatedResults.aptitudeScore,
            recommendedStream: calculatedResults.recommendedStream,
          },
          career_matches: calculatedResults.careerMatches.map(c => ({
            match: c.match,
            stream: c.stream,
          })),
        });
      }

      toast({
        title: "Assessment Completed!",
        description: "Your personalized results are ready.",
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Results Ready",
        description: "View your personalized career recommendations below.",
      });
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Results Screen
  if (results) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Lightweight Base Background */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-background to-background" />

        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
            <div className="flex-1 flex justify-start">
              <button 
                onClick={() => navigate("/dashboard")} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Dashboard</span>
              </button>
            </div>
            
            <div className="flex-none">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">Nayi Raah</span>
              </Link>
            </div>

            <div className="flex-1" />
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Assessment Complete!</h1>
              <p className="text-muted-foreground">Here are your personalized career recommendations</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            >
              <Card className="mb-10 overflow-hidden border border-slate-200 dark:border-slate-800 bg-card group relative rounded-[3rem] shadow-xl">
                <CardContent className="p-10 md:p-20 text-center relative z-10">
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-md text-slate-800 border border-white/30 px-6 py-2 rounded-full mb-8 shadow-sm"
                  >
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Your Strategic Path</span>
                  </motion.div>
                  <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none group-hover:scale-[1.02] transition-transform duration-700">
                    {results.recommendedStream}
                  </h2>
                  <p className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                    Our AI has identified an exceptional alignment between your <span className="text-primary font-bold">cognitive strengths</span> and this professional domain.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Cards */}
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 text-center">Core Dimensions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Analytical", value: results.scores.analytical, max: 9, color: "primary", icon: Brain },
                { label: "Creative", value: results.scores.creative, max: 9, color: "secondary", icon: Sparkles },
                { label: "Social", value: results.scores.social, max: 9, color: "accent", icon: Heart },
                { label: "Practical", value: results.scores.practical, max: 9, color: "warning", icon: Briefcase },
              ].map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <Card className="bg-card border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm group">
                    <CardContent className="p-6 text-center relative">
                       <div className={`absolute top-0 left-0 w-full h-1 bg-${score.color} opacity-20`} />
                       <div className={`w-14 h-14 rounded-2xl bg-${score.color}/10 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                         <score.icon className={`w-6 h-6 text-${score.color}`} />
                       </div>
                       <div className="text-3xl font-black tracking-tighter mb-1">
                         {Math.round((score.value / score.max) * 100)}%
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{score.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detailed Breakdown */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
               {/* Aptitude */}
               <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-1"
              >
                <Card className="h-full bg-card border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
                      <Brain className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Technical Aptitude</h3>
                    <p className="text-sm text-slate-400 font-medium mb-6">Logical reasoning and problem-solving capacity.</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-4xl font-black text-success tracking-tighter">{results.aptitudeScore}%</span>
                        <Badge variant="outline" className="text-[10px] font-bold border-success/30 text-success bg-success/5 uppercase px-3 py-1">Top Tier</Badge>
                      </div>
                      <Progress value={results.aptitudeScore} className="h-2.5 bg-success/10" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Career Matches */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="bg-card border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Target className="w-6 h-6 text-primary" />
                        Specific Career Paths
                      </h3>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ranked by Match</span>
                    </div>
                    <div className="space-y-4">
                      {results.careerMatches.map((career, index) => {
                        const Icon = career.icon;
                        return (
                          <div key={index} className="group flex items-center gap-5 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-center mb-2">
                                 <h4 className="font-bold text-slate-800 tracking-tight">{career.career}</h4>
                                 <span className="text-xs font-black text-primary">{career.match}%</span>
                               </div>
                               <Progress value={career.match} className="h-1.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-5 justify-center mt-12"
            >
              <MagneticButton>
                <Link to="/roadmap">
                  <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-2xl shadow-primary/30 border-0 gap-3">
                    <Target className="w-5 h-5 fill-current" />
                    Build My Roadmap
                  </Button>
                </Link>
              </MagneticButton>
              
              <Link to="/chat">
                <Button variant="ghost" className="h-16 px-8 rounded-2xl border border-slate-200 glass text-slate-600 font-bold uppercase tracking-widest hover:bg-slate-50 gap-3">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Ask AI Counselor
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button variant="ghost" className="h-16 px-8 rounded-2xl border-transparent text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600">
                  Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-12 overflow-hidden">
      {/* Lightweight Base Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 flex justify-start">
              <button 
                onClick={() => navigate("/dashboard")} 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group"
              >
                <div className="p-2 rounded-full hover:bg-muted/20 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs">Back to Dashboard</span>
              </button>
            </div>

            <div className="flex-none">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Nayi Raah</span>
              </Link>
            </div>

            <div className="flex-1" />
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-24 pb-8 md:pb-12 px-4 flex-1 flex flex-col">
        <div className="container mx-auto max-w-6xl flex-1 flex flex-col relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-14 shrink-0"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter text-slate-800">
                Strategic <span className="text-primary italic font-serif">Assessment</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg font-medium">
              Mapping your potential across {totalQuestions} specialized dimensions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 items-start relative">
            {/* Left Sidebar */}
            <div className="space-y-4 hidden lg:block sticky top-24">
              {/* Progress Card */}
              <Card className="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-[#0f172a]/40 mb-4">Overall Progress</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black tracking-tighter">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{answeredCount}/{totalQuestions} Qs</span>
                    </div>
                    <Progress value={(answeredCount / totalQuestions) * 100} className="h-2 bg-primary/5 border border-primary/5" />
                    <div className="flex items-center gap-2 text-[11px] font-bold text-warning uppercase tracking-wider pt-1">
                      <Zap className="w-3.5 h-3.5 fill-warning" />
                      ~{estimatedTimeLeft} min remaining
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <Card className="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#0f172a]/40 mb-4 px-1">Assessment Units</h3>
                  <div className="space-y-2">
                    {[
                      { id: "interests", name: "Interests", icon: Heart, total: 4 },
                      { id: "aptitude", name: "Aptitude", icon: Brain, total: 6 },
                      { id: "personality", name: "Personality", icon: Briefcase, total: 5 },
                    ].map((section) => {
                      const Icon = section.icon;
                      const answered = getSectionProgress(section.id);
                      const isCurrent = getCurrentSection() === section.id;
                      const isComplete = answered === section.total;
                      
                      return (
                        <div
                          key={section.id}
                          className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${isCurrent ? "bg-primary/10 ring-1 ring-primary/20 shadow-lg shadow-primary/5" : "bg-transparent hover:bg-muted/10"}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? "bg-success/15 shadow-inner" : isCurrent ? "bg-primary/20" : "bg-muted/40"
                            }`}>
                            <Icon className={`w-4 h-4 ${isComplete ? "text-success" : isCurrent ? "text-primary" : "text-slate-400"
                               }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold leading-none mb-1 ${isCurrent ? "text-slate-800" : "text-slate-500"}`}>{section.name}</p>
                            <div className="flex items-center gap-2">
                               <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all duration-500 ${isComplete ? 'bg-success' : 'bg-primary'}`} style={{ width: `${(answered/section.total)*100}%` }} />
                               </div>
                               <span className="text-[10px] font-black text-slate-300">{answered}/{section.total}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Question Grid */}
              <Card className="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hidden lg:block hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#0f172a]/40 mb-4 px-1">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {allQuestions.map((q, index) => {
                      const isAnswered = !!answers[q.id];
                      const isCurrent = index === currentQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => jumpToQuestion(index)}
                          className={`w-9 h-9 rounded-xl text-[11px] font-black flex items-center justify-center transition-all duration-300 cursor-pointer border ${
                            isCurrent
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10"
                              : isAnswered
                                ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                                : "bg-slate-50 text-slate-400 border-slate-100 hover:border-primary/30"
                            }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="border-border shadow-sm">
                <CardContent className="p-4 sm:p-6 flex flex-col">
                  {/* Mobile Progress Bar (Hidden on Desktop) */}
                  <div className="lg:hidden mb-5 shrink-0 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium capitalize">{getCurrentSection()} Section</span>
                      <span className="font-bold text-primary">{answeredCount}/{totalQuestions}</span>
                    </div>
                    <Progress value={(answeredCount / totalQuestions) * 100} className="h-2 bg-primary/10" />
                  </div>

                  {/* Question Header Desktop */}
                  <div className="hidden lg:flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {currentQuestionIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{getCurrentSection()} Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </p>
                    </div>
                  </div>

                  {/* Single Question Container */}
                  <div className="flex-1 flex flex-col">
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <h2 className="text-[17px] sm:text-2xl font-bold mb-4 sm:mb-6 leading-snug">{currentQuestion.question}</h2>

                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswer}
                        className="space-y-2.5 sm:space-y-3 pb-2 flex-1"
                      >
                        {currentQuestion.options.map((option, idx) => {
                          const hasIcon = 'icon' in option && option.icon;
                          const IconComponent = hasIcon ? (option as { icon: LucideIcon }).icon : null;
                          const isSelected = answers[currentQuestion.id] === option.id;
                          const description = 'description' in option ? option.description : undefined;

                          return (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.4 }}
                            >
                              <Label
                                htmlFor={`option-${option.id}`}
                                className={`group relative flex items-start gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${isSelected
                                    ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(var(--primary),0.08)] ring-1 ring-primary/10 scale-[1.01]"
                                    : "border-slate-100 glass dark:glass-dark hover:border-primary/30 hover:bg-slate-50/50"
                                  }`}
                              >
                                <div className="flex items-center h-5 mt-1 shrink-0">
                                  <RadioGroupItem
                                    value={option.id}
                                    id={`option-${option.id}`}
                                    className="shrink-0 border-2"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col min-w-0">
                                  <div className="flex items-start sm:items-center gap-3 mb-1">
                                    {IconComponent && (
                                      <div className={`p-2 rounded-lg transition-colors duration-500 ${isSelected ? 'bg-primary/20' : 'bg-slate-100'}`}>
                                        <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400 opacity-90'}`} />
                                      </div>
                                    )}
                                    <h4 className={`font-bold text-[15px] sm:text-lg leading-tight transition-colors duration-500 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                      {option.title}
                                    </h4>
                                  </div>
                                  {description && (
                                    <p className={`text-[13px] sm:text-[14px] leading-relaxed pl-1 sm:pl-12 transition-colors duration-500 ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>
                                      {description}
                                    </p>
                                  )}
                                </div>
                                
                                {isSelected && (
                                  <motion.div 
                                    layoutId="active-glow"
                                    className="absolute inset-0 rounded-2xl border-primary/20 pointer-events-none shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]"
                                  />
                                )}
                              </Label>
                            </motion.div>
                          );
                        })}
                      </RadioGroup>
                    </motion.div>
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex flex-row items-center justify-between gap-2.5 sm:gap-4 mt-6 pt-5 sm:pt-6 border-t border-border bg-background sm:bg-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Button
                      variant="ghost"
                      onClick={goToPrevious}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1 sm:flex-none h-12 px-6 rounded-xl border border-slate-200 glass text-slate-500 font-bold uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </Button>

                    <div className="flex gap-2.5 sm:gap-3 flex-1 sm:flex-none">
                      {currentQuestionIndex === totalQuestions - 1 ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || answeredCount < totalQuestions}
                          className="bg-success hover:bg-success/90 w-full sm:w-auto h-12 px-8 rounded-xl text-white font-bold uppercase tracking-widest shadow-lg shadow-success/20 border-0"
                        >
                          {isSubmitting ? "Processing" : "See Results"}
                          <Trophy className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={goToNext} 
                          disabled={!answers[currentQuestion.id]} 
                          className="w-full sm:w-auto h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-lg shadow-primary/20 border-0"
                        >
                          Next
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Question Grid */}
              <Card className="border-border mt-4 hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-8 gap-1.5">
                    {allQuestions.map((q, index) => {
                      const isAnswered = answers[q.id];
                      const isCurrent = index === currentQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => jumpToQuestion(index)}
                          className={`w-8 h-8 rounded text-xs font-medium transition-colors ${isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isAnswered
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
