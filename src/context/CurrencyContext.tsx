import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'IDR' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD';

export interface CurrencyOption {
  id: CurrencyCode;
  symbol: string;
  name: string;
  nameId: string;
  code: CurrencyCode;
  rate: number; // Conversion rate relative to 1 USD (1 USD = X Currency)
  locale: string;
  decimals: number;
  flag: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { id: 'USD', symbol: '$', name: 'US Dollar', nameId: 'Dolar AS', code: 'USD', rate: 1.0, locale: 'en-US', decimals: 2, flag: '🇺🇸' },
  { id: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', nameId: 'Rupiah Indonesia', code: 'IDR', rate: 16250, locale: 'id-ID', decimals: 0, flag: '🇮🇩' },
  { id: 'EUR', symbol: '€', name: 'Euro', nameId: 'Euro Eropa', code: 'EUR', rate: 0.92, locale: 'de-DE', decimals: 2, flag: '🇪🇺' },
  { id: 'GBP', symbol: '£', name: 'British Pound', nameId: 'Poundsterling Inggris', code: 'GBP', rate: 0.78, locale: 'en-GB', decimals: 2, flag: '🇬🇧' },
  { id: 'JPY', symbol: '¥', name: 'Japanese Yen', nameId: 'Yen Jepang', code: 'JPY', rate: 155.0, locale: 'ja-JP', decimals: 0, flag: '🇯🇵' },
  { id: 'SGD', symbol: 'S$', name: 'Singapore Dollar', nameId: 'Dolar Singapura', code: 'SGD', rate: 1.34, locale: 'en-SG', decimals: 2, flag: '🇸🇬' },
  { id: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameId: 'Dolar Australia', code: 'AUD', rate: 1.52, locale: 'en-AU', decimals: 2, flag: '🇦🇺' },
];

export interface FormatCurrencyOptions {
  compact?: boolean;
  hideSymbol?: boolean;
  customDecimals?: number;
  showCode?: boolean;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyObj: CurrencyOption;
  convertFromUsd: (usdAmount: number) => number;
  convertToUsd: (currencyAmount: number) => number;
  formatCurrency: (usdAmount: number, options?: FormatCurrencyOptions) => string;
  formatRawCurrency: (amountInCurrentCurrency: number, options?: FormatCurrencyOptions) => string;
}

const STORAGE_KEY = 'hybit_currency';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCY_OPTIONS.some((c) => c.code === saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'USD';
  });

  const currencyObj = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // LocalStorage unavailable
    }
  };

  const convertFromUsd = (usdAmount: number): number => {
    if (isNaN(usdAmount) || !isFinite(usdAmount)) return 0;
    return usdAmount * currencyObj.rate;
  };

  const convertToUsd = (currencyAmount: number): number => {
    if (isNaN(currencyAmount) || !isFinite(currencyAmount) || currencyObj.rate === 0) return 0;
    return currencyAmount / currencyObj.rate;
  };

  const formatCurrency = (
    usdAmount: number,
    options?: FormatCurrencyOptions
  ): string => {
    if (isNaN(usdAmount) || !isFinite(usdAmount)) return `${currencyObj.symbol}0`;

    const converted = usdAmount * currencyObj.rate;
    return formatRawCurrency(converted, options);
  };

  const formatRawCurrency = (
    converted: number,
    options?: FormatCurrencyOptions
  ): string => {
    if (isNaN(converted) || !isFinite(converted)) return `${currencyObj.symbol}0`;

    const decimals =
      options?.customDecimals !== undefined ? options.customDecimals : currencyObj.decimals;

    let formattedNumber: string;

    if (options?.compact && Math.abs(converted) >= 1000000) {
      if (Math.abs(converted) >= 1000000000) {
        formattedNumber = (converted / 1000000000).toFixed(2) + 'B';
      } else {
        formattedNumber = (converted / 1000000).toFixed(2) + 'M';
      }
    } else {
      formattedNumber = converted.toLocaleString(currencyObj.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    if (options?.hideSymbol) {
      return formattedNumber;
    }

    // Add space for multi-character prefixes like "Rp", "S$", "A$"
    const separator = currencyObj.symbol.length > 1 ? ' ' : '';
    const codeSuffix = options?.showCode ? ` ${currencyObj.code}` : '';
    return `${currencyObj.symbol}${separator}${formattedNumber}${codeSuffix}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyObj,
        convertFromUsd,
        convertToUsd,
        formatCurrency,
        formatRawCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
