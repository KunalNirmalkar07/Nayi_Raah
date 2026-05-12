import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, GraduationCap, Newspaper, Users, Building2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Scholarships", icon: GraduationCap, path: "/admin/scholarships" },
  { label: "News & Updates", icon: Newspaper, path: "/admin/news" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Colleges", icon: Building2, path: "/admin/colleges" },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card shadow-[1px_0_10px_rgba(0,0,0,0.03)] z-10 flex flex-col border-r border-border/40">
      <div className="p-6">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Admin Panel</h2>
        <p className="text-sm font-medium text-muted-foreground mt-1">Platform Management</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}
