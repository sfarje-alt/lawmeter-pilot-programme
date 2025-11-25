import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateToEnglish = async (spanishText: string): Promise<string> => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { text: spanishText }
      });

      if (error) throw error;
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  return { translateToEnglish, isTranslating };
}
