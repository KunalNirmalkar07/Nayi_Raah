import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Compass, Bell, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";

interface DashboardNavbarProps {
  userName?: string;
  avatarUrl?: string;
}

const DashboardNavbar = ({ userName = "Student", avatarUrl }: DashboardNavbarProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/assessment", label: "Assessment" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/colleges", label: "Colleges" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/chat", label: "AI Guidance" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 border-b border-border">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary">
              Nayi Raah
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NotificationPanel />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userName}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                {user?.email === "kunalnirmalkar345@gmail.com" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="text-primary font-medium">Admin Panel</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-muted"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  {user?.email === "kunalnirmalkar345@gmail.com" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 rounded-lg text-primary hover:bg-muted font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-destructive hover:bg-muted"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
