import React, { useState } from 'react';
import { PageId, CalculationMode, ProviderId } from '../types';
import {
  calculatePayPal,
  calculatePayoneer,
  calculateStripe,
  formatCurrency,
} from '../utils/calculator';
import {
  SUPPORTED_REGIONS,
  SUPPORTED_CURRENCIES,
} from '../data/feeRules';
import { FeeBreakdownCard } from '../components/FeeBreakdownCard';
import { ModeSelector } from '../components/ModeSelector';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  CreditCard,
  Building2,
  DollarSign,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenTestingGuide }) => {
  // Master Calculator State
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('paypal');
  const [amount, setAmount] = useState<number>(1000);
  const [mode, setMode] = useState<CalculationMode>('standard');
  const [regionCode, setRegionCode] = useState<string>('US');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');

  // PayPal options
  const [paypalType, setPaypalType] = useState<'invoicing' | 'checkout' | 'qr_code'>('invoicing');
  const [paypalCrossBorder, setPaypalCrossBorder] = useState<boolean>(true);
  const [paypalFxSpread, setPaypalFxSpread] = useState<boolean>(false);

  // Payoneer options
  const [payoneerReceiving, setPayoneerReceiving] = useState<'credit_card' | 'ach_debit' | 'receiving_accounts' | 'payoneer_to_payoneer'>('credit_card');
  const [payoneerWithdrawal, setPayoneerWithdrawal] = useState<'none' | 'bank_fx' | 'bank_same_currency'>('bank_fx');

  // Stripe options
  const [stripeInternational, setStripeInternational] = useState<boolean>(true);
  const [stripeFxSpread, setStripeFxSpread] = useState<boolean>(false);
  const [stripeInvoicingPlus, setStripeInvoicingPlus] = useState<boolean>(false);

  // Presets
  const presets = [250, 500, 1000, 2500, 5000];

  // Live calculation results
  const paypalResult = calculatePayPal({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    transactionType: paypalType,
    isInternational: paypalCrossBorder,
    hasCurrencyConversion: paypalFxSpread,
  });

  const payoneerResult = calculatePayoneer({
    amount: amount || 0,
    mode,
    currencyCode,
    receivingMethod: payoneerReceiving,
    withdrawalMethod: payoneerWithdrawal,
  });

  const stripeResult = calculateStripe({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    isInternationalCard: stripeInternational,
    hasCurrencyConversion: stripeFxSpread,
    isInvoicingPlus: stripeInvoicingPlus,
  });

  const activeResult =
    selectedProvider === 'paypal'
      ? paypalResult
      : selectedProvider === 'payoneer'
      ? payoneerResult
      : stripeResult;

  const activeProviderName =
    selectedProvider === 'paypal'
      ? 'PayPal'
      : selectedProvider === 'payoneer'
      ? 'Payoneer'
      : 'Stripe';

  const handleRegionChange = (newRegion: string) => {
    setRegionCode(newRegion);
    const regionObj = SUPPORTED_REGIONS.find((r) => r.code === newRegion);
    if (regionObj && regionObj.currency) {
      setCurrencyCode(regionObj.currency);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 transition-colors duration-200">
      {/* 4. HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] border border-[#6750D8]/15 dark:border-[#B5A5FF]/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" />
          <span>Independent &bull; Verified Fee Schedules &bull; Zero Tracking</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight leading-tight">
          Know the fee.{' '}
          <span className="text-[#6750D8] dark:text-[#B5A5FF]">Keep more of your money.</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#686778] dark:text-[#B5B2C4] max-w-xl mx-auto leading-relaxed">
          Feeora calculates exact international transaction deductions and reverse gross-up amounts across PayPal, Payoneer, and Stripe for freelancers, agencies, and businesses.
        </p>
      </section>

      {/* 5. MAKE THE CALCULATOR THE MAIN FOCUS */}
      <section className="scroll-mt-20" id="calculator">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-5 sm:p-7 space-y-5 shadow-card transition-colors">
            {/* Step 1: Provider Selector Tabs */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] mb-2">
                1. Select Payment Provider
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF9FC] dark:bg-[#11111A] border border-[#E9E7EF] dark:border-[#333242]">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('paypal')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                    selectedProvider === 'paypal'
                      ? 'bg-white dark:bg-[#191923] text-blue-600 dark:text-blue-400 shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
                      : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('payoneer')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                    selectedProvider === 'payoneer'
                      ? 'bg-white dark:bg-[#191923] text-amber-600 dark:text-amber-400 shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
                      : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Payoneer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider('stripe')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                    selectedProvider === 'stripe'
                      ? 'bg-white dark:bg-[#191923] text-[#6750D8] dark:text-[#B5A5FF] shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
                      : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" />
                  <span>Stripe</span>
                </button>
              </div>
            </div>

            {/* Step 2: Calculation Mode (Standard vs Reverse) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] mb-1.5">
                2. Calculation Goal
              </label>
              <ModeSelector mode={mode} onChange={setMode} />
            </div>

            {/* Step 3: Transaction Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4]">
                  3. {mode === 'standard' ? 'Gross Invoice Amount' : 'Target Net Payout Desired'}
                </label>
                <span className="text-[11px] text-[#9593A5] dark:text-[#7E7B8F]">
                  {mode === 'standard' ? 'What client sends' : 'What you want to receive'}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#9593A5] dark:text-[#7E7B8F] font-mono">
                  {activeResult.currencySymbol}
                </span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] rounded-xl font-mono text-lg font-bold text-[#191725] dark:text-[#F7F6FC] focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#9593A5] dark:text-[#7E7B8F] mr-1">Quick Presets:</span>
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border font-mono font-medium transition-colors ${
                      amount === p
                        ? 'bg-[#F0EDFD] dark:bg-[#262143] border-[#6750D8]/40 dark:border-[#B5A5FF]/40 text-[#6750D8] dark:text-[#B5A5FF] font-bold'
                        : 'bg-[#FAF9FC] dark:bg-[#15141E] border-[#E9E7EF] dark:border-[#333242] text-[#686778] dark:text-[#B5B2C4] hover:bg-[#F4F2F8]'
                    }`}
                  >
                    ${p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Region & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
                  Receiving Country / Region
                </label>
                <select
                  value={regionCode}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-xs font-semibold text-[#191725] dark:text-[#F7F6FC] bg-white dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8]"
                >
                  {SUPPORTED_REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.flag} {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
                  Currency
                </label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-xs font-semibold text-[#191725] dark:text-[#F7F6FC] bg-white dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8]"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Provider-specific Options */}
            {selectedProvider === 'paypal' && (
              <div className="space-y-3 pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
                <div>
                  <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
                    PayPal Transaction Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaypalType('invoicing')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        paypalType === 'invoicing'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">Invoicing</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">2.99% + fixed</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaypalType('checkout')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        paypalType === 'checkout'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">Checkout</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">3.49% + fixed</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaypalType('qr_code')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        paypalType === 'qr_code'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">QR Code</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">1.90% + fixed</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paypalCrossBorder}
                      onChange={(e) => setPaypalCrossBorder(e.target.checked)}
                      className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                        International Payment (Cross-border surcharge +1.50%)
                      </span>
                      <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                        Client pays from a different country
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paypalFxSpread}
                      onChange={(e) => setPaypalFxSpread(e.target.checked)}
                      className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                        Currency Conversion Spread (+3.50%)
                      </span>
                      <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                        Client pays in a different currency
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {selectedProvider === 'payoneer' && (
              <div className="space-y-3 pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
                <div>
                  <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
                    How will the client pay?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoneerReceiving('credit_card')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        payoneerReceiving === 'credit_card'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">Credit Card (3.0%)</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">Card invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoneerReceiving('ach_debit')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        payoneerReceiving === 'ach_debit'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">ACH Debit (1.0%)</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">US direct bank debit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoneerReceiving('receiving_accounts')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        payoneerReceiving === 'receiving_accounts'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">Receiving Accounts</span>
                      <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">0% - 1% local wire</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoneerReceiving('payoneer_to_payoneer')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        payoneerReceiving === 'payoneer_to_payoneer'
                          ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                          : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                      }`}
                    >
                      <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">Payoneer-to-Payoneer</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">0.0% Free</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
                    Local Bank Withdrawal
                  </label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                      <input
                        type="radio"
                        name="payoneer_withdrawal"
                        checked={payoneerWithdrawal === 'bank_fx'}
                        onChange={() => setPayoneerWithdrawal('bank_fx')}
                        className="text-[#6750D8]"
                      />
                      <span className="text-[#191725] dark:text-[#F7F6FC]">Withdraw to Local Currency (with FX spread up to 2.0%)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2 rounded-lg border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                      <input
                        type="radio"
                        name="payoneer_withdrawal"
                        checked={payoneerWithdrawal === 'bank_same_currency'}
                        onChange={() => setPayoneerWithdrawal('bank_same_currency')}
                        className="text-[#6750D8]"
                      />
                      <span className="text-[#191725] dark:text-[#F7F6FC]">Same-Currency Bank Transfer ($1.50 flat)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === 'stripe' && (
              <div className="space-y-2 pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripeInternational}
                    onChange={(e) => setStripeInternational(e.target.checked)}
                    className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                      International Card Surcharge (+1.50%)
                    </span>
                    <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                      Card issued outside your merchant country
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripeFxSpread}
                    onChange={(e) => setStripeFxSpread(e.target.checked)}
                    className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                      Currency Conversion (+1.00% to +2.00%)
                    </span>
                    <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                      Settlement currency differs from invoice currency
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripeInvoicingPlus}
                    onChange={(e) => setStripeInvoicingPlus(e.target.checked)}
                    className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                      Stripe Invoicing Plus (+0.40%)
                    </span>
                    <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                      Advanced automated invoicing add-on
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-5 sticky top-20">
            <FeeBreakdownCard result={activeResult} providerDisplayName={activeProviderName} />

            {/* Quick Compare Callout */}
            <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] flex items-center justify-between text-xs transition-colors">
              <span className="text-[#686778] dark:text-[#B5B2C4]">Want to compare all 3 gateways?</span>
              <button
                type="button"
                onClick={() => onNavigate('compare')}
                className="text-[#6750D8] dark:text-[#B5A5FF] font-bold hover:underline flex items-center gap-1"
              >
                <span>3-Way Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ADS AND FUTURE MONETIZATION - Clean reserved container */}
      <div className="w-full text-center py-2">
        <div className="inline-block px-4 py-2 rounded-xl border border-dashed border-[#E9E7EF] dark:border-[#333242] text-[10px] text-[#9593A5] dark:text-[#7E7B8F] uppercase tracking-wider">
          Independent Calculator &bull; Zero External Tracking
        </div>
      </div>

      {/* 8. SIMPLIFIED CONTENT SECTIONS AFTER CALCULATOR */}

      {/* A. A SHORT FEE EXPLANATION */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-4 shadow-soft transition-colors">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] uppercase tracking-wider">
            Fee Structure Basics
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
            The 3 Layers of International Transaction Deductions
          </h2>
          <p className="text-xs sm:text-sm text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            When accepting global payments, processors rarely charge just a single flat fee. Deductions are typically split across three transparent tiers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5">
            <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF]">1. Base Merchant Fee</span>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
              Standard processing fee per payment (e.g. 2.9% + fixed charge on Stripe, or 2.99% + $0.49 on PayPal).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5">
            <span className="text-xs font-bold text-[#E96DAF] dark:text-[#F29BCB]">2. Cross-Border Surcharge</span>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
              An extra +1.50% to +2.00% assessed whenever the client&apos;s bank is outside your merchant account country.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">3. Foreign Exchange (FX) Spread</span>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
              A 1.5% to 4.0% margin applied when converting incoming foreign currency into your local bank deposit.
            </p>
          </div>
        </div>
      </section>

      {/* B. PRACTICAL WORKED EXAMPLE */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-4 shadow-soft transition-colors">
        <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] uppercase tracking-wider">
          Worked Example
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
          Step-by-Step: Billing an Overseas Client $1,200 USD
        </h2>
        <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-xs text-[#191725] dark:text-[#F7F6FC] space-y-2 leading-relaxed">
          <p className="text-[#686778] dark:text-[#B5B2C4]">
            <strong>Scenario:</strong> You are a US creator invoicing a European client <strong>$1,200.00 USD</strong> using PayPal Commercial Invoicing.
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#686778] dark:text-[#B5B2C4]">
            <li><strong>Base Invoicing Fee:</strong> 2.99% &times; $1,200.00 = $35.88</li>
            <li><strong>Fixed Transaction Fee:</strong> $0.49</li>
            <li><strong>Cross-Border Surcharge:</strong> +1.50% &times; $1,200.00 = $18.00</li>
            <li><strong>Total Deductions:</strong> $35.88 + $0.49 + $18.00 = <strong className="text-rose-600 dark:text-rose-400">$54.37 USD</strong> (4.53% effective fee)</li>
            <li><strong>Net In Your Pocket:</strong> $1,200.00 - $54.37 = <strong className="text-emerald-600 dark:text-emerald-400">$1,145.63 USD</strong></li>
          </ul>
        </div>
      </section>

      {/* C. SIMPLE EXPLANATION OF CALCULATION FORMULA */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-4 shadow-soft transition-colors">
        <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] uppercase tracking-wider">
          Calculation Formula
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
          How Standard and Reverse Gross-Up Math Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-2">
            <span className="font-bold text-[#191725] dark:text-[#F7F6FC] block">Standard Calculation:</span>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] font-mono text-[11px] text-[#6750D8] dark:text-[#B5A5FF]">
              Net = Gross - (Gross &times; TotalRate) - FixedFee
            </div>
            <p className="text-[#686778] dark:text-[#B5B2C4]">
              Used when you already know the invoice amount and want to calculate what remains after processor deductions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-2">
            <span className="font-bold text-[#191725] dark:text-[#F7F6FC] block">Reverse (Gross-Up) Calculation:</span>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] font-mono text-[11px] text-[#E96DAF] dark:text-[#F29BCB]">
              Gross = (TargetNet + FixedFee) &divide; (1 - TotalRate)
            </div>
            <p className="text-[#686778] dark:text-[#B5B2C4]">
              Used when you need an exact target in your bank (e.g. $1,000 net) and need to invoice a higher amount so fees don&apos;t shortchange you.
            </p>
          </div>
        </div>
      </section>

      {/* D. COMPARISON SECTION FOR SUPPORTED PROVIDERS */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-4 shadow-soft transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] uppercase tracking-wider">
              Provider Comparison
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
              Quick Gateway Comparison on a $1,000 Payment
            </h2>
          </div>
          <button
            onClick={() => onNavigate('compare')}
            className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] hover:underline"
          >
            Open 3-Way Tool &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9FC] dark:bg-[#15141E] text-[#191725] dark:text-[#F7F6FC] border-y border-[#E9E7EF] dark:border-[#333242] font-semibold">
                <th className="p-3">Gateway</th>
                <th className="p-3">Domestic Card</th>
                <th className="p-3">Cross-Border Card</th>
                <th className="p-3">Total Fee ($1k)</th>
                <th className="p-3">Net Payout ($1k)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7EF] dark:divide-[#333242] text-[#686778] dark:text-[#B5B2C4]">
              <tr>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">PayPal</td>
                <td className="p-3">2.99% + $0.49</td>
                <td className="p-3">4.49% + $0.49</td>
                <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">$45.39</td>
                <td className="p-3 font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">$954.61</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">Payoneer</td>
                <td className="p-3">3.00% (Card) / 1% (ACH)</td>
                <td className="p-3">3.00% + withdrawal FX</td>
                <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">$30.00 - $49.40</td>
                <td className="p-3 font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">$950.60 - $970.00</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#6750D8] dark:text-[#B5A5FF]">Stripe</td>
                <td className="p-3">2.90% + $0.30</td>
                <td className="p-3">4.40% + $0.30</td>
                <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">$44.30</td>
                <td className="p-3 font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">$955.70</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* E. RELEVANT FAQS */}
      <section className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#6750D8] dark:text-[#B5A5FF] uppercase tracking-wider">
            Questions & Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5 shadow-2xs">
            <h3 className="font-bold text-xs sm:text-sm text-[#191725] dark:text-[#F7F6FC]">
              Are these official quotes from PayPal, Payoneer, or Stripe?
            </h3>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
              No. Feeora is an independent educational tool. We do not process transactions or earn affiliate commissions. All calculations are accurate mathematical estimates based strictly on publicly published standard merchant fee tables as of Q1 2025.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5 shadow-2xs">
            <h3 className="font-bold text-xs sm:text-sm text-[#191725] dark:text-[#F7F6FC]">
              How can I reduce international payment processing fees?
            </h3>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
              Common methods include: 1) Asking business clients to pay via ACH or local bank wire; 2) Using multi-currency receiving accounts (like Payoneer Global Payment Service) to receive local currencies without immediate conversion; 3) Consolidating milestones to avoid repeated per-transaction fixed fees.
            </p>
          </div>
        </div>
      </section>

      {/* F. RELATED CALCULATOR LINKS */}
      <section className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] mb-3">
          Dedicated Calculator Pages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('paypal')}
            className="p-3 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] hover:border-[#6750D8] dark:hover:border-[#B5A5FF] text-left transition-all group"
          >
            <span className="text-xs font-bold text-[#191725] dark:text-[#F7F6FC] group-hover:text-[#6750D8] dark:group-hover:text-[#B5A5FF] block">
              PayPal Calculator &rarr;
            </span>
            <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
              Commercial & QR fees
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('payoneer')}
            className="p-3 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] hover:border-amber-500 text-left transition-all group"
          >
            <span className="text-xs font-bold text-[#191725] dark:text-[#F7F6FC] group-hover:text-amber-600 text-left block">
              Payoneer Calculator &rarr;
            </span>
            <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
              Contractor & bank FX
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('stripe')}
            className="p-3 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] hover:border-[#6750D8] dark:hover:border-[#B5A5FF] text-left transition-all group"
          >
            <span className="text-xs font-bold text-[#191725] dark:text-[#F7F6FC] group-hover:text-[#6750D8] dark:group-hover:text-[#B5A5FF] block">
              Stripe Calculator &rarr;
            </span>
            <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
              Card & invoicing rates
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('compare')}
            className="p-3 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] hover:border-emerald-500 text-left transition-all group"
          >
            <span className="text-xs font-bold text-[#191725] dark:text-[#F7F6FC] group-hover:text-emerald-600 block">
              Compare All 3 &rarr;
            </span>
            <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
              Side-by-side matrix
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
