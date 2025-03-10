import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'bg', name: 'Bulgarian', flag: 'https://flagcdn.com/w40/bg.png' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <div className="custom-select" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={languages.find(lang => lang.code === i18n.language)?.flag}
          alt={i18n.language}
          className="flag-icon"
        />
        <span>{languages.find(lang => lang.code === i18n.language)?.name}</span>
      </div>

      {isOpen && (
        <ul className="language-dropdown">
          {languages.map((language) => (
            <li
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="language-option"
            >
              <img src={language.flag} alt={language.name} className="flag-icon" />
              <span>{language.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
