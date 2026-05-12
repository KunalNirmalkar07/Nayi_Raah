import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Users, Newspaper, Building2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, recent: 0 },
    scholarships: { total: 0, recent: 0 },
    news: { total: 0, recent: 0 },
    colleges: { total: 0, recent: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString();

      const [
        usersRes, usersRecentRes,
        scholRes, scholRecentRes,
        newsRes, newsRecentRes,
        collegesRes, collegesRecentRes
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekAgoStr),
        supabase.from("managed_scholarships").select("id", { count: "exact", head: true }),
        supabase.from("managed_scholarships").select("id", { count: "exact", head: true }).gte("created_at", weekAgoStr),
        supabase.from("news_announcements").select("id", { count: "exact", head: true }),
        supabase.from("news_announcements").select("id", { count: "exact", head: true }).gte("created_at", weekAgoStr),
        supabase.from("managed_colleges").select("id", { count: "exact", head: true }),
        supabase.from("managed_colleges").select("id", { count: "exact", head: true }).gte("created_at", weekAgoStr),
      ]);

      setStats({
        users: { total: usersRes.count ?? 0, recent: usersRecentRes.count ?? 0 },
        scholarships: { total: scholRes.count ?? 0, recent: scholRecentRes.count ?? 0 },
        news: { total: newsRes.count ?? 0, recent: newsRecentRes.count ?? 0 },
        colleges: { total: collegesRes.count ?? 0, recent: collegesRecentRes.count ?? 0 }
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", data: stats.users, icon: Users, color: "text-primary" },
    { label: "Scholarships", data: stats.scholarships, icon: GraduationCap, color: "text-accent" },
    { label: "News Posts", data: stats.news, icon: Newspaper, color: "text-secondary" },
    { label: "Colleges", data: stats.colleges, icon: Building2, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <Card key={c.label} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-muted-foreground">{c.label}</CardTitle>
                <div className={`p-2 rounded-xl ${c.color.replace('text-', 'bg-').replace('/10', '')}/10`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-foreground">{c.data.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.data.recent > 0 ? (
                    <span className="text-emerald-500 font-medium">+{c.data.recent} this week</span>
                  ) : (
                    <span>No new additions this week</span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
