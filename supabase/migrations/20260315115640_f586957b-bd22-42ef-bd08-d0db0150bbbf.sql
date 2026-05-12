INSERT INTO public.user_roles (user_id, role)
VALUES ('7a63b6f4-3743-44de-a988-1996b5183a26', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;