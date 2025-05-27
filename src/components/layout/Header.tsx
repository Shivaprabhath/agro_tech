
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NavigationLinks from "./navigation/NavigationLinks";
import UserMenu from "./navigation/UserMenu";
import MobileMenu from "./navigation/MobileMenu";

const Header = () => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img
                src="/placeholder.svg"
                alt="Crop Exchange"
                className="h-8 w-8 mr-2"
              />
              <span className="font-display text-xl font-bold text-primary hidden sm:inline">
                CropExchange
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationLinks />

          {/* User Actions / Auth Buttons */}
          <UserMenu />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
