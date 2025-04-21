import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-5 h-5 text-white" />
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="bg-purple-700 text-white border-none focus:ring-2 focus:ring-purple-400 rounded"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="ta">தமிழ்</option>
        <option value="te">తెలుగు</option>
        <option value="gu">ગુજરાતી</option>
      </select>
    </div>
  );
};

export default LanguageSelector;