import { CurrencyConfig, RegionConfig, FeeRuleAssumption } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    fixedFee: {
      paypal: 0.49,
      stripe: 0.30,
      payoneerFixedWithdrawal: 1.50,
    },
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    fixedFee: {
      paypal: 0.39,
      stripe: 0.25,
      payoneerFixedWithdrawal: 1.50,
    },
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    fixedFee: {
      paypal: 0.39,
      stripe: 0.20,
      payoneerFixedWithdrawal: 1.50,
    },
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar (CAD)',
    fixedFee: {
      paypal: 0.59,
      stripe: 0.30,
      payoneerFixedWithdrawal: 2.00,
    },
  },
  {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar (AUD)',
    fixedFee: {
      paypal: 0.59,
      stripe: 0.30,
      payoneerFixedWithdrawal: 2.00,
    },
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    fixedFee: {
      paypal: 3.00,
      stripe: 3.00,
      payoneerFixedWithdrawal: 100.00,
    },
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar (SGD)',
    fixedFee: {
      paypal: 0.50,
      stripe: 0.50,
      payoneerFixedWithdrawal: 2.50,
    },
  },
];

export const SUPPORTED_REGIONS: RegionConfig[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'EU', name: 'European Union (Eurozone)', flag: '🇪🇺', currency: 'EUR' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD' },
  { code: 'ROW', name: 'Other International / Global', flag: '🌐', currency: 'USD' },
];

export const PAYPAL_FEE_ASSUMPTIONS: Record<string, FeeRuleAssumption> = {
  US: {
    title: 'PayPal US Merchant Fee Schedule',
    description: 'Based on PayPal standard merchant rates for US business accounts. Domestic invoicing is 2.99% + $0.49; standard online checkout is 3.49% + $0.49. International cross-border fee adds +1.50%. Currency conversion adds 3.00% to 4.00% spread.',
    isVerified: true,
    officialSourceUrl: 'https://www.paypal.com/us/webapps/mpp/merchant-fees',
    lastVerifiedDate: 'January 2025',
  },
  GB: {
    title: 'PayPal UK Merchant Fee Schedule',
    description: 'UK standard domestic commercial transactions are 2.90% + £0.39. Cross-border fee adds +1.99% for EEA or +2.00% for other international senders.',
    isVerified: true,
    officialSourceUrl: 'https://www.paypal.com/uk/webapps/mpp/merchant-fees',
    lastVerifiedDate: 'January 2025',
  },
  EU: {
    title: 'PayPal Eurozone Merchant Fee Schedule',
    description: 'Standard domestic commercial rate is typically 2.90% + €0.39. International cross-border fee adds +1.99% to +2.00%.',
    isVerified: true,
    officialSourceUrl: 'https://www.paypal.com/fr/webapps/mpp/merchant-fees',
    lastVerifiedDate: 'January 2025',
  },
  ROW: {
    title: 'PayPal Global / Cross-Border Baseline',
    description: 'Standard cross-border merchant receiving rate is 4.40% + fixed currency fee. Currency conversion adds 3.50% - 4.00%.',
    isVerified: true,
    officialSourceUrl: 'https://www.paypal.com/us/webapps/mpp/merchant-fees',
    lastVerifiedDate: 'January 2025',
  },
};

export const PAYONEER_FEE_ASSUMPTIONS: FeeRuleAssumption = {
  title: 'Payoneer Published Pricing & Fees',
  description: 'Receiving from another Payoneer customer is 0% (Free). Receiving by Credit Card is 3.00% flat. Receiving via ACH bank debit is 1.00%. Local bank withdrawal with foreign currency conversion incurs up to 2.00% FX spread. Same-currency withdrawal is $1.50 flat.',
  isVerified: true,
  officialSourceUrl: 'https://www.payoneer.com/about/pricing/',
  lastVerifiedDate: 'January 2025',
};

export const STRIPE_FEE_ASSUMPTIONS: Record<string, FeeRuleAssumption> = {
  US: {
    title: 'Stripe US Standard Pricing',
    description: 'US domestic card transactions are 2.9% + $0.30. International cards add +1.5% surcharge. If currency conversion occurs, an additional +1.0% applies. Invoicing Plus adds +0.4%.',
    isVerified: true,
    officialSourceUrl: 'https://stripe.com/pricing',
    lastVerifiedDate: 'January 2025',
  },
  GB: {
    title: 'Stripe UK Standard Pricing',
    description: 'UK domestic cards are 1.5% + 20p. EU cards are 2.5% + 20p. International cards are 3.25% + 20p. Currency conversion adds +2.0%.',
    isVerified: true,
    officialSourceUrl: 'https://stripe.com/gb/pricing',
    lastVerifiedDate: 'January 2025',
  },
  EU: {
    title: 'Stripe Europe (EEA) Pricing',
    description: 'Standard EEA domestic cards are 1.5% + €0.25. UK cards are 2.5% + €0.25. Non-EEA international cards are 3.25% + €0.25. Currency conversion adds +2.0%.',
    isVerified: true,
    officialSourceUrl: 'https://stripe.com/pricing',
    lastVerifiedDate: 'January 2025',
  },
  ROW: {
    title: 'Stripe Global Standard Pricing',
    description: 'Standard merchant card rate is 3.4% to 4.4% + fixed fee, with +1.0% to +2.0% for currency conversion where applicable.',
    isVerified: true,
    officialSourceUrl: 'https://stripe.com/pricing',
    lastVerifiedDate: 'January 2025',
  },
};
