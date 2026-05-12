import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Student",
    content: "Nayi Raah helped me realize my passion for data science. The AI counselor gave me clarity when I was confused between multiple career options.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Commerce Student",
    content: "The aptitude assessment was eye-opening! It showed me strengths I didn't know I had and matched me with careers I never considered.",
    rating: 5,
    initials: "RV",
  },
  {
    name: "Ananya Patel",
    role: "Arts Student",
    content: "The career roadmap feature is amazing. Now I have a clear step-by-step plan to become a UX designer. Highly recommend!",
    rating: 5,
    initials: "AP",
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  // Star animation variants
  const starContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.12 + 0.3,
      },
    },
  };

  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -30 },
    show: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    hover: {
      scale: 1.25,
      rotate: 15,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className="relative group rounded-[2rem] p-6 md:p-10 bg-[#0c0c0e] border border-white/5 hover:border-primary/40 shadow-lg hover:shadow-[0_24px_48px_-12px_rgba(140,198,62,0.15)] transition-all duration-500 overflow-hidden h-full flex flex-col"
    >
      {/* Hover glow background */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-5 right-6 md:top-6 md:right-8">
        <Quote className="w-8 h-8 md:w-10 md:h-10 text-white/5 group-hover:text-primary/20 transition-colors duration-500 transform group-hover:-translate-y-1 group-hover:rotate-6 will-change-transform" />
      </div>

      {/* Animated Rating stars */}
      <motion.div 
        variants={starContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex gap-1.5 mb-6 md:mb-8"
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <motion.div key={i} variants={starVariants} whileHover="hover" className="cursor-default">
            <Star className="w-[18px] h-[18px] md:w-5 md:h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <p className="text-white/70 leading-relaxed mb-6 md:mb-10 text-[14px] md:text-[15px] font-medium group-hover:text-white/90 transition-colors duration-500 relative z-10 flex-grow">
        "{testimonial.content}"
      </p>

      {/* Animated underline divider */}
      <div className="h-[2px] bg-white/5 overflow-hidden mb-6 md:mb-8 rounded-full shrink-0">
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full bg-gradient-to-r from-primary/80 to-transparent"
        />
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0 shadow-[0_0_15px_rgba(140,198,62,0.1)] group-hover:shadow-[0_0_25px_rgba(140,198,62,0.3)] transition-shadow duration-500 bg-primary/10 border border-primary/30 text-primary z-10"
        >
          {testimonial.initials}
        </motion.div>
        <div>
          <div className="font-semibold text-white/90 group-hover:text-primary transition-colors duration-300 text-[14px] md:text-[15px]">{testimonial.name}</div>
          <div className="text-[12px] md:text-sm text-white/40 font-medium">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="testimonials" className="py-16 md:py-28 bg-[#08080a] text-white overflow-hidden relative">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-0 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(circle at 20% 80%, hsl(var(--primary)), transparent 60%)" }}
      />

      <div className="container mx-auto px-4 relative z-10 w-full overflow-hidden md:overflow-visible">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[10px] md:text-xs text-primary font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5"
          >
            Student Stories
          </motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] md:leading-[0.95]">
            What students
            <br />
            <span className="text-primary">say about us.</span>
          </h2>
        </motion.div>

        {/* Testimonials - Embla Swipeable Carousel */}
        <Carousel opts={{ align: "start" }} className="w-full pb-4 md:pb-0 cursor-grab active:cursor-grabbing">
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.name} className="pl-4 md:pl-6 basis-[85%] md:basis-1/3">
                <TestimonialCard testimonial={testimonial} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
