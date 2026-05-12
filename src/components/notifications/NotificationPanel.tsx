import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, TrendingUp, Sparkles, AlertCircle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentResults } from "@/hooks/useAssessmentResults";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type NotificationType = "progress" | "advice" | "alert" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "advice",
    title: "Career Growth Advice",
    message: "Based on your interest in Data Science, we recommend completing the new Python Analytics assessment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isRead: false,
    actionUrl: "/assessment",
    actionLabel: "Take Assessment"
  },
  {
    id: "notif-2",
    type: "progress",
    title: "Profile Milestone Reached!",
    message: "You've successfully completed 80% of your student profile. Add your education history to reach 100%.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isRead: false,
    actionUrl: "/profile",
    actionLabel: "Update Profile"
  },
  {
    id: "notif-3",
    type: "alert",
    title: "New Scholarship Deadline",
    message: "The 'Tech Innovators Scholarship for Undergraduates' closes in 3 days. Prepare your application now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    actionUrl: "/scholarships",
    actionLabel: "View Scholarships"
  },
  {
    id: "notif-4",
    type: "system",
    title: "Welcome to Nayi Raah Insights",
    message: "Your personalized AI career journey begins here. Explore your dashboard to get started.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    isRead: true,
  }
];

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "progress": return <TrendingUp className="w-4 h-4 text-success" />;
    case "advice": return <Sparkles className="w-4 h-4 text-accent" />;
    case "alert": return <AlertCircle className="w-4 h-4 text-warning" />;
    case "system": return <CheckCircle2 className="w-4 h-4 text-primary" />;
  }
};

const getTypeBg = (type: NotificationType) => {
  switch (type) {
    case "progress": return "bg-success/10 border-success/20";
    case "advice": return "bg-accent/10 border-accent/20";
    case "alert": return "bg-warning/10 border-warning/20";
    case "system": return "bg-primary/10 border-primary/20";
  }
};

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { latestResult, recommendedPaths, isLoading: assessmentLoading } = useAssessmentResults();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name?: string | null;
    education_level?: string | null;
    district?: string | null;
    interests?: string[] | null;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      setProfile(data);
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (assessmentLoading || profileLoading) return;

    // Check profile completion (4 fields = full_name, education, district, interests)
    let profileCompleted = 1;
    if (profile?.education_level) profileCompleted++;
    if (profile?.interests?.length > 0) profileCompleted++;
    if (profile?.district) profileCompleted++;

    if (profileCompleted < 4) {
      // Priority 1: Incomplete Profile
      setNotifications([
        {
          id: "onboarding-profile",
          type: "system",
          title: "Complete Your Profile 📋",
          message: "Before we map your future, please complete your profile. We need your state and interests to generate personalized scholarships and college recommendations.",
          timestamp: new Date(),
          isRead: false,
          actionUrl: "/profile",
          actionLabel: "Update Profile",
        },
      ]);
      return; // Block other notifications until profile is done
    }

    if (!latestResult) {
      // New user / Has not taken assessment
      setNotifications([
        {
          id: "onboarding-assessment",
          type: "system",
          title: "Welcome to Nayi Raah Insights! 👋",
          message: "To get started, take our Career Assessment. We'll analyze your aptitude, interests, and personality to find your perfect career path.",
          timestamp: new Date(),
          isRead: false,
          actionUrl: "/assessment",
          actionLabel: "Take Assessment",
        },
      ]);
    } else if (recommendedPaths && recommendedPaths.length > 0) {
      // Existing user / Has taken assessment
      const topCareer = recommendedPaths[0];
      setNotifications([
        {
          id: "roadmap-ready",
          type: "progress",
          title: "Assessment Complete! 🎉",
          message: `Your personalized career roadmap for ${topCareer.name} is ready. Step-by-step guidance awaits.`,
          timestamp: new Date(latestResult.completed_at || Date.now()),
          isRead: false,
          actionUrl: "/roadmap",
          actionLabel: "View Roadmap",
        },
        {
          id: "advice-1",
          type: "advice",
          title: "Career Advice",
          message: `Focus on developing your ${topCareer.skills[0] || "core"} skills to get ahead in your journey towards becoming a ${topCareer.name}.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true,
          actionUrl: "/chat",
          actionLabel: "Ask AI Guide",
        },
      ]);
    }
  }, [latestResult, recommendedPaths, assessmentLoading, profileLoading, profile]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none ring-0">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background flex items-center justify-center pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-40"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0 shadow-xl border-border/50 rounded-2xl overflow-hidden mt-2 z-[60]"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-2 h-5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              <AnimatePresence>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`relative p-4 border-b border-border/50 transition-colors hover:bg-muted/40 group ${!notif.isRead ? "bg-primary/[0.03]" : ""
                      }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                    )}

                    <div className="flex gap-3">
                      <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${getTypeBg(notif.type)}`}>
                        {getTypeIcon(notif.type)}
                      </div>

                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold leading-tight ${!notif.isRead ? "text-foreground" : "text-foreground/80"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                            {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                          </span>
                        </div>

                        <p className={`text-xs leading-relaxed ${!notif.isRead ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
                          {notif.message}
                        </p>

                        {/* Action Link */}
                        {notif.actionUrl && notif.actionLabel && (
                          <div className="pt-2">
                            <Link
                              to={notif.actionUrl}
                              onClick={() => {
                                markAsRead(notif.id);
                                setIsOpen(false);
                              }}
                            >
                              <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full border-border bg-background hover:border-primary/40 hover:text-primary">
                                {notif.actionLabel}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => removeNotification(notif.id, e)}
                        className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">You're all caught up!</p>
              <p className="text-xs mt-1">Check back later for new updates.</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
