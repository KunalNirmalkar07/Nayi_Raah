CREATE TABLE public.saved_scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scholarship_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, scholarship_id)
);

ALTER TABLE public.saved_scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved scholarships"
ON public.saved_scholarships FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can save scholarships"
ON public.saved_scholarships FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave scholarships"
ON public.saved_scholarships FOR DELETE TO authenticated
USING (auth.uid() = user_id);