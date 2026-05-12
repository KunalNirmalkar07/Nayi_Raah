import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const faqs = [
  {
    q: "Is Nayi Raah completely free?",
    a: "Yes — 100% free for every student in India. No credit card, no hidden fees, no premium tiers. We believe career guidance should be accessible to everyone, regardless of their background or financial situation.",
  },
  {
    q: "Which streams does it support?",
    a: "All streams — Science (PCM & PCB), Commerce, and Arts/Humanities. Our AI career engine has over 150+ career paths mapped across every stream, including emerging fields like data science, UX design, digital marketing, and social entrepreneurship.",
  },
  {
    q: "How accurate is the AI career matching?",
    a: "Our matching algorithm analyses 500+ signals from your aptitude scores, personality traits, interests, and academic profile. While no system can predict the future with 100% certainty, students consistently report that their top 3 career matches feel highly resonant with who they are.",
  },
  {
    q: "How long does the assessment take?",
    a: "The core aptitude and personality assessment takes around 10–15 minutes. After you complete it, your AI-generated career matches and personalized roadmap are ready instantly — no waiting.",
  },
  {
    q: "Can I retake the assessment if my interests change?",
    a: "Absolutely. You can retake the assessment as many times as you like. Career interests evolve — especially in Class 9–12 — so we encourage you to retake it every 6 months or after a major life experience.",
  },
  {
    q: "What kind of roadmap do I get?",
    a: "Your roadmap includes: recommended entrance exams (JEE, NEET, CLAT, etc.), target colleges across India, skill milestones with timelines, relevant scholarships you qualify for, and a month-by-month action plan for your first year. It's personalized to your state, education level, and career goal.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Your assessment results and profile data are stored securely and are never sold or shared with third parties. You can delete your account and all associated data at any time from the Settings page.",
  },
  {
    q: "Who is this platform for?",
    a: "Primarily for students in Class 8–12 and those who have recently completed Class 12 and are deciding between college streams or careers. It's especially valuable for first-generation learners and students in Tier 2/3 cities who may not have access to professional career counsellors.",
  },
];

const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    className={`border-b border-black/[0.07] last:border-0`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
      aria-expanded={isOpen}
    >
      <span
        className={`font-display font-semibold text-[15px] md:text-[17px] leading-snug transition-colors duration-300 ${
          isOpen ? "text-primary" : "text-[#111] group-hover:text-primary"
        }`}
      >
        {faq.q}
      </span>
      <span
        className={`shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
          isOpen
            ? "bg-primary border-primary text-white"
            : "bg-black/[0.03] border-black/[0.08] text-black/50 group-hover:border-primary/40 group-hover:text-primary"
        }`}
      >
        {isOpen ? (
          <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
        ) : (
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
        )}
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="pb-5 md:pb-6 text-[#555] text-[14px] md:text-[15px] leading-[1.75] max-w-2xl pr-10 md:pr-14">
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className="relative py-16 md:py-28 lg:py-36 bg-background overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-20 items-start">
          {/* Left — sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <span className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-primary mb-3 md:mb-4">
              <span className="block w-4 md:w-5 h-[1.5px] bg-primary" />
              FAQ
              <span className="block w-4 md:w-5 h-[1.5px] bg-primary" />
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[#111] leading-[1.1] mb-4 md:mb-5">
              Got{" "}
              <span className="text-primary">
                questions?
              </span>
              <br />
              We've got
              <br />
              answers.
            </h2>
            <p className="text-[#666] text-[14px] md:text-[15px] leading-relaxed max-w-xs mb-6 md:mb-8">
              Everything you need to know before you start your journey with Nayi Raah.
            </p>
            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline underline-offset-4 transition-all mb-10"
            >
              Still have questions? Chat with us →
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block w-full max-w-[500px] xl:max-w-[600px] relative mt-12 -ml-2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[120%] bg-primary/5 rounded-full blur-[80px] -z-10" />
              <DotLottieReact
                src="https://assets-v2.lottiefiles.com/a/3281b124-596c-11f0-b0b0-7747580cf349/3zw31oBnii.lottie"
                loop
                autoplay
                className="w-full h-auto object-contain transform-gpu"
              />
            </motion.div>
          </motion.div>

          {/* Right — accordion */}
          <div className="bg-white rounded-3xl shadow-[0_4px_40px_-8px_rgba(0,0,0,0.08)] border border-black/[0.04] divide-y-0 px-6 md:px-10 py-2">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
