
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User } from "lucide-react";
import WeatherAlerts from "@/components/weather/WeatherAlerts";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <LanguageSelector />
      {user ? (
        <>
          <WeatherAlerts />
          <Link
            to="/my-products"
            className="hidden md:block py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.myProducts')}
          </Link>
          <Link
            to="/my-resources"
            className="hidden md:block py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.myResources')}
          </Link>
          <Link
            to="/requests"
            className="hidden md:block py-2 px-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.requests')}
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            {t('common.logout')}
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/login">
            <Button variant="secondary" size="sm">
              {t('common.login')}
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" size="sm">
              {t('common.register')}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default UserMenu;
