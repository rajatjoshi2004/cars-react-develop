// 
import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' }
];

const LanguageSelector: React.FC = () => {
//   const { i18n, t } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.target.value;
    // i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* <Globe className="h-5 w-5 text-white" /> */}
      <select
        // value={i18n.language}
        onChange={changeLanguage}
        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={('selectLanguage')}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;