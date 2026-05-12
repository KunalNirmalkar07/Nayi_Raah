import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface EmailConfirmationProps {
  email: string;
  onBackToLogin: () => void;
  onTryAgain: () => void;
}

export const EmailConfirmation = ({ email, onBackToLogin, onTryAgain }: EmailConfirmationProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <Card className="max-w-md w-full border-border/60 shadow-2xl shadow-primary/5 rounded-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-10 h-10 text-success" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-muted-foreground mb-4 text-sm">We've sent a confirmation link to:</p>
          <p className="font-semibold text-lg text-primary mb-6 break-all">{email}</p>
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-semibold mb-2 text-sm">Next Steps:</h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              {["Open your email inbox", "Click the confirmation link from Nayi Raah", "Return here and sign in"].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Didn't receive the email? Check your spam folder or{" "}
            <button onClick={onTryAgain} className="text-primary hover:underline">try again</button>
          </p>
          <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
            <Button onClick={onBackToLogin} className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

interface VerificationNeededProps {
  email: string;
  isResending: boolean;
  onResend: () => void;
  onBackToLogin: () => void;
}

export const VerificationNeeded = ({ email, isResending, onResend, onBackToLogin }: VerificationNeededProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <Card className="max-w-md w-full border-border/60 shadow-2xl shadow-primary/5 rounded-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-10 h-10 text-warning" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Your email hasn't been verified yet. Check your inbox for the verification link.
          </p>
          <p className="font-semibold text-lg text-primary mb-6 break-all">{email}</p>
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Button onClick={onResend} className="w-full gap-2" disabled={isResending}>
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </motion.div>
            <Button variant="outline" onClick={onBackToLogin} className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">Don't forget to check your spam folder!</p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);
