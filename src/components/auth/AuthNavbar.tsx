import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";

interface AuthNavbarProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

const AuthNavbar = ({ mode, onModeChange }: AuthNavbarProps) => {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
            >
              <Compass className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg font-bold text-foreground tracking-tight">Nayi Raah</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50">
              Home
            </Link>
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  mode === m
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {m === "signin" ? "Login" : "Register"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar;
