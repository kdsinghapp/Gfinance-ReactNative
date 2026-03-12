import { I18n } from 'i18n-js';

const translations = {
  en: {
    ChangeLanguage: 'Change Language',
    splash: {
      tagline: 'Your financial future,\nsimplified.',
      subtitle: 'Answer 8 questions and get your\npersonalized plan in minutes.',
      cta: 'Start my plan',
      saved: 'View saved plan',
    },
    questions: {
      title: 'Your Goal',
      subtitle: 'Confidential answers saved only on your device.',
      calculate: 'View my plan',
      items: [
        {
          id: 'age',
          label: 'How old are you?',
          sub: 'To calibrate the investment horizon.',
          type: 'options',
          options: [
            { id: 'under_25', label: 'Under 25' },
            { id: '25_35', label: '25–35' },
            { id: '36_45', label: '36–45' },
            { id: '46_55', label: '46–55' },
            { id: 'over_55', label: 'Over 55' },
          ],
        },
        {
          id: 'goal',
          label: 'What is your goal?',
          sub: 'Choose your main objective.',
          type: 'options',
          options: [
            { id: 'retirement', label: 'Retirement' },
            { id: 'home_purchase', label: 'Home Purchase' },
            { id: 'education', label: 'Education' },
            { id: 'emergency_fund', label: 'Emergency Fund' },
            { id: 'wealth_growth', label: 'Wealth Growth' },
          ],
        },
        {
          id: 'horizon',
          label: 'In how many years do you need the money?',
          sub: 'Estimated investment horizon.',
          type: 'number',
          placeholder: 'Eg: 10',
          unit: 'years',
        },
        {
          id: 'capital',
          label: 'Initial capital',
          sub: 'Amount to invest today.',
          type: 'number',
          placeholder: 'Eg: 5000',
          unit: '$',
        },
        {
          id: 'monthly',
          label: 'Monthly contribution',
          sub: 'Recurring savings amount.',
          type: 'number',
          placeholder: 'Eg: 200',
          unit: '$',
        },
        {
          id: 'risk',
          label: 'If the market drops 20%, what would you do?',
          sub: 'Market declines are part of investing. We want to understand how you would react.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 'sell_all', label: 'Sell everything', emoji: '💸' },
            { id: 'sell_part', label: 'Sell part of it', emoji: '📉' },
            { id: 'hold', label: 'Hold my investment', emoji: '🛡️' },
            { id: 'invest_more', label: 'Invest more', emoji: '🚀' },
          ],
        },
        {
          id: 'liquidity',
          label: 'How important is it for you to have immediate access to this money?',
          sub: 'Liquidity constraints determine how much can go to long-term investments.',
          type: 'options',
          options: [
            { id: 'very', label: 'Very important' },
            { id: 'somewhat', label: 'Somewhat' },
            { id: 'little', label: 'A little' },
            { id: 'none', label: 'Not at all' },
          ],
        },
        {
          id: 'income',
          label: 'How would you describe your current income stability?',
          sub: 'More stable incomes allow for higher portfolio volatility.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 'very_unstable', label: 'Very Unstable', emoji: '⚠️' },
            { id: 'unstable', label: 'Unstable', emoji: '📉' },
            { id: 'stable', label: 'Stable', emoji: '📈' },
            { id: 'very_stable', label: 'Very Stable', emoji: '💎' },
          ],
        },
        {
          id: 'experience',
          label: 'Investing experience',
          sub: 'Your knowledge level.',
          type: 'options',
          options: [
            { id: 'none', label: 'None' },
            { id: 'basic', label: 'Basic' },
            { id: 'moderate', label: 'Moderate' },
            { id: 'advanced', label: 'Advanced' },
          ],
        },
        {
          id: 'crypto',
          label: 'Preference for including cryptocurrencies?',
          sub: 'Digital assets may be included if consistent with your profile.',
          type: 'options',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'indifferent', label: 'Indifferent' },
          ],
        },
      ],
    },
    results: {
      title: 'Your GFinance Plan',
      allocation: 'Asset Allocation',
      equity: 'Stocks',
      fixed: 'Bonds',
      cash: 'Cash',
      scenarios: '{years}-Year Projection',
      conservative: 'Conservative',
      base: 'Base',
      optimistic: 'Optimistic',
      save: 'Save Plan',
      saved: '✓ Saved',
      new: 'New Plan',
    },
    saved: {
      title: 'Saved Plans',
      empty: 'No saved plans yet.',
      delete: 'Delete',
    },
  },
};

const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.locale = 'en';

export default i18n;