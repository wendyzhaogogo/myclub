import React from 'react';
import { useTranslation } from 'react-i18next';

const Resources: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('resourceSharing.title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('resourceSharing.description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('resourceSharing.popular')}</h2>
          <p className="text-gray-600">Popular resources will be displayed here.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('resourceSharing.newest')}</h2>
          <p className="text-gray-600">Newest resources will be displayed here.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('resourceSharing.categories')}</h2>
          <p className="text-gray-600">Resource categories will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Resources; 