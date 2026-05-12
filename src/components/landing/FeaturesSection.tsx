import { Brain, ClipboardCheck, Map, MessageCircle, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  num: string;
  floatDelay: number;
  accent: string;
}[] = [
  {
    icon: ClipboardCheck,
    title: "Aptitude Assessment",
    description: "Multi-dimensional tests measuring your innate strengths, key interests, and personality drivers.",
    num: "01",
    floatDelay: 0,
    accent: "rgba(20,184,166,0.15)",
  },
  {
    icon: Brain,
    title: "AI Career Counselor",
    description: "Get personalized 24/7 coaching from an intelligent counselor that knows your profile inside out.",
    num: "02",
    floatDelay: 0.3,
    accent: "rgba(99,102,241,0.15)",
  },
  {
    icon: Map,
    title: "Dynamic Roadmaps",
    description: "Step-by-step master plans projecting the exact education and milestones for your dream role.",
    num: "03",
    floatDelay: 0.6,
    accent: "rgba(244,114,182,0.12)",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "An advanced correlation algorithm perfectly syncing your aspirations to industry demands.",
    num: "04",
    floatDelay: 0.2,
    accent: "rgba(251,191,36,0.12)",
  },
  {
    icon: MessageCircle,
    title: "Expert Insights",
    description: "Gain access to exclusively curated resources, scholarship tips, and deep industry forecasts.",
    num: "05",
    floatDelay: 0.5,
    accent: "rgba(59,130,246,0.12)",
  },
  {
    icon: TrendingUp,
    title: "Journey Tracking",
    description: "Monitor algorithmic evaluations and celebrate every single milestone towards your goal.",
    num: "06",
    floatDelay: 0.4,
    accent: "rgba(34,197,94,0.12)",
  },
];

/* ─── Individual Feature Card ─── */
const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      style={{ willChange: "transform" }}
      className="group relative flex flex-col p-7 xl:p-9 rounded-[2rem] bg-[#0c0c0e] border border-white/[0.05] overflow-hidden text-left h-full transition-all duration-500 shadow-lg cursor-pointer"
    >
      {/* Hover glow blob */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"
        style={{ background: feature.accent }}
      />

      {/* Subtle inner border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.07)`,
          background: `radial-gradient(circle 280px at top left, rgba(255,255,255,0.025), transparent 100%)`,
        }}
      />

      {/* Top header row */}
      <div className="flex items-start justify-between w-full mb-8 xl:mb-10 relative z-10 shrink-0">
        {/* Animated Icon Container */}
        <div className="relative">
          {/* Subtle inner pulsing ring */}
          <motion.div
            className="absolute -inset-3 rounded-2xl border border-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3 + feature.floatDelay, repeat: Infinity, ease: "easeInOut", delay: feature.floatDelay }}
            style={{ willChange: "transform" }}
          />
          {/* Icon box */}
          <motion.div
            className="relative w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-md group-hover:bg-white/[0.07] group-hover:border-white/[0.14] transition-colors duration-500"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4 + feature.floatDelay, repeat: Infinity, ease: "easeInOut", delay: feature.floatDelay }}
            style={{ willChange: "transform" }}
          >
            <Icon
              className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-500"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        {/* Number badge */}
        <span className="text-[11px] font-mono tracking-[0.25em] font-bold text-white/10 group-hover:text-white/25 transition-colors duration-500">
          {feature.num}
        </span>
      </div>

      {/* Text content */}
      <div className="relative z-10 mt-auto flex-grow flex flex-col justify-end">
        <h3 className="text-[19px] xl:text-[22px] font-display font-semibold mb-2.5 text-white/80 group-hover:text-white tracking-tight transition-colors duration-500 leading-snug">
          {feature.title}
        </h3>
        <p className="text-white/38 group-hover:text-white/58 leading-[1.75] text-[13.5px] xl:text-[14.5px] transition-colors duration-500 flex-grow">
          {feature.description}
        </p>

        {/* Animated sweep underline */}
        <div className="mt-6 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.04] shrink-0">
          <motion.div
            className="h-full w-0 group-hover:w-[45%] transition-all duration-700 ease-[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] rounded-full bg-primary"
            style={{ boxShadow: "0 0 14px 2px hsl(var(--primary) / 0.55)" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Features Section ─── */
const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="features" className="py-20 md:py-32 lg:py-44 bg-[#08080a] text-background overflow-hidden relative">
      {/* Deep minimal background rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.015]">
        <div className="w-[800px] h-[800px] rounded-full border-[1px] border-white absolute border-dashed" />
        <div className="w-[1200px] h-[1200px] rounded-full border-[1px] border-white absolute border-dashed" />
        <div className="w-[1600px] h-[1600px] rounded-full border-[1px] border-white absolute border-dashed" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] text-[10px] md:text-[11px] text-white/50 font-bold tracking-[0.2em] uppercase mb-5 md:mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            Platform Features
          </motion.span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.1] md:leading-[1.05] tracking-tight text-white/90">
            Everything you need <br className="hidden md:block" />
            <span className="text-white/40 font-light">to</span> <span className="text-primary font-bold">find your path.</span>
          </h2>
          <p className="mt-4 md:mt-5 text-white/30 text-[15px] md:text-lg">
            Six powerful tools. One unified platform. Infinite possibilities.
          </p>
        </motion.div>

        {/* ── Mobile Carousel (< md) ── */}
        <div className="md:hidden">
          <Carousel opts={{ align: "start" }} className="w-full pb-4 cursor-grab active:cursor-grabbing">
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={feature.title} className="pl-4 basis-[85%] sm:basis-[60%]">
                  <FeatureCard feature={feature} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* ── Desktop Grid (>= md) ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
