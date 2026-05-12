import { Link, useLocation } from "react-router-dom";
import { Compass, BookOpen, Users, Home, Building, User, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide the floating navigation entirely if the user is not logged in.
  if (!user) return null;

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Assessment",
      href: "/assessment",
      icon: Target,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: Compass,
    },
    {
      name: "Colleges",
      href: "/colleges",
      icon: Building,
    },
    {
      name: "Scholarships",
      href: "/scholarships",
      icon: BookOpen,
    },
    {
      name: "AI Guidance",
      href: "/chat",
      icon: Users,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  // Do not show the navigation on desktop
  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-[100] flex justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 rounded-[34px] p-1.5 flex items-center justify-between w-full max-w-[400px]">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-teal-600 text-white px-3.5 py-2.5 gap-1.5 shadow-md shadow-teal-600/20"
                  : "bg-transparent text-slate-400 p-2.5 hover:text-slate-800"
              }`}
            >
              <Icon className={isActive ? "w-[18px] h-[18px] shrink-0" : "w-[22px] h-[22px] shrink-0"} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="text-[12px] font-extrabold tracking-wide truncate max-w-[75px]">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
