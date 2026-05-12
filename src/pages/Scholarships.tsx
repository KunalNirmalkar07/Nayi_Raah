import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useScholarshipRecommendations, type RecommendedScholarship } from "@/hooks/useScholarshipRecommendations";
import { getDeadlineInfo, type DeadlineUrgency } from "@/utils/deadlineUtils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ExternalLink,
  GraduationCap,
  Calendar,
  IndianRupee,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  MapPin,
  BookOpen,
  Sparkles,
  Bookmark,
  Heart,
  AlertTriangle,
  Bell,
  Star,
  UserCheck,
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
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import {
  scholarships,
  scholarshipCategories,
  scholarshipStates,
  scholarshipEducationLevels,
  type Scholarship,
  type ScholarshipCategory,
} from "@/data/scholarships";
import { useSavedScholarships } from "@/hooks/useSavedScholarships";
import { useAuth } from "@/contexts/AuthContext";

const categoryColor: Record<ScholarshipCategory, string> = {
  "Merit-Based": "bg-primary/10 text-primary border-primary/20",
  "Need-Based": "bg-secondary/10 text-secondary border-secondary/20",
  Minority: "bg-accent/10 text-accent border-accent/20",
  "SC/ST/OBC": "bg-warning/10 text-warning border-warning/20",
  Women: "bg-pink-100 text-pink-700 border-pink-200",
  Sports: "bg-success/10 text-success border-success/20",
  Disability: "bg-purple-100 text-purple-700 border-purple-200",
  Government: "bg-primary/10 text-primary border-primary/20",
  Private: "bg-muted text-muted-foreground border-border",
};

