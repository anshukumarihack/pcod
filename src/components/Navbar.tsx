import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-6 h-6" />
          <span className="text-xl font-bold">PCOD Care</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-200">{t('nav.home')}</Link>
          <Link to="/resources" className="hover:text-purple-200">{t('nav.resources')}</Link>
          <Link to="/chat" className="hover:text-purple-200">{t('nav.chat')}</Link>
          <Link to="/contact" className="hover:text-purple-200">{t('nav.contact')}</Link>
          <Link to="/profile" className="hover:text-purple-200">
            <User className="w-5 h-5" />
          </Link>
          <LanguageSelector />
          <button onClick={handleLogout} className="hover:text-purple-200">{t('nav.logout')}</button>
        </div>
      </div>
    </nav>
  );
}