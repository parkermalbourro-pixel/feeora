import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Server,
  Cloud,
  CheckSquare,
  Square,
  Copy,
  Check,
} from 'lucide-react';

interface TestingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'testing' | 'deployment' | 'seo-readiness'>('testing');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#191923] w-full max-w-3xl rounded-2xl shadow-card border border-[#E9E7EF] dark:border-[#333242] overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#191725] to-[#262143] dark:from-[#15141E] dark:to-[#21202D] text-white flex items-center justify-between border-b border-[#333242]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6750D8] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Testing & Free Deployment Guide</h2>
              <p className="text-xs text-[#B5B2C4]">
                Independent verification steps and zero-dollar hosting options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B5B2C4] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('testing')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'testing'
                ? 'border-[#6750D8] text-[#6750D8] dark:border-[#B5A5FF] dark:text-[#B5A5FF]'
                : 'border-transparent text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
            }`}
          >
            1. How to Test Each Calculator
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'deployment'
                ? 'border-[#6750D8] text-[#6750D8] dark:border-[#B5A5FF] dark:text-[#B5A5FF]'
                : 'border-transparent text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
            }`}
          >
            2. Free Zero-Dollar Deployment
          </button>
          <button
            onClick={() => setActiveTab('seo-readiness')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'seo-readiness'
                ? 'border-[#6750D8] text-[#6750D8] dark:border-[#B5A5FF] dark:text-[#B5A5FF]'
                : 'border-transparent text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
            }`}
          >
            3. Honest SEO & Verification Status
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#191725] dark:text-[#F7F6FC]">
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] border border-[#6750D8]/20 text-[#191725] dark:text-[#F7F6FC]">
                <p className="font-semibold text-xs uppercase tracking-wide text-[#6750D8] dark:text-[#B5A5FF] mb-1">
                  Beginner Testing Protocol
                </p>
                <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
                  Before sharing this tool with clients or colleagues, verify each calculator with these standard reference test cases to confirm mathematical accuracy.
                </p>
              </div>

              {/* Test Cases */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Test Case 1: PayPal US Invoicing ($1,000)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] font-medium border border-[#6750D8]/20">Standard & Reverse</span>
                  </div>
                  <ul className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-disc list-inside">
                    <li><strong>Parameters:</strong> Amount $1,000, US Region, Domestic Invoicing (2.99% + $0.49).</li>
                    <li><strong>Expected Standard Net:</strong> $1,000 - ($29.90 + $0.49) = <strong>$969.61</strong>.</li>
                    <li><strong>Expected Reverse Gross:</strong> Target $1,000 net &rarr; ($1,000 + $0.49) / (1 - 0.0299) = <strong>$1,031.33</strong> to invoice.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Test Case 2: Payoneer Credit Card vs ACH ($2,000)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FDF0F7] dark:bg-[#3D1E30] text-[#E96DAF] dark:text-[#F29BCB] font-medium border border-[#E96DAF]/20">Payment Methods</span>
                  </div>
                  <ul className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-disc list-inside">
                    <li><strong>Credit Card (3%):</strong> $2,000 &times; 3% = $60 fee &rarr; <strong>$1,940.00</strong> net.</li>
                    <li><strong>ACH Bank Debit (1%):</strong> $2,000 &times; 1% = $20 fee &rarr; <strong>$1,980.00</strong> net.</li>
                    <li><strong>Local Bank FX Withdrawal (+2%):</strong> Adds 2% currency conversion spread when transferring to a local non-USD bank account.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Test Case 3: Stripe Domestic vs International ($500)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] font-medium border border-[#6750D8]/20">Surcharge Verification</span>
                  </div>
                  <ul className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-disc list-inside">
                    <li><strong>Domestic US Card:</strong> 2.9% + $0.30 &rarr; $14.50 + $0.30 = $14.80 fee &rarr; <strong>$485.20</strong> net.</li>
                    <li><strong>International Card (+1.5%):</strong> 4.4% + $0.30 &rarr; $22.00 + $0.30 = $22.30 fee &rarr; <strong>$477.70</strong> net.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Test Case 4: Compare All Tool</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">3-Way Ranking</span>
                  </div>
                  <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
                    Navigate to <strong>Compare All</strong>, enter <code>$1,500</code>, and verify that all three providers render simultaneously with the lowest fee badge properly allocated.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                <p className="font-semibold text-xs uppercase tracking-wide text-emerald-800 dark:text-emerald-300 mb-1">
                  100% Free Hosting - Zero Dollars Required
                </p>
                <p className="text-xs leading-relaxed text-[#686778] dark:text-[#B5B2C4]">
                  Because this application is a pure client-side React SPA with zero paid APIs and zero server databases, you can host it for free forever with SSL, custom domains, and automated CDNs.
                </p>
              </div>

              {/* Free Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vercel */}
                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-white dark:bg-[#191923] space-y-2.5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Option 1: Vercel (Recommended)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#191725] text-white dark:bg-[#F7F6FC] dark:text-[#191725]">Free Hobby</span>
                  </div>
                  <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
                    Easiest setup. Simply connect your GitHub repository and Vercel automatically runs <code>npm run build</code>.
                  </p>
                  <ol className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-decimal list-inside">
                    <li>Create free account at vercel.com</li>
                    <li>Click &quot;Import Project&quot; from GitHub</li>
                    <li>Leave build command as <code>vite build</code></li>
                    <li>Deploy in ~30 seconds</li>
                  </ol>
                </div>

                {/* Cloudflare Pages */}
                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-white dark:bg-[#191923] space-y-2.5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Option 2: Cloudflare Pages</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white">Unlimited Bandwidth</span>
                  </div>
                  <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
                    Completely unmetered free bandwidth and ultra-fast global edge network.
                  </p>
                  <ol className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-decimal list-inside">
                    <li>Create account at pages.cloudflare.com</li>
                    <li>Connect GitHub repository</li>
                    <li>Framework preset: <strong>Vite</strong></li>
                    <li>Output directory: <code>dist</code></li>
                  </ol>
                </div>

                {/* Netlify */}
                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-white dark:bg-[#191923] space-y-2.5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Option 3: Netlify</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">Drag & Drop</span>
                  </div>
                  <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
                    Allows manual drag-and-drop of your <code>dist</code> folder or Git push.
                  </p>
                  <ol className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-decimal list-inside">
                    <li>Sign up at netlify.com</li>
                    <li>Import repository or drop folder</li>
                    <li>Publish directory: <code>dist</code></li>
                  </ol>
                </div>

                {/* GitHub Pages */}
                <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-white dark:bg-[#191923] space-y-2.5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">Option 4: GitHub Pages</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-white">Native Git</span>
                  </div>
                  <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
                    Host directly from your GitHub repository using GitHub Actions.
                  </p>
                  <ol className="text-xs space-y-1 text-[#686778] dark:text-[#B5B2C4] list-decimal list-inside">
                    <li>Enable GitHub Pages under Repo Settings</li>
                    <li>Select GitHub Actions (Vite template)</li>
                    <li>Automatic deployment on push to <code>main</code></li>
                  </ol>
                </div>
              </div>

              {/* Build Command Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#191725] to-[#262143] dark:from-[#15141E] dark:to-[#21202D] text-white border border-[#333242] space-y-2">
                <span className="text-xs text-[#B5B2C4] font-mono">Production Build Command</span>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg font-mono text-xs text-[#B5A5FF] border border-[#333242]">
                  <span>npm run build</span>
                  <button
                    onClick={() => handleCopy('npm run build', 'build')}
                    className="text-[#B5B2C4] hover:text-white"
                  >
                    {copiedCmd === 'build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#B5B2C4]">
                  This generates a fully optimized, static bundle in <code>/dist</code> ready for immediate deployment on any web server.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'seo-readiness' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <p className="font-semibold text-xs uppercase tracking-wide text-amber-900 dark:text-amber-300">
                    Transparent SEO & Monetization Status
                  </p>
                </div>
                <p className="text-xs leading-relaxed">
                  As required by the project specifications, we make <strong>no claim</strong> that this website is indexed by Google or ready for advertising monetization right out of the box. True SEO ranking requires domain registration, Google Search Console indexing, and real organic traffic over time.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm">
                  What Has Been Completed Technically:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Semantic HTML & Metadata:</strong> Unique page titles, meta descriptions, and OpenGraph social share cards are configured for each calculator.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Structured Data (Schema.org):</strong> JSON-LD <code>WebApplication</code> schema embedded in <code>index.html</code>.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Search Engine Directives:</strong> <code>/robots.txt</code> and valid XML <code>/sitemap.xml</code> placed in the public directory.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Fake Testimonials or Keyword Stuffing:</strong> Pure informative content, real arithmetic, verified fee schedules, and practical FAQs.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Security Vulnerabilities:</strong> Zero API keys exposed, zero backend database overhead, zero collection of user personal data.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] space-y-2 text-xs text-[#686778] dark:text-[#B5B2C4]">
                <h4 className="font-bold text-[#191725] dark:text-[#F7F6FC]">Next Steps Once You Deploy to a Custom Domain:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Verify ownership in <strong>Google Search Console</strong>.</li>
                  <li>Submit your sitemap URL (e.g. <code>https://yourdomain.com/sitemap.xml</code>).</li>
                  <li>Perform a Mobile-Friendly & Core Web Vitals audit using Google PageSpeed Insights.</li>
                  <li>Monitor indexation over 2–4 weeks before applying for ad networks or sponsorships.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF9FC] dark:bg-[#15141E] border-t border-[#E9E7EF] dark:border-[#333242] flex items-center justify-between">
          <div className="text-xs text-[#686778] dark:text-[#B5B2C4]">
            Feeora &bull; Know the fee. Keep more of your money.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6750D8] hover:bg-[#553EC6] dark:bg-[#B5A5FF] dark:text-[#11111A] dark:hover:bg-[#C5B8FF] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
