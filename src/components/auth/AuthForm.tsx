import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  mode: "signin" | "signup";
  email: string;
  password: string;
  fullName: string;
  showPassword: boolean;
  rememberMe: boolean;
  isLoading: boolean;
  errors: { email?: string; password?: string; fullName?: string };
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onFullNameChange: (v: string) => void;
  onShowPasswordToggle: () => void;
  onRememberMeChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: "signin" | "signup") => void;
}

const fadeSlide = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const inputClasses =
  "pl-11 h-12 rounded-xl bg-muted/40 border-border/60 text-base placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary/40";

const AuthForm = ({
  mode, email, password, fullName, showPassword, rememberMe, isLoading, errors,
  onEmailChange, onPasswordChange, onFullNameChange, onShowPasswordToggle,
  onRememberMeChange, onSubmit, onModeChange,
}: AuthFormProps) => {
  return (
    <div className="pt-4 flex flex-col justify-center">
      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {mode === "signup" ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
            {mode === "signup"
              ? "Join our community to access tailored career guidance."
              : "Sign in to continue your career journey."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Full Name (signup only) */}
        <AnimatePresence mode="wait">
          {mode === "signup" && (
            <motion.div
              key="fullName"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            >
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
                Full Name
              </Label>
              <div className="relative group">
                <User className="w-[18px] h-[18px] text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => onFullNameChange(e.target.value)}
                  disabled={isLoading}
                  className={`${inputClasses} ${errors.fullName ? "border-destructive focus:ring-destructive/20" : ""}`}
                />
              </div>
              {errors.fullName && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive pl-1">{errors.fullName}</motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.div custom={0} variants={fadeSlide} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="w-[18px] h-[18px] text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
              className={`${inputClasses} ${errors.email ? "border-destructive focus:ring-destructive/20" : ""}`}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive pl-1">{errors.email}</motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div custom={1} variants={fadeSlide} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
            Password
          </Label>
          <div className="relative group">
            <Lock className="w-[18px] h-[18px] text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
              className={`${inputClasses} pr-12 ${errors.password ? "border-destructive focus:ring-destructive/20" : ""}`}
            />
            <button
              type="button"
              onClick={onShowPasswordToggle}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/60"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive pl-1">{errors.password}</motion.p>
          )}
        </motion.div>

        {/* Remember me / Forgot password (signin only) */}
        <AnimatePresence>
          {mode === "signin" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => onRememberMeChange(checked as boolean)}
                  className="rounded-[5px] border-border/80"
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                Forgot password?
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div custom={2} variants={fadeSlide} initial="hidden" animate="visible" className="pt-3">
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {mode === "signup" ? "Creating Account..." : "Signing In..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {mode === "signup" ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-muted-foreground/60 uppercase tracking-wider">or</span>
        </div>
      </div>

      {/* Switch mode */}
      <motion.div
        custom={3}
        variants={fadeSlide}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onModeChange("signin")}
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Log In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onModeChange("signup")}
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Create one
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;
