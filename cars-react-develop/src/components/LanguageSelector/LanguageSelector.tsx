import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'bg', name: 'Bulgarian' },
];

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="language-selector">
      <Globe className="language-icon" />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="language-select"
        aria-label={t('selectLanguage')}
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