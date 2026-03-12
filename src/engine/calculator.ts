// src/engine/calculator.ts

// Utility to safely parse numbers from strings with currency/symbols
const parseNum = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export interface UserAnswers {
  age: string;
  goal: string;
  horizon: number | string;
  risk: string;
  initialCapital?: number | string;
  capital?: number | string;
  monthlyContribution?: number | string;
  monthly?: number | string;
  income: string;
  experience: string;
  liquidity: string;
  crypto: string;
}

export interface Allocation {
  equities: number; // percentage
  fixedIncome: number;
  cash: number;
  realAssets: number;
  alternatives: number;
}

export interface ScenarioResult {
  label: 'conservative' | 'base' | 'optimistic';
  annualRate: number; // e.g. 0.05
  finalValue: number;
  totalContributed: number;
  totalGrowth: number;
  growthPercentage: number;
  yearlyValues: number[]; // value at end of each year
}

export interface PlanResult {
  allocation: Allocation;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  scenarios: {
    conservative: ScenarioResult;
    base: ScenarioResult;
    optimistic: ScenarioResult;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Risk scoring: produces a 0–100 score (higher = more aggressive)
// ─────────────────────────────────────────────────────────────────────────────
function computeRiskScore(answers: UserAnswers): number {
  let score = 0;

  const getIdx = (val: any, options: string[]) => {
    if (!val) return 0;
    const idx = options.indexOf(val);
    return idx !== -1 ? idx : 0;
  };

  // Map IDs from i18n.js to scores
  const ageIdx = getIdx(answers.age, ['under_25', '25_35', '36_45', '46_55', 'over_55']);
  const horizon = parseNum(answers.horizon);
  const riskIdx = getIdx(answers.risk, ['sell_all', 'sell_part', 'hold', 'invest_more']);
  const experienceIdx = getIdx(answers.experience, ['none', 'basic', 'moderate', 'advanced']);
  const incomeIdx = getIdx(answers.income, ['very_unstable', 'unstable', 'stable', 'very_stable']);
  const liquidityIdx = getIdx(answers.liquidity, ['very', 'somewhat', 'little', 'none']);

  // Age factor
  const ageScores = [30, 25, 20, 10, 5];
  score += ageScores[ageIdx] ?? 15;

  // Horizon factor
  if (horizon >= 20) score += 25;
  else if (horizon >= 10) score += 20;
  else if (horizon >= 5) score += 12;
  else score += 5;

  // Risk tolerance
  const riskScores = [0, 10, 20, 30];
  score += riskScores[riskIdx] ?? 15;

  // Experience
  const expScores = [0, 5, 10, 15];
  score += expScores[experienceIdx] ?? 5;

  // Income stability
  const incomeScores = [0, 5, 15, 20];
  score += incomeScores[incomeIdx] ?? 10;

  // Liquidity (Higher need for immediate access = lower risk capacity)
  const liquidityScores = [-10, -5, 0, 5];
  score += liquidityScores[liquidityIdx] ?? 0;

  return Math.min(100, Math.max(0, score));
}

// ─────────────────────────────────────────────────────────────────────────────
// Allocation engine
// ─────────────────────────────────────────────────────────────────────────────
function computeAllocation(riskScore: number): {
  allocation: Allocation;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
} {
  let allocation: Allocation;
  let riskProfile: 'conservative' | 'moderate' | 'aggressive';

  if (riskScore < 35) {
    riskProfile = 'conservative';
    allocation = {
      equities: 30,
      fixedIncome: 50,
      cash: 10,
      realAssets: 7,
      alternatives: 3,
    };
  } else if (riskScore < 65) {
    riskProfile = 'moderate';
    allocation = {
      equities: 60,
      fixedIncome: 30,
      cash: 5,
      realAssets: 3,
      alternatives: 2,
    };
  } else {
    riskProfile = 'aggressive';
    allocation = {
      equities: 80,
      fixedIncome: 12,
      cash: 3,
      realAssets: 3,
      alternatives: 2,
    };
  }

  return { allocation, riskProfile };
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate table per risk profile
// ─────────────────────────────────────────────────────────────────────────────
const RATE_TABLE: Record<
  'conservative' | 'moderate' | 'aggressive',
  { conservative: number; base: number; optimistic: number }
> = {
  conservative: { conservative: 0.03, base: 0.05, optimistic: 0.07 },
  moderate: { conservative: 0.04, base: 0.07, optimistic: 0.10 },
  aggressive: { conservative: 0.05, base: 0.09, optimistic: 0.13 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Future value with periodic contributions (standard compound formula)
// FV = P*(1+r)^n + PMT * [((1+r)^n - 1) / r]
// where r = monthly rate, n = total months
// ─────────────────────────────────────────────────────────────────────────────
function futureValue(
  principal: number,
  monthlyContrib: number,
  annualRate: number,
  years: number,
): number {
  if (annualRate === 0) {
    return principal + monthlyContrib * 12 * years;
  }
  const r = annualRate / 12;
  const n = years * 12;
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvContribs = monthlyContrib * ((Math.pow(1 + r, n) - 1) / r);
  return fvPrincipal + fvContribs;
}

function buildYearlyValues(
  principal: number,
  monthlyContrib: number,
  annualRate: number,
  years: number,
): number[] {
  const values: number[] = [principal];
  for (let y = 1; y <= years; y++) {
    values.push(futureValue(principal, monthlyContrib, annualRate, y));
  }
  return values;
}

function buildScenario(
  label: 'conservative' | 'base' | 'optimistic',
  annualRate: number,
  principal: number,
  monthlyContrib: number,
  years: number,
): ScenarioResult {
  const finalValue = futureValue(principal, monthlyContrib, annualRate, years);
  const totalContributed = principal + monthlyContrib * 12 * years;
  const totalGrowth = finalValue - totalContributed;
  const growthPercentage =
    totalContributed > 0 ? (totalGrowth / totalContributed) * 100 : 0;
  const yearlyValues = buildYearlyValues(
    principal,
    monthlyContrib,
    annualRate,
    years,
  );

  return {
    label,
    annualRate,
    finalValue,
    totalContributed,
    totalGrowth,
    growthPercentage,
    yearlyValues,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function calculatePlan(answers: UserAnswers): PlanResult {
  const riskScore = computeRiskScore(answers);
  const { allocation, riskProfile } = computeAllocation(riskScore);
  const rates = RATE_TABLE[riskProfile];
  
  const horizon = parseNum(answers.horizon);
  const initialCapital = parseNum(answers.initialCapital ?? answers.capital);
  const monthlyContribution = parseNum(answers.monthlyContribution ?? answers.monthly);

  const safeHorizon = Math.max(1, Math.min(50, horizon));
  const safePrincipal = Math.max(0, initialCapital);
  const safeMonthly = Math.max(0, monthlyContribution);

  return {
    allocation,
    riskProfile,
    scenarios: {
      conservative: buildScenario(
        'conservative',
        rates.conservative,
        safePrincipal,
        safeMonthly,
        safeHorizon,
      ),
      base: buildScenario(
        'base',
        rates.base,
        safePrincipal,
        safeMonthly,
        safeHorizon,
      ),
      optimistic: buildScenario(
        'optimistic',
        rates.optimistic,
        safePrincipal,
        safeMonthly,
        safeHorizon,
      ),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Compatibility Layer (Exports expected by Screens)
// ─────────────────────────────────────────────────────────────────────────────

export function calcAllocation(answers: UserAnswers): { equity: number; fixed: number; cash: number } {
  const riskScore = computeRiskScore(answers);
  const { allocation } = computeAllocation(riskScore);
  return {
    equity: allocation.equities,
    fixed: allocation.fixedIncome,
    cash: allocation.cash,
  };
}

export function getProfileLabel(allocation: { equity: number; fixed: number; cash: number } | any): string {
  // If passed the result of calcAllocation (flat object)
  const equity = allocation.equity ?? allocation.equities;
  if (equity >= 75) return 'Aggressive';
  if (equity >= 50) return 'Moderate';
  return 'Conservative';
}

export function calcFV(principal: number, monthly: number, years: number, rate: number): number {
  return futureValue(principal, monthly, rate, years);
}

export function calcScenarios(answers: UserAnswers, allocation: any) {
  const plan = calculatePlan(answers);
  const horizon = parseNum(answers.horizon);
  const initialCapital = parseNum(answers.initialCapital ?? answers.capital);
  const monthlyContribution = parseNum(answers.monthlyContribution ?? answers.monthly);

  return {
    years: horizon,
    capital: initialCapital,
    monthly: monthlyContribution,
    conservative: plan.scenarios.conservative.finalValue,
    base: plan.scenarios.base.finalValue,
    optimistic: plan.scenarios.optimistic.finalValue,
    rates: {
      conservative: plan.scenarios.conservative.annualRate,
      base: plan.scenarios.base.annualRate,
      optimistic: plan.scenarios.optimistic.annualRate,
    }
  };
}

export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0';
  }
  
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  
  // Basic comma formatter for RN compatibility (avoiding complex toLocaleString options)
  return `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
