import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Trash2,
  Save,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification prefs (local state for now)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [careerUpdates, setCareerUpdates] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setFullName(data.full_name || "");
      setIsLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSaveName = async () => {
    if (!user || !fullName.trim()) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("user_id", user.id);
    if (error) toast.error("Failed to update name");
    else toast.success("Name updated successfully!");
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    toast.error("Account deletion requires admin approval. Please contact support.");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar userName="Loading..." />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName={fullName || "Student"} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="w-7 h-7 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account, security, and preferences
            </p>
          </motion.div>

          {/* Account Info */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your display name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Display Name</Label>
                  <Input
                    id="settings-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <Button onClick={handleSaveName} disabled={isSaving} size="sm" className="gap-2">
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Security
                </CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !newPassword || !confirmPassword}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  {isChangingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifs, onChange: setEmailNotifs },
                  { label: "Assessment Reminders", desc: "Reminders to complete assessments", value: assessmentReminders, onChange: setAssessmentReminders },
                  { label: "Career Updates", desc: "New career paths and opportunities", value: careerUpdates, onChange: setCareerUpdates },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.onChange} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-destructive/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-xs text-muted-foreground">Sign out from your account</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-destructive">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
