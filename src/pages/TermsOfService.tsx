import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-8 gap-2 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center md:text-left mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">Platform Rules</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Terms of Service</h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                By using Nayi Raah Insights, you agree to the following terms and conditions. Please read them carefully.
              </p>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">1. Use of Service</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nayi Raah Insights provides AI-powered career guidance and information about educational opportunities in India. You agree to use the platform for personal, non-commercial purposes and to provide accurate information for the best guidance results.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-2xl font-bold">2. AI Guidance Disclaimer</h2>
              </div>
              <div className="p-4 rounded-xl bg-muted border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our career recommendations and AI counselor responses are for informational purposes only. While we strive for accuracy, educational requirements and admission policies change frequently. Users should always verify official information from the respective college or scholarship provider websites.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">3. User Responsibility</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials. You agree not to misuse the platform or attempt to scrape data from our college and scholarship databases.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold pl-13">4. Intellectual Property</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-13">
                All content on the platform, including the assessment logic, custom roadmap generation algorithms, and branding, is the property of Nayi Raah Insights.
              </p>
            </section>

            <div className="pt-12 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Last updated: March 26, 2026. For questions regarding these terms, please contact <a href="mailto:info@nayiraah.in" className="text-primary hover:underline">info@nayiraah.in</a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
