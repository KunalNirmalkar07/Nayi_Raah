import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { scholarships, type Scholarship } from "@/data/scholarships";

export interface RecommendedScholarship {
  scholarship: Scholarship;
  matchScore: number;
  matchReasons: string[];
}

// Map profile education levels to scholarship education levels
const educationMapping: Record<string, string[]> = {
  "8th Pass": ["8th-10th"],
  "9th Class": ["8th-10th"],
  "10th Pass": ["8th-10th", "11th-12th"],
  "11th Class (Science)": ["11th-12th"],
  "11th Class (Commerce)": ["11th-12th"],
  "11th Class (Arts)": ["11th-12th"],
  "12th Pass (Science)": ["11th-12th", "Undergraduate"],
  "12th Pass (Commerce)": ["11th-12th", "Undergraduate"],
  "12th Pass (Arts)": ["11th-12th", "Undergraduate"],
  Undergraduate: ["Undergraduate"],
  Postgraduate: ["Postgraduate"],
  Other: [],
};

// Map interests to scholarship categories
const interestCategoryMapping: Record<string, string[]> = {
  Engineering: ["Merit-Based", "Government", "Private"],
  Medicine: ["Merit-Based", "Government"],
  Law: ["Merit-Based", "Private"],
  Business: ["Merit-Based", "Private"],
  "Arts & Design": ["Merit-Based", "Private"],
  "Science & Research": ["Merit-Based", "Government"],
  Teaching: ["Government", "Need-Based"],
  "Government Services": ["Government", "Merit-Based"],
  "IT & Software": ["Merit-Based", "Private"],
  Agriculture: ["Government", "Need-Based"],
  "Media & Journalism": ["Private", "Merit-Based"],
  Sports: ["Sports"],
  Defence: ["Government"],
  "Hospitality & Tourism": ["Private"],
  "Social Work": ["Need-Based", "Government"],
};

export function useScholarshipRecommendations() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    district: string | null;
    education_level: string | null;
    interests: string[] | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("district, education_level, interests")
        .eq("user_id", user.id)
        .single();

      setProfile(data || null);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const recommendations = useMemo<RecommendedScholarship[]>(() => {
    if (!profile) return [];

    const { district, education_level, interests } = profile;
    const hasProfile = district || education_level || (interests && interests.length > 0);
    if (!hasProfile) return [];

    const mappedEduLevels = education_level
      ? educationMapping[education_level] || []
      : [];

    const relevantCategories = new Set<string>();
    if (interests) {
      interests.forEach((interest) => {
        const cats = interestCategoryMapping[interest];
        if (cats) cats.forEach((c) => relevantCategories.add(c));
      });
    }

    const scored: RecommendedScholarship[] = scholarships.map((s) => {
      let score = 0;
      const reasons: string[] = [];

      // State match (highest weight)
      if (district) {
        if (s.states === "All India") {
          score += 15;
          reasons.push("Available nationwide");
        } else if (Array.isArray(s.states) && s.states.includes(district)) {
          score += 40;
          reasons.push(`Available in ${district}`);
        }
      } else {
        // No state in profile — favor All India
        if (s.states === "All India") {
          score += 10;
        }
      }

      // Education level match
      if (mappedEduLevels.length > 0) {
        const eduMatch = s.educationLevels.some((el) =>
          mappedEduLevels.includes(el)
        );
        if (eduMatch) {
          score += 30;
          reasons.push("Matches your education level");
        }
      }

      // Category / interest match
      if (relevantCategories.size > 0 && relevantCategories.has(s.category)) {
        score += 20;
        reasons.push(`Relevant to your interests`);
      }

      // Small bonus for scholarships with higher amounts (parse leading digits)
      const amountMatch = s.amount.match(/[\d,]+/);
      if (amountMatch) {
        const amt = parseInt(amountMatch[0].replace(/,/g, ""), 10);
        if (amt >= 50000) score += 5;
        if (amt >= 100000) score += 5;
      }

      return { scholarship: s, matchScore: score, matchReasons: reasons };
    });

    return scored
      .filter((r) => r.matchScore >= 25)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [profile]);

  const hasProfile = Boolean(
    profile &&
      (profile.district ||
        profile.education_level ||
        (profile.interests && profile.interests.length > 0))
  );

  return { recommendations, loading, hasProfile };
}
