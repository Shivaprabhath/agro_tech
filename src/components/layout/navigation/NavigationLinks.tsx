
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const NavigationLinks = () => {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex items-center gap-1">
      <Link
        to="/marketplace"
        className="py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t('common.marketplace')}
      </Link>
      <Link
        to="/resources"
        className="py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t('common.resources')}
      </Link>
      <Link
        to="/community"
        className="py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t('common.community')}
      </Link>
      <Link
        to="/weather"
        className="py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t('common.weather')}
      </Link>
    </nav>
  );
};

export default NavigationLinks;
