/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TestingGuideModal } from './components/TestingGuideModal';

import { HomePage } from './pages/HomePage';
import { PayPalPage } from './pages/PayPalPage';
import { PayoneerPage } from './pages/PayoneerPage';
import { StripePage } from './pages/StripePage';
import { ComparePage } from './pages/ComparePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

const PAGE_SEO: Record<PageId, { title: string; description: string }> = {
  home: {
    title: 'Feeora - International Payment Fee Calculator | Know the Fee',
    description: 'Calculate international transaction fees and reverse net payouts for PayPal, Payoneer, and Stripe. Know the fee. Keep more of your money.',
  },
  paypal: {
    title: 'PayPal Fee Calculator - Feeora',
    description: 'Calculate PayPal standard merchant fees, international cross-border surcharges, FX conversion spreads, and reverse gross invoice totals with Feeora.',
  },
  payoneer: {
    title: 'Payoneer Fee Calculator - Feeora',
    description: 'Calculate Payoneer receiving fees (credit card, ACH, Global Payment Service) and local bank withdrawal FX margins for remote freelancers with Feeora.',
  },
  stripe: {
    title: 'Stripe Fee Calculator - Feeora',
    description: 'Calculate Stripe card processing fees, international card surcharges, currency conversion spreads, and reverse gross-up amounts with Feeora.',
  },
  compare: {
    title: 'Compare Payment Fees - PayPal vs Payoneer vs Stripe | Feeora',
    description: 'Compare payment processing fees side-by-side for international invoices. Find the lowest fees for cards, bank transfers, and payouts on Feeora.',
  },
  about: {
    title: 'About Feeora - Transparent Payment Fee Intelligence',
    description: 'Learn why Feeora was built, how we verify official fee schedules without paid APIs or trackers, and our mission to help you keep more of your money.',
  },
  contact: {
    title: 'Contact Feeora - Rate Updates & Feedback',
    description: 'Report fee schedule changes, suggest new payment gateways, or submit feedback to the Feeora team.',
  },
  privacy: {
    title: 'Privacy Policy - Feeora',
    description: 'Feeora stores zero personal information, tracks no cookies, and computes all calculations securely inside your browser memory.',
  },
  terms: {
    title: 'Terms of Use & Payment Fee Disclaimer - Feeora',
    description: 'Independent estimation terms, trademark disclaimers for PayPal, Payoneer, and Stripe, and limitation of financial liability.',
  },
};

function AppContent() {
  const getInitialPage = (): PageId => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageId;
      if (pageParam && PAGE_SEO[pageParam]) return pageParam;

      const hash = window.location.hash.replace('#', '') as PageId;
      if (hash && PAGE_SEO[hash]) return hash;
    } catch {
      // Fallback
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [testingGuideOpen, setTestingGuideOpen] = useState<boolean>(false);

  // Synchronize SEO titles, meta descriptions, and browser URL history
  useEffect(() => {
    const seo = PAGE_SEO[currentPage] || PAGE_SEO.home;
    document.title = seo.title;

    // Update meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Update URL query string without reloading
    try {
      const url = new URL(window.location.href);
      if (currentPage === 'home') {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', currentPage);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore if in restricted iframe
    }
  }, [currentPage]);

  // Listen to popstate (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FC] dark:bg-[#11111A] text-[#191725] dark:text-[#F7F6FC] transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenTestingGuide={() => setTestingGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenTestingGuide={() => setTestingGuideOpen(true)}
          />
        )}
        {currentPage === 'paypal' && <PayPalPage onNavigate={handleNavigate} />}
        {currentPage === 'payoneer' && <PayoneerPage onNavigate={handleNavigate} />}
        {currentPage === 'stripe' && <StripePage onNavigate={handleNavigate} />}
        {currentPage === 'compare' && <ComparePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenTestingGuide={() => setTestingGuideOpen(true)}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onOpenTestingGuide={() => setTestingGuideOpen(true)}
          />
        )}
        {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
        {currentPage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
      </main>

      {/* Testing & Free Deployment Guide Modal */}
      <TestingGuideModal
        isOpen={testingGuideOpen}
        onClose={() => setTestingGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTestingGuide={() => setTestingGuideOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
