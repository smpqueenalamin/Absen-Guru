-- Fix infinite recursion in RLS policies by creating security definer functions
-- First, create a function to get current user's role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage academic years" ON public.academic_years;
DROP POLICY IF EXISTS "Admins can manage all attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can manage positions" ON public.positions;
DROP POLICY IF EXISTS "Admins can manage schedules" ON public.schedules;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

-- Create new policies using the security definer function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage academic years" 
ON public.academic_years 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all attendance" 
ON public.attendance 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all attendance" 
ON public.attendance 
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage locations" 
ON public.locations 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage positions" 
ON public.positions 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage schedules" 
ON public.schedules 
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage settings" 
ON public.settings 
FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Add policies for teachers to read reference data they need
CREATE POLICY "Teachers can view locations" 
ON public.locations 
FOR SELECT
USING (public.get_current_user_role() = 'teacher');

CREATE POLICY "Teachers can view positions" 
ON public.positions 
FOR SELECT
USING (public.get_current_user_role() = 'teacher');

CREATE POLICY "Teachers can view academic years" 
ON public.academic_years 
FOR SELECT
USING (public.get_current_user_role() = 'teacher');

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();