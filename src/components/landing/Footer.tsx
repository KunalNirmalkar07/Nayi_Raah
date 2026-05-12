import React, { useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Features", hash: "#features" },
  { label: "How It Works", hash: "#how-it-works" },
  { label: "Testimonials", hash: "#testimonials" },
  { label: "FAQ", hash: "#faq" },
  { label: "Sign In", to: "/auth" }
];

const productLinks = [
  { label: "Take Assessment", to: "/assessment" },
  { label: "View Roadmap", to: "/roadmap" },
  { label: "AI Career Chat", to: "/chat" },
  { label: "Scholarships", to: "/scholarships" },
];

const DotGridDynamic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !overlayRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // CSS mask reveals the bright dot layer under the cursor only
    const mask = `radial-gradient(220px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
    overlayRef.current.style.maskImage = mask;
    overlayRef.current.style.webkitMaskImage = mask;
    overlayRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full mt-16 md:mt-20 overflow-hidden relative cursor-default select-none"
    >
      {/* Base grid — dim uniform dots via SVG pattern (near-zero DOM cost) */}
      <svg className="w-full h-[220px] md:h-[280px]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="dot-base" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="2" fill="rgba(255,255,255,0.2)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-base)" />
      </svg>

      {/* Glow overlay — bright dots, revealed by CSS mask under cursor */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          transition: "opacity 0.35s ease",
          maskImage: "none",
          WebkitMaskImage: "none",
        }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="dot-glow" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="13" cy="13" r="3.2" fill="rgba(255,255,255,0.95)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-glow)" />
        </svg>
      </div>
    </div>
  );
};


const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#08080a] pt-12 md:pt-20">
      <footer className="bg-[#0a0a0a] pt-16 md:pt-24 pb-4 md:pb-6 rounded-t-[2rem] md:rounded-t-[3rem] relative overflow-hidden border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        
        {/* Top Split */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24">
          {/* Logo Side */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shadow-lg"
            >
              <Compass className="w-7 h-7" />
            </motion.div>
            <span className="text-3xl md:text-[40px] font-display font-black text-white tracking-tighter">
              Nayi Raah
            </span>
          </Link>

          {/* Links Side */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 md:gap-x-16 lg:min-w-[700px]">
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Navigate</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    {link.hash ? (
                      <a href={link.hash} onClick={(e) => handleAnchorClick(e, link.hash)} className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to!} className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Social</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Instagram</a></li>
                <li><a href="#" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Twitter</a></li>
                <li><a href="#" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle split */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-24 md:mt-32 text-[12px] md:text-[13px] text-white/40 font-medium gap-6">
          <p>© {new Date().getFullYear()} Nayi Raah Ltd, India. All rights reserved.</p>
          <p>Made with passion for Indian students.</p>
        </div>

        {/* Bottom Dot Grid */}
        <DotGridDynamic />
      </div>
    </footer>
    </div>
  );
};

export default Footer;
