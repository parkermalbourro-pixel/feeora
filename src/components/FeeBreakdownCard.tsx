import React, { useState } from 'react';
import { CalculationResult } from '../types';
import {
  formatCurrency,
  formatPercent,
} from '../utils/calculator';
import {
  Copy,
  Check,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface FeeBreakdownCardProps {
  result: CalculationResult;
  providerDisplayName: string;
}

export const FeeBreakdownCard: React.FC<FeeBreakdownCardProps> = ({
  result,
  providerDisplayName,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const isReverse = result.mode === 'reverse';

  const handleCopySummary = () => {
    const text = `--- ${providerDisplayName} Fee Estimation (via Feeora) ---
Type: ${isReverse ? 'Reverse Gross-Up (Target Net -> Gross to Invoice)' : 'Standard Payout (Gross Payment -> Net in Pocket)'}
Gross Invoiced: ${formatCurrency(result.grossAmount, result.currencyCode, result.currencySymbol)}
Estimated Total Fee: ${formatCurrency(result.totalFee, result.currencyCode, result.currencySymbol)} (${result.effectiveFeePercent.toFixed(2)}%)
Estimated Net Payout: ${formatCurrency(result.netAmount, result.currencyCode, result.currencySymbol)}
Source: ${result.assumptions.officialSourceUrl} (Verified: ${result.assumptions.lastVerifiedDate})
Disclaimer: Independent estimate. Confirm terms with provider.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] shadow-card overflow-hidden transition-all duration-200">
      {/* Primary Result Hero Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#FAF9FC] to-[#F4F2F8] dark:from-[#15141E] dark:to-[#191923] border-b border-[#E9E7EF] dark:border-[#333242]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] border border-[#6750D8]/10 dark:border-[#B5A5FF]/20">
            <span>{providerDisplayName}</span>
            <span>&bull;</span>
            <span>{isReverse ? 'Reverse Gross-Up' : 'Standard Payout'}</span>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#21202D] text-[#191725] dark:text-[#F7F6FC] hover:bg-[#FAF9FC] dark:hover:bg-[#2B293A] transition-colors border border-[#E9E7EF] dark:border-[#333242] shadow-2xs"
            title="Copy breakdown summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#686778] dark:text-[#B5B2C4]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Most prominent figure: Net Payout (or required invoice in reverse mode) */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] block">
            {isReverse ? 'Required Gross Amount to Invoice' : 'Estimated Net in Your Pocket'}
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#191725] dark:text-[#F7F6FC] font-mono">
              {isReverse
                ? formatCurrency(result.grossAmount, result.currencyCode, result.currencySymbol)
                : formatCurrency(result.netAmount, result.currencyCode, result.currencySymbol)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
              {isReverse ? 'to receive target net' : 'after estimated fees'}
            </span>
          </div>
        </div>

        {/* Key 3 stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#E9E7EF] dark:border-[#333242] text-xs">
          <div>
            <span className="text-[#686778] dark:text-[#B5B2C4] block text-[10px]">
              {isReverse ? 'Target Net' : 'Gross Amount'}
            </span>
            <span className="font-bold text-[#191725] dark:text-[#F7F6FC] font-mono truncate block">
              {isReverse
                ? formatCurrency(result.netAmount, result.currencyCode, result.currencySymbol)
                : formatCurrency(result.grossAmount, result.currencyCode, result.currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[#686778] dark:text-[#B5B2C4] block text-[10px]">Total Fees</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono truncate block">
              -{formatCurrency(result.totalFee, result.currencyCode, result.currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[#686778] dark:text-[#B5B2C4] block text-[10px]">Effective Fee</span>
            <span className="font-bold text-[#6750D8] dark:text-[#B5A5FF] font-mono truncate block">
              {result.effectiveFeePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Fee Breakdown List */}
      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-xs font-bold text-[#191725] dark:text-[#F7F6FC] uppercase tracking-wider mb-2.5">
            Itemized Fee Breakdown
          </h3>
          <div className="divide-y divide-[#E9E7EF] dark:divide-[#333242] border border-[#E9E7EF] dark:border-[#333242] rounded-xl overflow-hidden text-xs">
            {/* Base Percent Fee */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#191923]">
              <div className="space-y-0.5">
                <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  Base Merchant Processing Fee
                </span>
                <p className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  {formatPercent(result.breakdown.basePercentRate)} of gross invoice
                </p>
              </div>
              <span className="font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">
                {formatCurrency(result.breakdown.basePercentFee, result.currencyCode, result.currencySymbol)}
              </span>
            </div>

            {/* Fixed Transaction Fee */}
            {result.breakdown.fixedFee > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#FAF9FC] dark:bg-[#15141E]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">Fixed Per-Transaction Fee</span>
                  <p className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                    Standard gateway settlement fee
                  </p>
                </div>
                <span className="font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">
                  {formatCurrency(result.breakdown.fixedFee, result.currencyCode, result.currencySymbol)}
                </span>
              </div>
            )}

            {/* Cross-Border / International Fee */}
            {result.breakdown.crossBorderFee !== undefined && result.breakdown.crossBorderFee > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#FDF0F7] dark:bg-[#2E1825]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#B92F77] dark:text-[#F29BCB]">
                    Cross-Border Surcharge
                  </span>
                  <p className="text-[11px] text-[#B92F77]/80 dark:text-[#F29BCB]/80">
                    {formatPercent(result.breakdown.crossBorderRate || 0)} international card origin
                  </p>
                </div>
                <span className="font-mono font-bold text-[#B92F77] dark:text-[#F29BCB]">
                  +{formatCurrency(result.breakdown.crossBorderFee, result.currencyCode, result.currencySymbol)}
                </span>
              </div>
            )}

            {/* Currency Conversion Fee */}
            {result.breakdown.currencyConversionFee !== undefined && result.breakdown.currencyConversionFee > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#FDF0F7] dark:bg-[#2E1825]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#B92F77] dark:text-[#F29BCB]">
                    Currency Conversion / FX Margin
                  </span>
                  <p className="text-[11px] text-[#B92F77]/80 dark:text-[#F29BCB]/80">
                    {formatPercent(result.breakdown.currencyConversionRate || 0)} exchange rate spread
                  </p>
                </div>
                <span className="font-mono font-bold text-[#B92F77] dark:text-[#F29BCB]">
                  +{formatCurrency(result.breakdown.currencyConversionFee, result.currencyCode, result.currencySymbol)}
                </span>
              </div>
            )}

            {/* Payoneer Bank Withdrawal Fee */}
            {result.breakdown.withdrawalFee !== undefined && result.breakdown.withdrawalFee > 0 && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#191923]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">
                    Local Bank Withdrawal Fee
                  </span>
                  <p className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                    Direct transfer to your bank account
                  </p>
                </div>
                <span className="font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">
                  {formatCurrency(result.breakdown.withdrawalFee, result.currencyCode, result.currencySymbol)}
                </span>
              </div>
            )}

            {/* Other Fees (e.g. Stripe Invoicing Plus) */}
            {result.breakdown.otherFees !== undefined && result.breakdown.otherFees > 0 && (
              <div className="flex items-center justify-between p-3 bg-[#FAF9FC] dark:bg-[#15141E]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">
                    Invoicing Service Add-on
                  </span>
                  <p className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">Automated invoice workflow</p>
                </div>
                <span className="font-mono font-bold text-[#191725] dark:text-[#F7F6FC]">
                  {formatCurrency(result.breakdown.otherFees, result.currencyCode, result.currencySymbol)}
                </span>
              </div>
            )}

            {/* Total Fees Row */}
            <div className="flex items-center justify-between p-3.5 bg-[#FAF9FC] dark:bg-[#15141E] font-bold border-t border-[#E9E7EF] dark:border-[#333242]">
              <span className="text-[#191725] dark:text-[#F7F6FC]">Total Estimated Deductions</span>
              <span className="font-mono text-sm text-rose-600 dark:text-rose-400">
                -{formatCurrency(result.totalFee, result.currencyCode, result.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Math Formula & Arithmetic Step-by-Step */}
        <div className="border border-[#E9E7EF] dark:border-[#333242] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="w-full flex items-center justify-between p-3 bg-[#FAF9FC] dark:bg-[#15141E] hover:bg-[#F4F2F8] dark:hover:bg-[#21202D] text-left transition-colors text-xs font-semibold text-[#191725] dark:text-[#F7F6FC]"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#6750D8] dark:text-[#B5A5FF]" />
              <span>How Was This Calculated? (Formula & Arithmetic)</span>
            </div>
            {showFormula ? (
              <ChevronUp className="w-4 h-4 text-[#686778]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#686778]" />
            )}
          </button>

          {showFormula && (
            <div className="p-3.5 bg-white dark:bg-[#191923] border-t border-[#E9E7EF] dark:border-[#333242] space-y-2">
              <pre className="font-mono text-[11px] text-[#191725] dark:text-[#B5B2C4] bg-[#FAF9FC] dark:bg-[#11111A] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[#E9E7EF] dark:border-[#333242]">
                {result.formulaExplanation}
              </pre>
              <p className="text-[11px] text-[#686778] dark:text-[#7E7B8F]">
                Formula note: Reverse calculation divides by <code>(1 - TotalRate)</code> so that after the processor takes fees on the full gross invoice, exactly your target net remains.
              </p>
            </div>
          )}
        </div>

        {/* Official Source & Verification Transparency Box */}
        <div className="p-3.5 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1.5 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#191725] dark:text-[#F7F6FC]">
              {result.assumptions.isVerified ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{result.assumptions.title}</span>
            </div>
            <span className="text-[10px] text-[#686778] dark:text-[#7E7B8F]">
              Verified: <strong className="text-[#191725] dark:text-[#F7F6FC]">{result.assumptions.lastVerifiedDate}</strong>
            </span>
          </div>

          <p className="text-[11px] text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            {result.assumptions.description}
          </p>

          <div className="pt-1.5 flex items-center justify-between flex-wrap gap-2 text-[10px] border-t border-[#E9E7EF] dark:border-[#333242]">
            <span className="text-[#686778] dark:text-[#7E7B8F]">
              Independent estimate. Not an official quote.
            </span>
            <a
              href={result.assumptions.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#6750D8] dark:text-[#B5A5FF] hover:underline font-semibold"
            >
              <span>Official Pricing Source</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
