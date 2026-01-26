-- Update handle_new_user() function to include client_id from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type, client_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::app_role, 'user'),
    -- Store client_id from metadata as UUID if it's a valid UUID, otherwise null
    CASE 
      WHEN NEW.raw_user_meta_data->>'client_id' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'client_id' ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      THEN (NEW.raw_user_meta_data->>'client_id')::uuid
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$function$;