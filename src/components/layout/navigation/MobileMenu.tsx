
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, onLogout }: MobileMenuProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-2 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <Link
        to="/marketplace"
        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        {t('common.marketplace')}
      </Link>
      <Link
        to="/resources"
        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        {t('common.resources')}
      </Link>
      <Link
        to="/community"
        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        {t('common.community')}
      </Link>
      <Link
        to="/weather"
        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        {t('common.weather')}
      </Link>
      
      {user ? (
        <>
          <Link
            to="/my-products"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.myProducts')}
          </Link>
          <Link
            to="/my-resources"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.myResources')}
          </Link>
          <Link
            to="/requests"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.requests')}
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.profile')}
          </Link>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full justify-center mt-2" 
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            {t('common.logout')}
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.login')}
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {t('common.register')}
          </Link>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
