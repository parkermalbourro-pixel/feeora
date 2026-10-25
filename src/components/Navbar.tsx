import React, { useState } from 'react';
import { PageId } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { FeeoraLogo } from './FeeoraLogo';
import {
  Calculator,
  ArrowRightLeft,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenTestingGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'All-In-One', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'paypal', label: 'PayPal', icon: <CreditCard className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'payoneer', label: 'Payoneer', icon: <CreditCard className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'stripe', label: 'Stripe', icon: <CreditCard className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" /> },
    { id: 'compare', label: 'Compare', icon: <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" />, badge: '3-Way' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#191923]/95 backdrop-blur-md border-b border-[#E9E7EF] dark:border-[#333242] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group focus:outline-none focus:ring-2 focus:ring-[#6750D8] rounded-xl p-1 -ml-1 transition-opacity hover:opacity-90"
            aria-label="Feeora Home"
          >
            <FeeoraLogo size="sm" showWordmark={true} />
          </button>

          {/* Desktop Nav Pills */}
          <nav className="hidden md:flex items-center bg-[#FAF9FC] dark:bg-[#11111A] p-1 rounded-xl border border-[#E9E7EF] dark:border-[#333242]">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#191923] text-[#191725] dark:text-[#F7F6FC] shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
                      : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF]'
                          : 'bg-[#E9E7EF] dark:bg-[#333242] text-[#686778] dark:text-[#B5B2C4]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenTestingGuide}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl text-[#6750D8] dark:text-[#B5A5FF] bg-[#F0EDFD] dark:bg-[#262143] hover:bg-[#E4DFFC] dark:hover:bg-[#2F2954] border border-[#6750D8]/15 dark:border-[#B5A5FF]/20 transition-colors"
              title="View verification instructions and free zero-dollar deployment guide"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" />
              <span>Guide & Verify</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`p-2 rounded-xl text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D] transition-colors ${
                currentPage === 'about' ? 'bg-[#FAF9FC] dark:bg-[#21202D] text-[#191725] dark:text-[#F7F6FC]' : ''
              }`}
              title="About Feeora"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#191725] dark:text-[#F7F6FC] bg-[#FAF9FC] dark:bg-[#21202D] border border-[#E9E7EF] dark:border-[#333242] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E9E7EF] dark:border-[#333242] bg-white dark:bg-[#191923] px-4 pt-3 pb-5 space-y-1 shadow-lg transition-colors">
          <p className="text-[10px] font-bold text-[#686778] dark:text-[#7E7B8F] uppercase tracking-wider px-2 mb-1.5">
            Calculators
          </p>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-colors ${
                  isActive
                    ? 'bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF]'
                    : 'text-[#191725] dark:text-[#F7F6FC] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E9E7EF] dark:bg-[#333242] text-[#686778] dark:text-[#B5B2C4]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2.5 mt-2.5 border-t border-[#E9E7EF] dark:border-[#333242] space-y-1">
            <p className="text-[10px] font-bold text-[#686778] dark:text-[#7E7B8F] uppercase tracking-wider px-2 mb-1.5">
              Resources & Legal
            </p>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-[#686778] dark:text-[#B5B2C4] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D] rounded-lg"
            >
              About Feeora
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-[#686778] dark:text-[#B5B2C4] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D] rounded-lg"
            >
              Contact & Rate Feedback
            </button>
            <button
              onClick={() => handleNavClick('privacy')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-[#686778] dark:text-[#B5B2C4] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D] rounded-lg"
            >
              Privacy Policy (Zero Data Tracking)
            </button>
            <button
              onClick={() => handleNavClick('terms')}
              className="w-full text-left px-3 py-2 text-xs font-medium text-[#686778] dark:text-[#B5B2C4] hover:bg-[#FAF9FC] dark:hover:bg-[#21202D] rounded-lg"
            >
              Terms & Legal Disclaimer
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestingGuide();
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-[#6750D8] dark:text-[#B5A5FF] hover:bg-[#F0EDFD] dark:hover:bg-[#262143] rounded-lg flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" />
              <span>Testing & Free Deployment Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
