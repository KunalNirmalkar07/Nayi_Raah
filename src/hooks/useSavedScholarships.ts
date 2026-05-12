import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useSavedScholarships() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    const fetchSaved = async () => {
      const { data, error } = await supabase
        .from("saved_scholarships")
        .select("scholarship_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setSavedIds(new Set(data.map((r) => r.scholarship_id)));
      }
    };

    fetchSaved();
  }, [user]);

  const toggleSave = useCallback(
    async (scholarshipId: string) => {
      if (!user) {
        toast.error("Please sign in to save scholarships");
        return;
      }

      const isSaved = savedIds.has(scholarshipId);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.delete(scholarshipId);
        else next.add(scholarshipId);
        return next;
      });

      if (isSaved) {
        const { error } = await supabase
          .from("saved_scholarships")
          .delete()
          .eq("user_id", user.id)
          .eq("scholarship_id", scholarshipId);

        if (error) {
          setSavedIds((prev) => new Set([...prev, scholarshipId]));
          toast.error("Failed to unsave scholarship");
        } else {
          toast.success("Scholarship removed from saved");
        }
      } else {
        const { error } = await supabase
          .from("saved_scholarships")
          .insert({ user_id: user.id, scholarship_id: scholarshipId });

        if (error) {
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(scholarshipId);
            return next;
          });
          toast.error("Failed to save scholarship");
        } else {
          toast.success("Scholarship saved!");
        }
      }
    },
    [user, savedIds]
  );

  return { savedIds, toggleSave, loading };
}
