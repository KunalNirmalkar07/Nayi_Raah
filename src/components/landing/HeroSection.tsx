import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/* ─── Hero Section ─── */
const SpinningCTA = () => (
  <div className="mt-8">
      <Link to="/auth?mode=signup" className="inline-block">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36">
          {/* Rotating text ring */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 200 200"
            className="w-full h-full force-gpu"
            style={{ willChange: "transform" }}
          >
            <defs>
              <path
                id="circlePath"
                d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
              />
            </defs>
            <text className="fill-foreground text-[13px] font-semibold uppercase tracking-[0.32em]">
              <textPath href="#circlePath">
                • Start Your Journey • Free Assessment •
              </textPath>
            </text>
          </motion.svg>
          {/* Center arrow button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-foreground flex items-center justify-center shadow-xl transition-colors duration-300"
              style={{ willChange: "transform" }}
            >
              <ArrowRight className="w-5 h-5 text-background" />
            </div>
          </div>
        </div>
      </Link>
  </div>
);

/* ─── Floating particle — only 3, simple y+opacity animation ─── */
const Particle = ({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/25 pointer-events-none force-gpu"
    style={{ left: x, top: y, width: size, height: size, willChange: "transform, opacity" }}
    animate={{ y: [0, -16, 0], opacity: [0.2, 0.5, 0.2] }}
    transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);


/* ─── Hero Section ─── */
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Reduced from 7 to 3 particles to cut background rAF load
  const particles = [
    { x: "8%",  y: "25%", delay: 0,   size: 5 },
    { x: "88%", y: "18%", delay: 0.8, size: 4 },
    { x: "72%", y: "78%", delay: 1.6, size: 6 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] lg:h-screen lg:overflow-hidden bg-background flex flex-col"
    >
      {/* ── Static ambient background — NO animating scale/opacity on vw-scale blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Mesh Gradient Overlay */}
        <div className="absolute inset-0 dark:mesh-gradient opacity-60" />
        
        <div
          className="absolute -top-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/3 w-[55vw] h-[55vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ── 3 Floating particles (down from 7) ── */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* ── Main content ── */}
      <div className="flex-1 flex items-start lg:items-center relative z-10 w-full overflow-hidden pt-10 lg:pt-6">
        {/* 60/40 Split */}
        <div className="w-full mx-auto grid lg:grid-cols-[60fr_40fr] gap-8 lg:gap-0 items-center h-full py-4">

          {/* ── Left: Text column ── */}
          <motion.div
            style={{ y: typeof window !== 'undefined' && window.innerWidth >= 1024 ? textY : 0, willChange: "transform" }}
            className="flex flex-col justify-center force-gpu z-20 pl-6 sm:pl-8 lg:pl-[80px]"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4 w-fit"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                style={{ willChange: "transform, opacity" }}
              />
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">
                AI Career Guidance
              </span>
            </motion.div>

            {/* Headline — Staggered line entrance */}
            <motion.h1
              className="font-display font-bold leading-[1.1] md:leading-[1.0] tracking-tight text-foreground flex flex-col"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)" }}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
            >
              <div className="overflow-hidden pb-1">
                <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="inline-block">Apna Career,</motion.span>
              </div>
              <div className="overflow-hidden pb-1">
                <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="inline-block text-primary">Apni Pehchaan.</motion.span>
              </div>
            </motion.h1>

            {/* Sub-copy — 60% of headline width pyramid */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-sm sm:text-lg text-muted-foreground max-w-[42rem] leading-relaxed"
            >
              AI-powered career guidance for every student.
              Discover your strengths, shape your future.
            </motion.p>

            {/* Spinning CTA badge */}
            <SpinningCTA />
          </motion.div>

          {/* ── Right: Lottie Visual ── */}
          <motion.div
            style={{ y: typeof window !== 'undefined' && window.innerWidth >= 1024 ? visualY : 0, willChange: "transform" }}
            className="hidden lg:flex items-center justify-center h-full w-full relative force-gpu"
          >
            <motion.div
            className="relative w-full flex items-center justify-center"
            style={{ width: "120%", height: "120%" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
              {/* Static glow orb */}
              <div
                className="absolute w-[80%] h-[80%] rounded-full opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)" }}
              />

              {/* Lottie Single Float */}
              <motion.div
                className="relative z-10 w-full h-[600px] flex items-center justify-center force-gpu"
                animate={{ y: [-20, 0, -20], scale: 1.05 }}
                transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0 } }}
                style={{ willChange: "transform" }}
              >
                <img
                  src="/Exams_Preparation.gif"
                  alt="High quality animated student illustration"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  className="block"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-6 inset-x-0 flex-col items-center gap-1.5 z-20 pointer-events-none"
      >
        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">
          <motion.span
            animate={{ opacity: [0.5, 1.0, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll to explore
          </motion.span>
        </span>
        <div className="w-px h-9 bg-border overflow-hidden relative">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-1/2 bg-primary force-gpu"
            style={{ willChange: "transform" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
