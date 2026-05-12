import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  ExternalLink, 
  Building2, 
  X,
  Sparkles,
  Award,
  TrendingUp,
  Map,
  Compass,
  ChevronRight,
  ArrowRight,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { colleges, collegeTypes, indianStates, streamOptions, type College } from "@/data/colleges";

const Colleges = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [streamFilter, setStreamFilter] = useState<string>("all");

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

  const filtered = useMemo(() => {
    return colleges.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName?.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || c.type === typeFilter;
      const matchState = stateFilter === "all" || c.state === stateFilter;
      const matchStream = streamFilter === "all" || c.streams.includes(streamFilter);
      return matchSearch && matchType && matchState && matchStream;
    });
  }, [search, typeFilter, stateFilter, streamFilter]);

  const activeFilters = [typeFilter, stateFilter, streamFilter].filter((f) => f !== "all").length;

  const clearFilters = () => {
    setTypeFilter("all");
    setStateFilter("all");
    setStreamFilter("all");
    setSearch("");
  };

  const typeColor = (type: College["type"]) => {
    const map: Record<string, string> = {
      IIT: "bg-primary/10 text-primary border-primary/20",
      NIT: "bg-secondary/10 text-secondary border-secondary/20",
      IIIT: "bg-accent/10 text-accent border-accent/20",
      Central: "bg-success/10 text-success border-success/20",
      State: "bg-warning/10 text-warning border-warning/20",
      Private: "bg-muted text-muted-foreground border-border",
      Deemed: "bg-muted text-muted-foreground border-border",
    };
    return map[type] || "";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Clean background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background" />

      <DashboardNavbar userName={profile?.full_name} avatarUrl={profile?.avatar_url} />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Cinematic Hero Section */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 md:p-10 text-white min-h-[220px] md:min-h-[280px] flex items-center group mb-2 shadow-sm"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                src="/colleges-animated.png" 
                alt="Animated Students Campus Scene" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[transition-duration:3000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent z-10" />
            </div>

            {/* Floating Animated Elements (Simplified Characters/Icons) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[15%] w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl"
              >
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[10%] left-[40%] w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center"
              >
                <Compass className="w-6 h-6 text-secondary" />
              </motion.div>
            </div>
            
            <div className="relative z-20 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Premium Directory
                </Badge>
              </div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]"
              >
                Your <span className="text-secondary italic font-serif underline decoration-primary/40 underline-offset-4">Premium</span> Guide <br />
                to India's Best Education
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-slate-300 text-sm md:text-base max-w-lg mb-6 leading-relaxed"
              >
                Join thousands of students on their journey to top-tier institutions. 
                Explore vibrant campus lives and secure your academic legacy.
              </motion.p>

              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 text-slate-200">
                  <Award className="w-3.5 h-3.5 text-primary" /> NIRF Rankings
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 text-slate-200">
                  <Map className="w-3.5 h-3.5 text-secondary" /> Pan-India Coverage
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div 
            variants={itemVariants} 
            className="sticky top-[72px] z-40 p-2 sm:p-3 rounded-2xl bg-card border border-slate-200 dark:border-slate-800 shadow-md transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by name, city or abbreviation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 rounded-xl h-12 bg-white/50 border-white/40 focus:bg-white transition-all text-[13px] md:text-sm shadow-none focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-3 md:flex lg:flex-initial gap-2.5">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="rounded-xl h-12 px-3 text-[11px] sm:text-sm bg-white/50 border-white/40 hover:bg-white transition-all min-w-[100px] md:min-w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-card shadow-lg">
                    <SelectItem value="all">All Types</SelectItem>
                    {collegeTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="rounded-xl h-12 px-3 text-[11px] sm:text-sm bg-white/50 border-white/40 hover:bg-white transition-all min-w-[100px] md:min-w-[140px]">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-card shadow-lg">
                    <SelectItem value="all">All States</SelectItem>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={streamFilter} onValueChange={setStreamFilter}>
                  <SelectTrigger className="rounded-xl h-12 px-3 text-[11px] sm:text-sm bg-white/50 border-white/40 hover:bg-white transition-all min-w-[100px] md:min-w-[140px]">
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-card shadow-lg">
                    <SelectItem value="all">All Streams</SelectItem>
                    {streamOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {activeFilters > 0 && (
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-primary" /> 
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{activeFilters} filters</span>
                  <span>{filtered.length} results</span>
                </span>
                <Button variant="ghost" size="sm" className="h-8 text-xs px-3 hover:bg-primary/5 text-slate-500 hover:text-primary rounded-lg transition-all" onClick={clearFilters}>
                  <X className="w-3.5 h-3.5 mr-1.5" /> Clear All
                </Button>
              </div>
            )}
          </motion.div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-full py-20 bg-card border border-slate-200 dark:border-slate-800 rounded-[32px] text-center shadow-sm"
                >
                  <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-muted">
                    <GraduationCap className="w-10 h-10 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No colleges match your criteria</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto px-4">
                    Try adjusting your filters or search keywords to explore more options.
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="mt-6 rounded-xl">Reset All Filters</Button>
                </motion.div>
              ) : (
                filtered.map((college, idx) => (
                  <motion.div
                    key={college.id}
                    variants={itemVariants}
                    layout
                    className="group"
                  >
                    <Card className="rounded-[28px] border-slate-200 dark:border-slate-800 bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col overflow-hidden">
                      <CardContent className="p-6 flex flex-col h-full relative">
                        {/* Status/Rank Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-lg border-0 shadow-sm ${typeColor(college.type)}`}>
                            {college.type}
                          </Badge>
                          {college.nirfRank && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/50">
                              <Star className="w-3 h-3 text-warning fill-warning" />
                              NIRF #{college.nirfRank}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug mb-1">
                            {college.shortName || college.name}
                          </h3>
                          <p className="text-[13px] text-muted-foreground line-clamp-1 mb-4 flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 opacity-60" /> {college.name}
                          </p>

                            <div className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                              <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="line-clamp-1">{college.city}, {college.state}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100/50 flex flex-col gap-4">
                          <div className="flex flex-wrap gap-1.5">
                            {college.streams.slice(0, 3).map((s) => (
                              <Badge key={s} variant="secondary" className="text-[11px] px-2.5 py-0.5 rounded-lg border-transparent bg-slate-100/50 text-slate-600 font-medium">{s}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {college.exams.slice(0, 1).map((e) => (
                                <span key={e} className="text-[11px] font-bold text-primary flex items-center gap-1">
                                  <ChevronRight className="w-3 h-3" /> {e} Recognized
                                </span>
                              ))}
                            </div>
                            <Button size="icon" variant="ghost" className="w-9 h-9 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Colleges;
