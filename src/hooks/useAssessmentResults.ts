import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { careerPathsData, CareerPath } from "@/data/careers";

export type { CareerPath };

export interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: string;
  scores: {
    analytical: number;
    creative: number;
    social: number;
    practical: number;
    aptitudeScore?: number;
    recommendedStream?: string;
    completedTasks?: string[];
    roadmap_generated?: boolean;
  };
  career_matches: {
    career: string;
    match: number;
    stream: string;
  }[];
  completed_at: string;
}

export const useAssessmentResults = () => {
  const { user } = useAuth();
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        // Use type assertion carefully
        const result = data as unknown as AssessmentResult;
        setLatestResult(result);

        // Calculate career path recommendations based on scores
        const scores = result.scores;
        // Normalize raw trait counts (0-9) to percentage (0-100)
        const maxTraitScore = 9;
        const norm = (val: number | undefined) => ((val || 0) / maxTraitScore) * 100;
        const analytical = norm(scores.analytical);
        const creative = norm(scores.creative);
        const social = norm(scores.social);
        const practical = norm(scores.practical);
        const aptitude = scores.aptitudeScore || 50;

        const paths = Object.values(careerPathsData).map((path) => {
          let matchScore = 0;

          // Normalized traits from data
          const pathTraits = path.traits;
          const totalPathTraits = pathTraits.analytical + pathTraits.creative + pathTraits.social + pathTraits.practical;
          
          // Weighted trait matching
          matchScore += (analytical * pathTraits.analytical / totalPathTraits);
          matchScore += (creative * pathTraits.creative / totalPathTraits);
          matchScore += (social * pathTraits.social / totalPathTraits);
          matchScore += (practical * pathTraits.practical / totalPathTraits);

          // Boost by aptitude (30% weight)
          matchScore = matchScore * 0.7 + aptitude * 0.3;

          // Stream bonus
          if (result.scores.recommendedStream === path.stream || path.stream === "Any") {
            matchScore += 8;
          }

          return { ...path, matchScore: Math.min(Math.round(matchScore), 99) };
        });

        // Sort by match score
        paths.sort((a, b) => b.matchScore - a.matchScore);
        setRecommendedPaths(paths);
      }

      setIsLoading(false);
    };

    fetchResults();
  }, [user]);

  return { latestResult, recommendedPaths, isLoading };
};
