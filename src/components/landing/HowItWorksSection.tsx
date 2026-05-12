import { motion } from "framer-motion";
import { UserPlus, ClipboardList, Sparkles, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

/* ─── Step data ─── */
const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up free and tell us about yourself — your stream, interests, state, and aspirations. Takes under 2 minutes.",
    num: "01",
    tag: "Free · 2 min",
    points: ["No credit card needed", "Supports all streams", "Regional language support"],
  },
  {
    icon: ClipboardList,
    title: "Take the Assessment",
    description: "Our adaptive test measures aptitude, personality traits, and core interests — giving you a complete picture of your potential.",
    num: "02",
    tag: "~10 min",
    points: ["Scientifically validated", "500+ career signals", "Instant scoring"],
  },
  {
    icon: Sparkles,
    title: "Receive AI Insights",
    description: "Get hyper-personalized career recommendations from our AI counsellor, matched to your profile and India's job market.",
    num: "03",
    tag: "AI · Instant",
    points: ["Ranked career matches", "College pathways", "Salary projections"],
  },
  {
    icon: Rocket,
    title: "Follow Your Roadmap",
    description: "Get a step-by-step action plan with entrance exams, college targets, skill milestones, and scholarships — all yours.",
    num: "04",
    tag: "Custom plan",
    points: ["Exam calendars", "Scholarship alerts", "Track progress"],
  },
];

/* ─── Section ─── */
const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-16 md:py-28 lg:py-36 bg-background overflow-hidden"
    >
      {/* Subtle minimalist grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-primary mb-3 md:mb-4">
            <span className="block w-4 md:w-5 h-[1.5px] bg-primary" />
            The Process
            <span className="block w-4 md:w-5 h-[1.5px] bg-primary" />
          </span>
          <h2 className="text-3xl md:text-6xl font-display font-bold tracking-tight text-[#111] leading-[1.1] md:leading-[1.05]">
            How it <span className="text-primary">works.</span>
          </h2>
          <p className="mt-3 md:mt-4 text-[#555] text-[15px] md:text-lg max-w-xl mx-auto leading-relaxed">
            From profile to personalized roadmap in four focused steps.
          </p>
        </motion.div>

        {/* ── Steps Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="group relative h-full bg-white border border-black/[0.04] rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden transition-all duration-500 hover:border-black/[0.1] hover:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] cursor-default"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  style={{ willChange: "transform" }}
                >
                  {/* Premium inner shadow on hover */}
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)" }} />

                  {/* Ghost number watermark */}
                  <span
                    className="absolute -bottom-2 -right-1 md:-bottom-4 md:-right-3 text-[6rem] md:text-[8rem] font-display font-black leading-none select-none pointer-events-none transition-all duration-500 text-black opacity-[0.02] group-hover:opacity-[0.04] group-hover:-translate-y-2 group-hover:-translate-x-2"
                  >
                    {step.num}
                  </span>

                  {/* ── Top row ── */}
                  <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
                    {/* Icon container */}
                    <div className="relative">
                      {/* Pulse ring on hover */}
                      <motion.div
                        className="absolute -inset-2.5 rounded-2xl border border-black/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      />
                      <motion.div
                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-[10px] md:rounded-xl bg-[#111] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-105"
                        style={{ willChange: "transform" }}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={1.7} />
                      </motion.div>
                    </div>

                    {/* Step number + tag */}
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <div className="text-[26px] md:text-3xl font-display font-black leading-none text-black/10 transition-colors duration-500 group-hover:text-black/20">
                        {step.num}
                      </div>
                      <span className="text-[8.5px] md:text-[9px] font-bold tracking-widest uppercase px-2 md:px-2.5 py-0.5 md:py-1 rounded-full bg-black/5 text-black/70 border border-black/10 transition-colors duration-500 group-hover:bg-black group-hover:text-white">
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  {/* ── Text ── */}
                  <div className="relative z-10 flex flex-col h-[calc(100%-64px)] md:h-[calc(100%-80px)]">
                    <h3 className="text-[18px] md:text-xl font-display font-bold text-[#111] mb-2 md:mb-2.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[#555] text-[13.5px] md:text-[14px] leading-relaxed mb-5 md:mb-6 flex-grow">
                      {step.description}
                    </p>

                    {/* Checklist */}
                    <ul className="space-y-1.5 md:space-y-2 mt-auto">
                      {step.points.map((pt, pi) => (
                        <motion.li
                          key={pi}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + pi * 0.07 + 0.3, duration: 0.4 }}
                          className="flex items-center gap-2 md:gap-2.5 text-[12.5px] md:text-[13px] font-medium text-[#444]"
                        >
                          <CheckCircle2 className="w-[13px] h-[13px] md:w-[14px] md:h-[14px] shrink-0 text-primary opacity-80" strokeWidth={2.5} />
                          {pt}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Animated sweep underline - Uses the exact theme primary green on hover */}
                    <div className="absolute -bottom-6 w-full md:-bottom-8 left-0 right-0 h-[2.5px] md:h-[3px] overflow-hidden rounded-full bg-black/[0.03]">
                      <motion.div
                        className="h-full w-0 group-hover:w-[40%] transition-all duration-700 ease-[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] rounded-full bg-primary"
                        style={{ boxShadow: "0 0 10px 1px hsl(var(--primary) / 0.4)" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
