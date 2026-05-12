import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Sparkles, ArrowRight, MessageCircle, Bot, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MagneticButton from "@/components/ui/MagneticButton";

const AIGuidanceSection = () => {
  return (
    <section id="ai-guidance" className="relative py-24 md:py-36 lg:py-48 overflow-hidden bg-[#0a0a0c]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Content Area */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Next-Gen Intelligence
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-medium leading-[1.05] tracking-tight text-white mb-6">
              Your Personal <br />
              <span className="text-primary italic font-serif">AI Career</span> Counselor.
            </h2>
            
            <p className="text-lg text-white/50 leading-relaxed max-w-xl mb-10">
              Go beyond simple advice. Our AI leverages multi-dimensional data to map your unique strengths to the perfect career paths across India's evolving landscape.
            </p>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: MessageCircle, title: "24/7 Guidance", desc: "Instant answers to any career query" },
                { icon: Zap, title: "Smart Matching", desc: "Algorithmic correlation for precision" },
                { icon: ShieldCheck, title: "Data-Backed", desc: "Insights from verified institutions" },
                { icon: Bot, title: "Interactive", desc: "Conversational discovery process" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                    <item.icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <MagneticButton distance={0.25}>
              <Link to="/chat">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-white hover:bg-primary/90 font-bold gap-3 shadow-xl shadow-primary/20">
                  Try AI Counselor Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Right: Animation Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Glass Container for Animation */}
            <div className="relative aspect-square max-w-[540px] mx-auto rounded-[3rem] p-1 bg-gradient-to-br from-white/10 via-white/[0.02] to-transparent border border-white/10 overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-[#0c0c0e] rounded-[2.9rem] z-0" />
              
              {/* Inner Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <DotLottieReact
                  src="https://lottie.host/9a9dfe42-ee72-4d31-b920-6968a7024d67/07rJZKa3ij.lottie"
                  loop
                  autoplay
                  className="w-full h-full scale-[1.2] group-hover:scale-[1.25] transition-transform duration-700"
                />
              </div>

              {/* Floating Decorative Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 z-20 px-4 py-2 rounded-2xl glass-dark border border-white/10 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Counselor Online</span>
                </div>
              </motion.div>
            </div>

            {/* Background elements under the container */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
            <div className="absolute -z-10 -top-10 -left-10 w-48 h-48 bg-secondary/10 blur-[60px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIGuidanceSection;
