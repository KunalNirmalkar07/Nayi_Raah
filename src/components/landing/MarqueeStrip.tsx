import { motion } from "framer-motion";

const items = [
  "Career Guidance",
  "AI Counselor",
  "Aptitude Tests",
  "Roadmaps",
  "Indian Students",
  "Free Assessment",
  "Dream Career",
  "Find Your Path",
];

const MarqueeStrip = () => {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-5 bg-foreground border-y border-foreground/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 whitespace-nowrap force-gpu"
        style={{ willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-background/80 text-sm font-semibold uppercase tracking-[0.18em]">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeStrip;
