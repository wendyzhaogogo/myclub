import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('app.name')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('app.description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('nav.resources')}</h2>
          <p className="text-gray-600">{t('resourceSharing.description')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('nav.myResources')}</h2>
          <p className="text-gray-600">{t('myResources.description')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('nav.games')}</h2>
          <p className="text-gray-600">{t('games.hanziMatch.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 