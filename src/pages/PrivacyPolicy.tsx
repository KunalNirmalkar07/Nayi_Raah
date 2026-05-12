import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PrivacyPolicy = () => {
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
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Privacy & Security</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Privacy Policy</h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Last Updated: March 2026. Your privacy is our priority. This policy outlines how we handle your information at Nayi Raah Insights.
              </p>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>
                  We collect information to provide better services to our users. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Account Information:</strong> Name, email address, and profile details you provide during registration.</li>
                  <li><strong>Assessment Data:</strong> Your responses to career aptitude tests and interest surveys to provide accurate recommendations.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our platform, including search queries and chat history with our AI counselor.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">How We Use Your Data</h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>
                  Your data is used solely to enhance your experience and provide personalized career guidance:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>To generate your personalized career roadmaps and recommendations.</li>
                  <li>To match you with eligible scholarships and relevant college programs.</li>
                  <li>To improve our AI counselor's responses based on aggregate, anonymized interactions.</li>
                  <li>To provide notifications about application deadlines for saved opportunities.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Data Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data. All interactions are encrypted, and we do not sell your personal information to third parties. Your assessment results and chat history are private to your account.
              </p>
            </section>

            <div className="pt-12 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Questions about our privacy policy? Contact us at <a href="mailto:privacy@nayiraah.in" className="text-primary hover:underline">privacy@nayiraah.in</a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
