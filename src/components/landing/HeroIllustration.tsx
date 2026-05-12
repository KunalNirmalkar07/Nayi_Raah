import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Clock, Calculator, LineChart, Brain } from "lucide-react";

interface HeroIllustrationProps {
  scrollYProgress: MotionValue<number>;
}

// Custom interactive icon component
const InteractiveIcon = ({
  children,
  initialPos,
  yOffset,
  duration,
  scrollParallax,
  mousePos,
  containerRef
}: {
  children: React.ReactNode;
  initialPos: { x: string; y: string };
  yOffset: number;
  duration: number;
  scrollParallax: MotionValue<number>;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const [avoidance, setAvoidance] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!iconRef.current || !containerRef.current) return;
    
    // Calculate distance between mouse and icon
    const iconRect = iconRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Icon center relative to container
    const iconCenterX = iconRect.left - containerRect.left + iconRect.width / 2;
    const iconCenterY = iconRect.top - containerRect.top + iconRect.height / 2;

    const dx = mousePos.x - iconCenterX;
    const dy = mousePos.y - iconCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Force field radius
    const radius = 120;
    
    if (distance < radius && distance > 0) {
      // Push away proportionally to how close the mouse is
      const force = (radius - distance) / radius;
      setAvoidance({
        x: -(dx / distance) * force * 40,
        y: -(dy / distance) * force * 40
      });
    } else {
      setAvoidance({ x: 0, y: 0 });
    }
  }, [mousePos, containerRef]);

  return (
    <motion.div
      ref={iconRef}
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        left: initialPos.x,
        top: initialPos.y,
        y: scrollParallax, 
        willChange: "transform"
      }}
    >
      <motion.div
        animate={{
          y: [-yOffset, yOffset, -yOffset],
          x: avoidance.x,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          y: { duration: duration, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 100, damping: 15 },
          rotate: { duration: duration * 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          y: avoidance.y !== 0 ? avoidance.y : undefined,
        }}
        className="text-foreground/80 bg-background/50 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-border/40"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const HeroIllustration = ({ scrollYProgress }: HeroIllustrationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Ascending parallax for background elements (1.5x scroll speed)
  // Assuming scroll goes 0 -> 1 over the hero section
  const ascendingY = useTransform(scrollYProgress, [0, 1], [0, -250]);
  
  // Slower backdrop parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  // Check if mouse is near the right side of the screen/container
  const isHoveringRight = 
    containerRef.current 
      ? mousePos.x > containerRef.current.getBoundingClientRect().width * 0.5 
      : false;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[45vw] h-full min-h-[600px] flex items-center justify-center overflow-visible select-none"
    >
      {/* Dynamic Background Blob */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute w-[80%] aspect-square max-w-[600px] rounded-[40%] bg-primary/20 blur-[60px]"
        animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
            borderRadius: ["40%", "45%", "35%", "40%"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Solid green blob base */}
      <motion.div 
        className="absolute w-[75%] max-w-[550px] aspect-square rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-[#b8f2d8] md:ml-[10%]"
        animate={{
             borderRadius: [
                "30% 70% 70% 30% / 30% 30% 70% 70%",
                "50% 50% 30% 70% / 50% 50% 70% 30%",
                "30% 70% 70% 30% / 30% 30% 70% 70%"
             ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background Interactive Icons */}
      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "15%", y: "20%" }} yOffset={15} duration={4.5}>
        <Clock className="w-8 h-8 text-emerald-600" />
      </InteractiveIcon>
      
      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "80%", y: "15%" }} yOffset={25} duration={5.2}>
        <div className="font-serif italic text-2xl font-bold text-emerald-700">f(x)</div>
      </InteractiveIcon>
      
      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "10%", y: "60%" }} yOffset={12} duration={3.8}>
        <div className="font-serif italic text-xl font-bold text-emerald-600">x - y</div>
      </InteractiveIcon>

      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "75%", y: "70%" }} yOffset={20} duration={6}>
        <div className="font-serif italic text-xl font-bold text-emerald-800">a² + b²</div>
      </InteractiveIcon>
      
      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "85%", y: "45%" }} yOffset={18} duration={4.2}>
        <Calculator className="w-6 h-6 text-emerald-600" />
      </InteractiveIcon>

      <InteractiveIcon scrollParallax={ascendingY} containerRef={containerRef} mousePos={mousePos} initialPos={{ x: "20%", y: "85%" }} yOffset={10} duration={3.5}>
        <LineChart className="w-7 h-7 text-emerald-700" />
      </InteractiveIcon>

      {/* Main Illustration Area */}
      <div className="relative z-10 w-[400px] h-[450px]">
        {/* Shadow */}
        <motion.div
           className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[160px] h-[25px] rounded-[50%] bg-black/15 blur-md"
           animate={{ scale: [1, 0.7, 1], opacity: [0.6, 0.3, 0.6] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Student Character + Chair */}
        <motion.div
           className="absolute inset-0 flex items-center justify-center bottom-[50px]"
           animate={{ y: [0, -15, 0] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Abstract Vector Setup for Student & Desk */}
            <div className="relative w-full h-full">
                {/* Chair (Simplified) */}
                <div className="absolute bottom-[40px] left-[130px] w-[60px] h-[80px]">
                    <div className="absolute bottom-0 w-[50px] h-2 bg-emerald-950 rounded-full" />
                    <div className="absolute bottom-0 left-[5px] w-2 h-[45px] bg-emerald-950 rounded-sm" />
                    <div className="absolute bottom-0 right-[5px] w-2 h-[45px] bg-emerald-950 rounded-sm" />
                    <div className="absolute top-[35px] w-[50px] h-2 bg-emerald-900 rounded-sm" />
                    <div className="absolute top-0 right-0 w-[12px] h-[40px] bg-emerald-950 rounded-t-lg" />
                </div>

                {/* Desk */}
                <div className="absolute bottom-[50px] left-[50px] w-[90px] h-[90px]">
                    <div className="absolute top-0 w-full h-[10px] bg-emerald-800 rounded-lg transform -skew-x-12" />
                    <div className="absolute top-[10px] left-[10px] w-[8px] h-[80px] bg-emerald-950 rounded-b-sm" />
                    <div className="absolute top-[10px] right-[10px] w-[8px] h-[80px] bg-emerald-950 rounded-b-sm" />
                </div>

                {/* Student Body (Abstract minimal shapes) */}
                <div className="absolute bottom-[80px] left-[100px]">
                    {/* Legs */}
                    <div className="absolute bottom-0 left-[20px] w-[40px] h-[80px]">
                        <div className="absolute bottom-0 left-0 w-[45px] h-[18px] bg-slate-800 rounded-xl" />
                        <div className="absolute bottom-[10px] left-[10px] w-[18px] h-[70px] bg-slate-900 rounded-lg transform rotate-[-15deg]" />
                    </div>
                    {/* Torso */}
                    <div className="absolute bottom-[70px] left-[35px] w-[45px] h-[65px] bg-primary rounded-[40%] transform rotate-[10deg]" />
                    {/* Arm */}
                    <div className="absolute bottom-[75px] left-[15px] w-[55px] h-[16px] bg-primary rounded-lg transform rotate-[25deg]" />
                    {/* Hand */}
                    <div className="absolute bottom-[65px] left-[5px] w-[14px] h-[14px] bg-[#f8d4c4] rounded-full" />
                    {/* Head */}
                    <div className="absolute bottom-[125px] left-[25px] w-[45px] h-[55px] bg-[#f8d4c4] rounded-[22px_22px_18px_25px] transform rotate-[15deg]">
                        {/* Hair */}
                        <div className="absolute top-[-5px] left-[-3px] w-[52px] h-[30px] bg-slate-900 rounded-[20px_20px_10px_10px]" />
                        {/* Eye */}
                        <div className="absolute top-[22px] left-[12px] w-[5px] h-[5px] bg-slate-800 rounded-full" />
                        <div className="absolute top-[23px] left-[28px] w-[4px] h-[4px] bg-slate-800 rounded-full" />
                        {/* Smile */}
                        <div className="absolute top-[35px] left-[15px] w-[12px] h-[6px] border-b-2 border-slate-800 rounded-full transform rotate-[-5deg]" />
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Floating Papers with Wind-flutter effect (lifts 10px on right-side hover) */}
        <motion.div
           className="absolute bottom-[170px] left-[40px] pointer-events-none transition-transform duration-500"
           style={{ transform: isHoveringRight ? "translateY(-10px)" : "translateY(0px)" }}
           animate={{ 
               y: [0, -20, 0],
               rotateZ: [0, -5, 3, 0],
               x: [0, -5, 5, 0]
           }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Paper 1 */}
            <div className="absolute left-0 top-0 w-[70px] h-[90px] bg-white rounded-md shadow-lg border border-slate-200 transform rotate-[-12deg] p-2 flex flex-col gap-2">
                <div className="w-8 h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-1"><div className="w-2 h-2 border border-slate-300 rounded-sm" /><div className="w-6 h-1 bg-slate-200 rounded-full" /></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-sm" /><div className="w-8 h-1 bg-slate-200 rounded-full" /></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 border border-slate-300 rounded-sm" /><div className="w-5 h-1 bg-slate-200 rounded-full" /></div>
            </div>
            
            {/* Paper 2 */}
            <div className="absolute left-[30px] top-[15px] w-[65px] h-[85px] bg-white/95 rounded-md shadow-xl border border-slate-200 transform rotate-[8deg] p-2 flex flex-col gap-2">
                <div className="w-10 h-1 bg-primary/40 rounded-full" />
                <div className="w-full h-[1px] bg-slate-100 my-1" />
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded" /><div className="w-6 h-1 bg-slate-200 rounded-full" /></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 rounded" /><div className="w-5 h-1 bg-slate-200 rounded-full" /></div>
            </div>
        </motion.div>

        {/* Small floating plant / objects */}
        <motion.div
           className="absolute bottom-[60px] right-[40px]"
           animate={{ y: [0, -8, 0] }}
           transition={{ duration: 4.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="w-[30px] h-[25px] bg-emerald-900 rounded-b-lg rounded-t-sm" />
            <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 w-[4px] h-[20px] bg-emerald-700" />
            <div className="absolute bottom-[35px] right-[10px] w-[15px] h-[15px] bg-primary rounded-full rounded-bl-none transform rotate-45" />
            <div className="absolute bottom-[40px] left-[10px] w-[12px] h-[12px] bg-primary rounded-full rounded-br-none transform -rotate-45" />
        </motion.div>

        {/* Floating Backpack */}
        <motion.div
           className="absolute bottom-[40px] left-[180px]"
           animate={{ y: [0, -12, 0], rotateZ: [0, 2, 0] }}
           transition={{ duration: 5.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="w-[50px] h-[60px] bg-emerald-500 rounded-[20px_20px_10px_10px] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] relative">
                <div className="absolute bottom-[10px] left-[10px] w-[30px] h-[20px] bg-emerald-600 rounded-lg" />
                <div className="absolute top-[-5px] left-[15px] w-[20px] h-[10px] border-2 border-emerald-700 rounded-t-full border-b-0" />
            </div>
        </motion.div>
      </div>

    </div>
  );
};
