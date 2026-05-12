import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const trustPoints = [
  "100% Free for Students",
  "No Credit Card Needed",
  "Results in 10 Minutes",
  "Trusted by 10,000+ Students",
];

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 lg:py-44 bg-[#08080a] overflow-hidden"
    >
      {/* Background rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04]">
        <div className="w-[600px] h-[600px] rounded-full border border-white absolute border-dashed" />
        <div className="w-[950px] h-[950px] rounded-full border border-white absolute border-dashed" />
        <div className="w-[1300px] h-[1300px] rounded-full border border-white absolute border-dashed" />
      </div>

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none opacity-20 blur-3xl rounded-full"
        style={{ background: "radial-gradient(ellipse, hsl(var(--primary)), transparent 70%)" }}
      />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {/* Top label */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] md:text-[11px] text-white/50 font-bold tracking-[0.2em] uppercase mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
          Start Your Journey Today
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight text-white/90 mb-5 md:mb-6"
        >
          Ready to find{" "}
          <span className="text-primary">your path?</span>
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white/40 text-[15px] md:text-lg max-w-xl mx-auto leading-relaxed mb-10 md:mb-12"
        >
          Join thousands of students across India who discovered their dream careers with Nayi Raah — in just 10 minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-14"
        >
          <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}>
            <Button
              size="lg"
              asChild
              className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 text-[15px] md:text-base px-8 md:px-10 py-6 md:py-7 h-auto rounded-full shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_16px_48px_-8px_hsl(var(--primary)/0.7)] transition-all duration-300 font-semibold"
            >
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/10 text-white/70 hover:bg-white/[0.05] hover:border-white/20 hover:text-white text-[15px] md:text-base px-8 md:px-10 py-6 md:py-7 h-auto rounded-full transition-all duration-300 font-medium bg-white/[0.03]"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust points row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {trustPoints.map((point, i) => (
            <motion.span
              key={point}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-white/35 font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 shrink-0" strokeWidth={2.5} />
              {point}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
