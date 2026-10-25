export type ProviderId = 'paypal' | 'payoneer' | 'stripe';

export type CalculationMode = 'standard' | 'reverse';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  fixedFee: {
    paypal: number;
    stripe: number;
    payoneerFixedWithdrawal: number;
  };
}

export interface RegionConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export interface FeeRuleAssumption {
  title: string;
  description: string;
  isVerified: boolean;
  officialSourceUrl: string;
  lastVerifiedDate: string;
}

export interface PayPalOption {
  id: string;
  name: string;
  description: string;
  domesticRate: number; // e.g. 0.0299 for 2.99%
  internationalCrossBorderRate: number; // e.g. 0.015 for 1.50%
  fixedFeeUsd: number;
}

export interface PayoneerOption {
  id: string;
  name: string;
  description: string;
  receivingRate: number; // e.g. 0.03 for 3%
  fixedFee: number;
  withdrawalRate: number; // e.g. 0.02 for 2% FX or 0 for same-currency
  withdrawalFixed: number; // e.g. 1.50
}

export interface StripeOption {
  id: string;
  name: string;
  description: string;
  domesticCardRate: number; // e.g. 0.029 for 2.9%
  internationalCardSurcharge: number; // e.g. 0.015 for 1.5%
  currencyConversionSurcharge: number; // e.g. 0.01 for 1.0%
  invoicingFeeRate: number; // 0 for basic, 0.004 for Invoicing Plus
}

export interface CalculationResult {
  mode: CalculationMode;
  grossAmount: number;
  netAmount: number;
  totalFee: number;
  effectiveFeePercent: number;
  breakdown: {
    basePercentFee: number;
    basePercentRate: number;
    fixedFee: number;
    crossBorderFee?: number;
    crossBorderRate?: number;
    currencyConversionFee?: number;
    currencyConversionRate?: number;
    withdrawalFee?: number;
    otherFees?: number;
  };
  provider: ProviderId;
  currencySymbol: string;
  currencyCode: string;
  assumptions: FeeRuleAssumption;
  formulaExplanation: string;
}

export type PageId =
  | 'home'
  | 'paypal'
  | 'payoneer'
  | 'stripe'
  | 'compare'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';
