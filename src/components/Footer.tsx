import React from 'react';
import { PageId } from '../types';
import { FeeoraLogo } from './FeeoraLogo';
import {
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTestingGuide }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#15141E] text-[#686778] dark:text-[#B5B2C4] border-t border-[#E9E7EF] dark:border-[#333242] mt-16 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <button
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none"
            >
              <FeeoraLogo size="sm" showWordmark={true} />
            </button>
            <p className="text-xs font-medium text-[#191725] dark:text-[#F7F6FC]">
              Know the fee. Keep more of your money.
            </p>
            <p className="text-xs leading-relaxed text-[#686778] dark:text-[#B5B2C4]">
              A free, independent payment fee calculator for international freelancers, agencies, and online sellers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9FC] dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Zero tracking &bull; 100% In-Browser</span>
            </div>
          </div>

          {/* Calculators Column */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-[#191725] dark:text-[#F7F6FC] uppercase">
              Calculators
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('paypal')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  PayPal Fee Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('payoneer')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  Payoneer Fee Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('stripe')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  Stripe Fee Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('compare')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors flex items-center gap-1.5"
                >
                  <span>Compare All 3 Providers</span>
                  <span className="text-[9px] bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] px-1.5 py-0.2 rounded font-bold">Side-by-side</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-[#191725] dark:text-[#F7F6FC] uppercase">
              Resources
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  About Feeora
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  Contact & Fee Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTestingGuide}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#6750D8] dark:text-[#B5A5FF]" />
                  <span>Testing & Free Deploy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-[#191725] dark:text-[#F7F6FC] uppercase">
              Legal & Disclaimers
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-[#6750D8] dark:hover:text-[#B5A5FF] transition-colors"
                >
                  Terms & Fee Disclaimer
                </button>
              </li>
            </ul>
            <p className="text-[10px] text-[#9593A5] dark:text-[#7E7B8F] pt-1 leading-normal">
              Feeora is independent and not affiliated with PayPal, Payoneer, or Stripe. All trademarks belong to their respective owners.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 pt-6 border-t border-[#E9E7EF] dark:border-[#333242] text-xs text-[#9593A5] dark:text-[#7E7B8F] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} Feeora. Know the fee. Keep more of your money.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Rates verified Q1 2025</span>
            <span>&bull;</span>
            <button
              onClick={() => handleNav('terms')}
              className="hover:underline"
            >
              Independent Fee Estimates
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