const Scholarships = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "recommended">("all");

  const { user } = useAuth();
  const { savedIds, toggleSave } = useSavedScholarships();
  const { recommendations, loading: recsLoading, hasProfile } = useScholarshipRecommendations();

  const filtered = useMemo(() => {
    if (activeTab === "recommended") {
      // For recommended tab, apply search filter on top of recommendations
      return recommendations
        .filter((r) => {
          const s = r.scholarship;
          const matchSearch =
            !search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.provider.toLowerCase().includes(search.toLowerCase());
          const matchCategory =
            categoryFilter === "all" || s.category === categoryFilter;
          const matchState =
            stateFilter === "all" ||
            s.states === "All India" ||
            (Array.isArray(s.states) && s.states.includes(stateFilter));
          const matchEducation =
            educationFilter === "all" ||
            s.educationLevels.includes(educationFilter);
          return matchSearch && matchCategory && matchState && matchEducation;
        })
        .map((r) => r.scholarship);
    }
    let base = scholarships;
    if (activeTab === "saved") {
      base = scholarships.filter((s) => savedIds.has(s.id));
    }
    return base.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || s.category === categoryFilter;
      const matchState =
        stateFilter === "all" ||
        s.states === "All India" ||
        (Array.isArray(s.states) && s.states.includes(stateFilter));
      const matchEducation =
        educationFilter === "all" ||
        s.educationLevels.includes(educationFilter);
      return matchSearch && matchCategory && matchState && matchEducation;
    });
  }, [search, categoryFilter, stateFilter, educationFilter, activeTab, savedIds, recommendations]);

  // Build a map for quick recommendation lookup
  const recsMap = useMemo(() => {
    const map = new Map<string, RecommendedScholarship>();
    recommendations.forEach((r) => map.set(r.scholarship.id, r));
    return map;
  }, [recommendations]);

  const activeFilters = [categoryFilter, stateFilter, educationFilter].filter(
    (f) => f !== "all"
  ).length;

  const clearFilters = () => {
    setCategoryFilter("all");
    setStateFilter("all");
    setEducationFilter("all");
    setSearch("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName="Student" />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* ── Mobile PeerX Hero ── */}
          <div className="md:hidden pt-2 pb-6 px-1">
            <h1 className="text-[48px] font-extrabold tracking-tight leading-[1.05] text-slate-900 mb-4">
              Before we show<br />
              <span className="font-serif italic text-teal-600 font-normal tracking-normal">you paths.</span>
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-[280px] font-medium">
              Tell us your background — we'll personalise every scholarship and grant to match your profile.
            </p>
          </div>

          {/* ── Desktop Hero Banner ── */}
          <motion.div
            variants={itemVariants}
            className="hidden md:block relative overflow-hidden rounded-3xl border border-white/10 glass-dark p-6 md:p-8 text-white group min-h-[200px] flex items-center"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/scholarships-hero.png" 
                alt="Students celebrating graduation" 
                className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/60 to-transparent z-10" />
            </div>
            
            <div className="relative z-20 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Scholarship Finder
                </h1>
              </div>
              <p className="text-primary-foreground/70 text-sm max-w-lg">
                Discover scholarships tailored to your profile. Filter by state,
                category, and education level to find opportunities you qualify
                for.
              </p>
              <div className="relative mt-4">
                <div className="flex md:flex-wrap items-center gap-3 md:gap-4 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar pb-1 snap-x">
                  <span className="shrink-0 snap-start flex items-center gap-1.5 bg-primary-foreground/15 rounded-full px-3 py-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {scholarships.length} Scholarships
                  </span>
                  <span className="shrink-0 snap-start flex items-center gap-1.5 bg-primary-foreground/15 rounded-full px-3 py-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Govt & Private
                  </span>
                  {user && savedIds.size > 0 && (
                    <span className="shrink-0 snap-start flex items-center gap-1.5 bg-primary-foreground/15 rounded-full px-3 py-1">
                      <Bookmark className="w-3.5 h-3.5" />
                      {savedIds.size} Saved
                    </span>
                  )}
                </div>
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-primary to-transparent pointer-events-none md:hidden" />
              </div>
            </div>
            {/* Removed background orbs for scroll performance */}
          </motion.div>

          {/* Tabs */}
          {user && (
            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "saved" | "recommended")}>
                <TabsList className="rounded-xl w-full grid grid-cols-3 bg-muted p-1 h-auto">
                  <TabsTrigger value="all" className="rounded-lg gap-1 sm:gap-1.5 text-[12px] sm:text-sm py-2 px-1">
                    <Award className="w-3.5 h-3.5 hidden sm:inline shrink-0" />
                    <span className="truncate">All</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommended" className="rounded-lg gap-1 sm:gap-1.5 text-[12px] sm:text-sm py-2 px-1">
                    <Star className="w-3.5 h-3.5 hidden sm:inline shrink-0" />
                    <span className="truncate">Recommended</span>
                    <span className="hidden md:inline">({recommendations.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="rounded-lg gap-1 sm:gap-1.5 text-[12px] sm:text-sm py-2 px-1">
                    <Bookmark className="w-3.5 h-3.5 hidden sm:inline shrink-0" />
                    <span className="truncate">Saved</span>
                    <span className="hidden md:inline">({savedIds.size})</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-border">
              <CardContent className="p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search scholarships..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 rounded-xl text-[13px] md:text-sm"
                  />
                </div>

                {/* Filter row */}
                {/* Filter row */}
                <div className="grid grid-cols-3 md:flex md:overflow-x-visible gap-2 hide-scrollbar">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full md:w-[140px] shrink-0 rounded-xl h-10 px-2 sm:px-3 text-[11px] sm:text-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {scholarshipCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="w-full md:w-[130px] shrink-0 rounded-xl h-10 px-2 sm:px-3 text-[11px] sm:text-sm">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {scholarshipStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={educationFilter}
                    onValueChange={setEducationFilter}
                  >
                    <SelectTrigger className="w-full md:w-[140px] shrink-0 rounded-xl h-10 px-2 sm:px-3 text-[11px] sm:text-sm">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {scholarshipEducationLevels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Active filter count + clear */}
                {activeFilters > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      <Filter className="w-3 h-3 inline mr-1" />
                      {activeFilters} filter{activeFilters > 1 ? "s" : ""}{" "}
                      active · {filtered.length} result
                      {filtered.length !== 1 ? "s" : ""}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1 h-7"
                      onClick={clearFilters}
                    >
                      <X className="w-3 h-3" /> Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results count */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} of {activeTab === "saved" ? savedIds.size : scholarships.length} scholarships
              {activeTab === "saved" ? " (saved)" : ""}
            </p>
          </motion.div>

          {/* Scholarship Cards */}
          <motion.div
            variants={containerVariants}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((s) => {
                const isExpanded = expandedId === s.id;
                const isSaved = savedIds.has(s.id);
                const deadlineInfo = getDeadlineInfo(s);
                const showDeadlineAlert = isSaved && (deadlineInfo.urgency === "urgent" || deadlineInfo.urgency === "overdue" || deadlineInfo.urgency === "approaching");
                const rec = recsMap.get(s.id);
                return (
                  <motion.div
                    key={s.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="rounded-2xl border-border hover:border-primary/20 transition-all hover:shadow-sm">
                      <CardContent className="p-5">
                        {/* Header row */}
                        <div className="flex flex-col md:flex-row justify-between gap-3 w-full">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between w-full mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 whitespace-nowrap ${categoryColor[s.category]}`}
                                >
                                  {s.category}
                                </Badge>
                                {s.states === "All India" && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-2 py-0.5 whitespace-nowrap bg-primary/5 text-primary border-primary/15"
                                  >
                                    All India
                                  </Badge>
                                )}
                                {activeTab === "recommended" && rec && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-2 py-0.5 whitespace-nowrap bg-success/10 text-success border-success/20"
                                  >
                                    <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                    {rec.matchScore}% match
                                  </Badge>
                                )}
                              </div>
                              <button
                                onClick={() => toggleSave(s.id)}
                                className={`md:hidden p-1.5 shrink-0 rounded-xl transition-all ${isSaved
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                  }`}
                                title={isSaved ? "Remove from saved" : "Save scholarship"}
                              >
                                <Bookmark
                                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                            
                            <h3 className="font-semibold text-[16px] md:text-lg leading-snug line-clamp-2 md:line-clamp-none pr-2">
                              {s.name}
                            </h3>
                            <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">
                              {s.provider}
                            </p>
                            
                            {/* Mobile Amount */}
                            <div className="md:hidden mt-3">
                              <p className="text-[15px] font-bold text-primary break-words">
                                {s.amount}
                              </p>
                            </div>
                          </div>
                          
                          {/* Desktop Amount & Bookmark */}
                          <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
                            <button
                              onClick={() => toggleSave(s.id)}
                              className={`p-2 rounded-xl transition-all ${isSaved
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                }`}
                              title={isSaved ? "Remove from saved" : "Save scholarship"}
                            >
                              <Bookmark
                                className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                              />
                            </button>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary max-w-[200px] break-words">
                                {s.amount}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Info pills */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`flex items-center gap-1 text-[11px] rounded-full px-2.5 py-1 ${showDeadlineAlert
                              ? deadlineInfo.urgency === "approaching"
                                ? "bg-warning/10 text-warning"
                                : "bg-destructive/10 text-destructive"
                              : "text-muted-foreground bg-muted"
                            }`}>
                            {showDeadlineAlert ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                            {s.deadline}
                            {showDeadlineAlert && deadlineInfo.daysLeft !== null && (
                              <span className="font-medium ml-0.5">
                                ({deadlineInfo.daysLeft < 0 ? "overdue" : `${deadlineInfo.daysLeft}d left`})
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                            <BookOpen className="w-3 h-3" />
                            {s.educationLevels.join(", ")}
                          </span>
                          {Array.isArray(s.states) && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                              <MapPin className="w-3 h-3" />
                              {s.states.join(", ")}
                            </span>
                          )}
                        </div>

                        {/* Match reasons */}
                        {activeTab === "recommended" && rec && rec.matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {rec.matchReasons.map((reason, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-success bg-success/10 rounded-full px-2 py-0.5"
                              >
                                ✓ {reason}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Expand / Collapse */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-3 border-t border-border space-y-3">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {s.description}
                                </p>
                                <div>
                                  <p className="text-xs font-semibold mb-1.5">
                                    Eligibility:
                                  </p>
                                  <ul className="space-y-1">
                                    {s.eligibility.map((e, i) => (
                                      <li
                                        key={i}
                                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {e}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    className="gap-1.5 text-xs"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Apply Now
                                  </Button>
                                </a>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Toggle button */}
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : s.id)
                          }
                          className="flex items-center gap-1 text-xs text-primary hover:underline mt-3 font-medium"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              View Details <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div variants={itemVariants}>
                <Card className="rounded-2xl border-border">
                  <CardContent className="p-10 text-center">
                    {activeTab === "recommended" ? (
                      !hasProfile ? (
                        <>
                          <UserCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <h3 className="font-semibold text-lg mb-1">
                            Complete your profile
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add your state, education level, and interests to get personalized scholarship recommendations.
                          </p>
                          <Link to="/profile">
                            <Button variant="outline" className="gap-1.5">
                              <UserCheck className="w-3.5 h-3.5" />
                              Update Profile
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <h3 className="font-semibold text-lg mb-1">
                            No matching scholarships
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Try updating your profile or adjusting filters.
                          </p>
                          <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                        </>
                      )
                    ) : activeTab === "saved" ? (
                      <>
                        <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-1">
                          No saved scholarships
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click the bookmark icon on any scholarship to save it for later.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab("all")}>
                          Browse All Scholarships
                        </Button>
                      </>
                    ) : (
                      <>
                        <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-1">
                          No scholarships found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Try adjusting your filters or search terms.
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* AI CTA */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base">
                    Need help finding the right scholarship?
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our AI counselor can recommend scholarships based on your
                    profile, location, and academic background.
                  </p>
                </div>
                <Link to="/chat">
                  <Button size="sm" className="gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask AI Counselor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 max-w-5xl">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 CareerMap. Scholarship data is indicative and may change. Please
          verify details on official websites.
        </p>
      </footer>
    </div>
  );
};

export default Scholarships;
