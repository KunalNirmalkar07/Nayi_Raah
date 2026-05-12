import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, GraduationCap, MapPin, Heart, Save, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const educationLevels = [
  "8th Pass", "9th Class", "10th Pass", "11th Class (Science)",
  "11th Class (Commerce)", "11th Class (Arts)", "12th Pass (Science)",
  "12th Pass (Commerce)", "12th Pass (Arts)", "Undergraduate",
  "Postgraduate", "Other",
];

const interestOptions = [
  "Engineering", "Medicine", "Law", "Business", "Arts & Design",
  "Science & Research", "Teaching", "Government Services", "IT & Software",
  "Agriculture", "Media & Journalism", "Sports", "Defence",
  "Hospitality & Tourism", "Social Work",
];

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setEducationLevel(data.education_level || "");
        setDistrict(data.district || "");
        setSelectedInterests(data.interests || []);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
        ? [...prev, interest]
        : prev
    );
  };

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        education_level: educationLevel || null,
        interests: (selectedInterests.length > 0 ? selectedInterests : null) as string[] | null,
        district: district || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated successfully!");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar userName="Loading..." />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName={fullName || "Student"} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Mobile PeerX Profile ── */}
          <div className="md:hidden pb-24">
            <div className="px-2 mb-8 mt-2">
              <div className="flex items-center justify-between mb-8">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  PROFILE SETUP
                </div>
              </div>
              
              <h1 className="text-[44px] font-extrabold tracking-tight leading-[1.05] text-slate-900 mb-3">
                Tell us about<br />
                <span className="font-serif italic text-teal-600 font-normal tracking-normal">yourself.</span>
              </h1>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-[280px] font-medium">
                This helps us perfectly personalize every roadmap, scheme, and college to match your vibe.
              </p>
            </div>

            <div className="px-2 space-y-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                </div>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full h-[58px] bg-slate-50 text-[15px] font-bold text-slate-900 rounded-[20px] pl-[52px] pr-4 border-slate-100 shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-teal-500"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <GraduationCap className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                </div>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className="w-full h-[58px] bg-slate-50 text-[15px] font-bold text-slate-900 rounded-[20px] pl-[52px] pr-4 border-slate-100 shadow-sm focus:ring-1 focus:ring-teal-500">
                    <SelectValue placeholder="Education Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-2xl border-slate-100 shadow-xl">
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level} className="text-[14px] font-medium py-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <MapPin className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                </div>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="w-full h-[58px] bg-slate-50 text-[15px] font-bold text-slate-900 rounded-[20px] pl-[52px] pr-4 border-slate-100 shadow-sm focus:ring-1 focus:ring-teal-500">
                    <SelectValue placeholder="State / District" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-2xl border-slate-100 shadow-xl max-h-[300px]">
                    {states.map((d) => (
                      <SelectItem key={d} value={d} className="text-[14px] font-medium py-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Your Interests</h3>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">{selectedInterests.length}/5</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`transition-all px-4 py-2.5 text-[13px] font-bold rounded-full ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 inline-block" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-[58px] mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-[15px] shadow-xl shadow-slate-900/20 transition-transform active:scale-95"
              >
                {isSaving ? "Saving..." : "Save Identity"}
              </Button>
            </div>
          </div>

          {/* ── Desktop Classic Profile ── */}
          <div className="hidden md:block space-y-6 pb-12">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Update your personal info and career preferences</p>
            </div>

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="opacity-60"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Career Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Career Interests
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    {selectedInterests.length}/5 selected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <Badge
                        key={interest}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all px-3 py-1.5 text-sm ${
                          isSelected
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:border-primary"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
                {selectedInterests.length >= 5 && (
                  <p className="text-xs text-muted-foreground mt-2">Maximum 5 interests selected</p>
                )}
              </CardContent>
            </Card>

            {/* Save */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full gap-2"
              size="lg"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
