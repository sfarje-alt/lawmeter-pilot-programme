-- Allow anyone to insert peru sessions (for sync functionality)
CREATE POLICY "Anyone can insert peru sessions" 
ON public.peru_sessions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update peru sessions (for upsert functionality)
CREATE POLICY "Anyone can update peru sessions" 
ON public.peru_sessions 
FOR UPDATE 
USING (true);