import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Search from './Search';
import ThemeToggle from './ThemeToggle';
import { LayoutDashboard } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">StockDash</span>
              </Link>
            </div>

            {/* Search Bar - centered or taking available space */}
            <div className="flex-1 max-w-lg mx-4">
              <Search />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
