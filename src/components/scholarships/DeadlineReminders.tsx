import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Clock, Calendar, ChevronRight, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ScholarshipDeadlineInfo, type DeadlineUrgency } from "@/utils/deadlineUtils";

interface DeadlineRemindersProps {
  reminders: ScholarshipDeadlineInfo[];
  maxItems?: number;
  compact?: boolean;
}

const urgencyConfig: Record<DeadlineUrgency, { label: string; className: string; icon: typeof AlertTriangle }> = {
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
  urgent: { label: "Urgent", className: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
  approaching: { label: "Upcoming", className: "bg-warning/10 text-warning border-warning/30", icon: Clock },
  safe: { label: "On Track", className: "bg-success/10 text-success border-success/30", icon: Calendar },
  unknown: { label: "TBD", className: "bg-muted text-muted-foreground border-border", icon: Calendar },
};

function formatDaysLeft(daysLeft: number | null): string {
  if (daysLeft === null) return "No date";
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
  if (daysLeft === 0) return "Today!";
  if (daysLeft === 1) return "Tomorrow";
  if (daysLeft <= 7) return `${daysLeft} days left`;
  if (daysLeft <= 30) return `${daysLeft} days left`;
  const weeks = Math.floor(daysLeft / 7);
  if (daysLeft <= 60) return `${weeks} weeks left`;
  const months = Math.floor(daysLeft / 30);
  return `~${months} months left`;
}

export function DeadlineReminders({ reminders, maxItems = 5, compact = false }: DeadlineRemindersProps) {
  const shown = reminders.slice(0, maxItems);
  const urgentCount = reminders.filter((r) => r.urgency === "urgent" || r.urgency === "overdue").length;

  if (shown.length === 0) {
    return (
      <Card className="border-border rounded-2xl">
        <CardContent className="p-5 text-center">
          <Bookmark className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No saved scholarship deadlines to track</p>
          <Link to="/scholarships">
            <Button size="sm" variant="outline" className="mt-3 gap-1.5 text-xs">
              Browse Scholarships <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border rounded-2xl h-full">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bell className={`w-4 h-4 ${urgentCount > 0 ? "text-destructive" : "text-primary"}`} />
          Scholarship Deadlines
          {urgentCount > 0 && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {urgentCount} urgent
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-2">
        <AnimatePresence>
          {shown.map((info, i) => {
            const config = urgencyConfig[info.urgency];
            const Icon = config.icon;
            return (
              <motion.div
                key={info.scholarship.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-xl border transition-colors ${config.className}`}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className={`font-medium truncate ${compact ? "text-xs" : "text-sm"}`}>
                    {info.scholarship.name}
                  </h4>
                  <Badge
                    variant={info.urgency === "urgent" || info.urgency === "overdue" ? "destructive" : "secondary"}
                    className="text-[10px] px-1.5 shrink-0"
                  >
                    <Icon className="w-2.5 h-2.5 mr-0.5" />
                    {formatDaysLeft(info.daysLeft)}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {info.scholarship.provider} · {info.scholarship.deadline}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {reminders.length > maxItems && (
          <Link to="/scholarships" className="text-xs text-primary hover:underline flex items-center gap-1 pt-1">
            View all {reminders.length} deadlines <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
