import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  const languages = [
    { code: 'zh', name: t('common.chinese'), flag: '🇨🇳' },
    { code: 'vi', name: t('common.vietnamese'), flag: '🇻🇳' },
    { code: 'en', name: t('common.english'), flag: '🇬🇧' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                {t('app.name')}
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive('/')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/resources"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive('/resources')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('nav.resources')}
              </Link>
              <Link
                to="/my-resources"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive('/my-resources')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('nav.myResources')}
              </Link>
              <Link
                to="/games"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive('/games')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('nav.games')}
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <span>{t('common.language')}</span>
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    isLanguageOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-200 ${
                          i18n.language === lang.code
                            ? 'bg-gray-50 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {i18n.language === lang.code && (
                          <svg
                            className="ml-auto h-4 w-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
              isActive('/')
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/resources"
            className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
              isActive('/resources')
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {t('nav.resources')}
          </Link>
          <Link
            to="/my-resources"
            className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
              isActive('/my-resources')
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {t('nav.myResources')}
          </Link>
          <Link
            to="/games"
            className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
              isActive('/games')
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {t('nav.games')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 