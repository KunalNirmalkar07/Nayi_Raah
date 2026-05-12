import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Compass,
  User,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MagneticButton from "@/components/ui/MagneticButton";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const FADE_UP = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrors({});
    setSuccessMessage(null);
  }, [isSignUp]);

  const toggleMode = () => setIsSignUp(!isSignUp);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.email = e.errors[0].message;
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) newErrors.password = e.errors[0].message;
    }

    if (isSignUp) {
      try {
        nameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) newErrors.fullName = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;

        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setSuccessMessage("Account created! Please verify your email to log in.");
          toast.success("Account created! Verification email sent.");
        } else {
          setSuccessMessage("Account created and logged in!");
          toast.success("Welcome aboard!");
          navigate("/dashboard");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setSuccessMessage("Signed in successfully!");
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      const err = error as Error;
      const friendlyMessage = err?.message && err.message.includes("Failed to fetch")
        ? "Network error: unable to contact authentication server. Check your Supabase URL (.env) and CORS settings."
        : err.message || "An error occurred during authentication";
      console.error("Auth submit error:", err);
      toast.error(friendlyMessage);
      setErrors({ auth: friendlyMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "pl-11 h-12 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto relative flex items-center justify-center px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to home
          </button>
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold text-slate-900">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/10">
              <Compass className="w-5 h-5" />
            </div>
            Nayi Raah
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] items-start">
          <motion.section
            className="rounded-[2rem] bg-white p-6 lg:p-8 shadow-2xl shadow-slate-200/40"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
              <div className="bg-white p-4 sm:p-5">
                <div className="rounded-[1.5rem] bg-white p-4 sm:p-5">
                  <img
                    src="/login.gif"
                    alt="Login animation"
                    className="h-[560px] w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 flex flex-col gap-4">
              <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                {isSignUp ? "Create your free account" : "Welcome back"}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  {isSignUp ? "Join Nayi Raah" : "Sign in to continue"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                  {isSignUp
                    ? "Start your personalized career journey with a clean, modern login experience."
                    : "Access your dashboard, applications, and career guidance in one polished place."}
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{isSignUp ? "Sign up" : "Sign in"}</p>
                  <p className="text-xs text-slate-500">{isSignUp ? "Create your account in seconds" : "Use your email to continue"}</p>
                </div>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm ring-1 ring-primary/15 transition hover:bg-primary/5"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Full name
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                        className={`${inputClasses} pl-11`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={`${inputClasses} pl-11`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password
                    </Label>
                    {!isSignUp && (
                      <Link to="/auth/reset-password" className="text-sm font-semibold text-primary hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className={`${inputClasses} pr-12 pl-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-primary/20 transition hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        {isSignUp ? "Create Account" : "Sign In"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  {import.meta.env.DEV && import.meta.env.VITE_DEV_DEMO_EMAIL && import.meta.env.VITE_DEV_DEMO_PASSWORD && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        className="w-full mt-2 rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-slate-300"
                        onClick={async () => {
                          const demoEmail = import.meta.env.VITE_DEV_DEMO_EMAIL as string;
                          const demoPassword = import.meta.env.VITE_DEV_DEMO_PASSWORD as string;
                          setIsLoading(true);
                          try {
                            const { error } = await signIn(demoEmail, demoPassword);
                            if (error) {
                              toast.error(error.message || 'Demo login failed');
                              setErrors({ auth: error.message || 'Demo login failed' });
                            } else {
                              toast.success('Signed in as demo user');
                              navigate('/dashboard');
                            }
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : String(err);
                            console.error('Demo login error:', err);
                            toast.error(msg || 'Demo login failed');
                            setErrors({ auth: msg });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        Sign in as Demo User
                      </Button>
                      <p className="mt-2 text-center text-xs text-slate-500">Dev only — set VITE_DEV_DEMO_EMAIL and VITE_DEV_DEMO_PASSWORD in your .env</p>
                    </div>
                  )}

                </div>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                {isSignUp ? (
                  <>Already registered? <button type="button" onClick={toggleMode} className="font-semibold text-primary hover:text-primary/80">Sign in</button></>
                ) : (
                  <>New here? <button type="button" onClick={toggleMode} className="font-semibold text-primary hover:text-primary/80">Create account</button></>
                )}
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-3xl bg-emerald-600 px-6 py-3 text-white shadow-2xl shadow-emerald-500/25">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
