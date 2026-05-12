
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: admins can view all roles, users can view their own
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- News/announcements table
CREATE TABLE public.news_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read published news
CREATE POLICY "Anyone can read published news" ON public.news_announcements
  FOR SELECT USING (is_published = true);

-- Admins can do everything with news
CREATE POLICY "Admins can manage news" ON public.news_announcements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Managed scholarships table (admin-managed, supplements hardcoded data)
CREATE TABLE public.managed_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  states TEXT[] NOT NULL DEFAULT '{}',
  education_levels TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.managed_scholarships ENABLE ROW LEVEL SECURITY;

-- Everyone can read active scholarships
CREATE POLICY "Anyone can read active scholarships" ON public.managed_scholarships
  FOR SELECT USING (is_active = true);

-- Admins can manage scholarships
CREATE POLICY "Admins can manage scholarships" ON public.managed_scholarships
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Managed colleges table
CREATE TABLE public.managed_colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  streams TEXT[] NOT NULL DEFAULT '{}',
  exams TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.managed_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active colleges" ON public.managed_colleges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage colleges" ON public.managed_colleges
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on new tables
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.managed_scholarships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.managed_colleges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
