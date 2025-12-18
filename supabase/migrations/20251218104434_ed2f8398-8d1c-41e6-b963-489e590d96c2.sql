-- Allow anyone to delete peru sessions (for clear all functionality)
CREATE POLICY "Anyone can delete peru sessions" 
ON public.peru_sessions 
FOR DELETE 
USING (true);