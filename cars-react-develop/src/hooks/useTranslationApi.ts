import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTranslations } from '../services/translationService';

// Custom hook to handle API-based translations
export const useTranslationApi = () => {
  const { i18n, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const translations = await fetchTranslations(i18n.language);
        
        // Add translations to i18next
        i18n.addResourceBundle(
          i18n.language,
          'translation',
          translations,
          true,
          true
        );
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load translations');
        setIsLoading(false);
        console.error('Error loading translations:', err);
      }
    };
    
    loadTranslations();
  }, [i18n.language, i18n]);

  return {
    t,
    i18n,
    isLoading,
    error
  };
};