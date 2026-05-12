import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Compass } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent, PanInfo } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 50);
    setHidden(latest > prev && latest > 200);
  });

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "auto" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled || isOpen
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm py-3"
          : "bg-transparent border-transparent py-6"
        }`}
    >
      <div className="w-full px-4 md:px-[40px] max-w-none">
        <div className="flex items-center justify-between h-20 md:h-24 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center"
            >
              <Compass className="w-5 h-5 text-background" />
            </motion.div>
            <span className="text-2xl md:text-3xl font-display font-black text-foreground tracking-tighter">
              Nayi Raah
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {["Features", "How It Works", "Testimonials"].map((item) => {
              const hash = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <a
                  key={item}
                  href={hash}
                  onClick={(e) => handleAnchorClick(e, hash)}
                  className="text-lg font-semibold text-foreground/80 hover:text-foreground transition-all relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-1.5 left-0 w-0 h-[2px] rounded-full bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Button variant="ghost" asChild className="text-lg font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full px-8 transition-colors h-12">
              <Link to="/auth">Sign In</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 h-12 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg">
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 0 }}
              onDragEnd={(e, info: PanInfo) => {
                if (info.offset.y < -40 || info.velocity.y < -200) {
                  setIsOpen(false);
                }
              }}
              className="md:hidden overflow-hidden bg-background border-b border-border shadow-2xl relative touch-none"
            >
              <div className="py-6 px-4 space-y-6">
                <a href="#features" onClick={(e) => handleAnchorClick(e, "#features")} className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" onClick={(e) => handleAnchorClick(e, "#how-it-works")} className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                <a href="#testimonials" onClick={(e) => handleAnchorClick(e, "#testimonials")} className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Button variant="outline" size="lg" asChild className="w-full text-base h-12 rounded-xl">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button size="lg" asChild className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 text-base shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.25)]">
                    <Link to="/auth?mode=signup">Get Started</Link>
                  </Button>
                </div>

                {/* Drag Handle Indicator */}
                <div className="pt-4 flex justify-center pb-2">
                  <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
