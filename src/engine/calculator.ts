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

export type Weights = { RV: number; RF: number; Cash: number; Crypto: number }; // 0..1

export type Quiz = {
  P_Horiz?: 'Corto' | 'Medio' | 'Largo'; // compatibilidad
  P_Toler?: 'Baja' | 'Media' | 'Alta';
  P_Liq?: 'Muy alta' | 'Algo importante' | 'No prioritaria';
  P_Estab?: 'Estables' | 'Inestables';
  P_Cripto?: 'No' | 'Indiferente' | 'Sí';
  raw?: { horiz?: number; toler?: number; liq?: number; estab?: number; exp?: number; crip?: number };
};

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
  weights: Weights;
  profile: string;
  notes: string[];
  scenarios: {
    conservative: ScenarioResult;
    base: ScenarioResult;
    optimistic: ScenarioResult;
  };
}

// ====== Parámetros ======
const BASE: Weights = { RV: 0.60, RF: 0.30, Cash: 0.10, Crypto: 0.00 };

// Horizonte (4 opciones)
const RV_MAX_HORIZ_LT1 = 0.15; // < 1 año
const RV_MAX_HORIZ_1_2 = 0.20; // 1–2 años
const RV_MAX_HORIZ_3_7 = 0.75; // 3–7 años
// >7 años → sin límite

// Tolerancia
const RV_MAX_TOLER_BAJA = 0.27; // baja → máx 27%
// NUEVO: si raw.toler === 1 ("vendería una parte"): mover 5 pp RV→RF
const TOLER_PARTIAL_SHIFT = -0.05;

// Estabilidad de ingresos
const RV_PENALTY_INGRESOS_INESTABLES = 0.10;

// Liquidez
const CASH_MIN_LIQ_MUY_ALTA = 0.25;
const CASH_MIN_LIQ_ALGO = 0.13;

// Cripto
const CRYPTO_TARGET_SI = 0.03;
const CRYPTO_TARGET_INDIF = 0.01;

// Experiencia (pp del total)
const EXP_SHIFT_NONE = -0.03; // Ninguna: RV→RF 3 pp
const EXP_SHIFT_BASIC = -0.01; // Básica: RV→RF 1 pp
const EXP_SHIFT_ADV = +0.02; // Avanzada: RF→RV 2 pp

// ========================

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const normalize = (w: Weights): Weights => {
  const s = w.RV + w.RF + w.Cash + w.Crypto;
  if (s <= 0) return { ...BASE };
  return { RV: w.RV / s, RF: w.RF / s, Cash: w.Cash / s, Crypto: w.Crypto / s };
};

function take(value: number, want: number) {
  const t = Math.max(0, Math.min(value, want));
  return [t, want - t] as const;
}

// mueve masa de RF/Cash a RV respetando cash mínimo y un posible cap de RV
function enforceMinRV(w: Weights, minRV: number, minCash: number, maxRV: number | null) {
  if (minRV == null) return w;
  const cap = (maxRV != null) ? Math.min(minRV, maxRV) : minRV;
  if (w.RV >= cap) return w;
  
  let need = cap - w.RV;
  
  // 1) Tomar de RF primero
  const takeRF = Math.min(w.RF, need);
  w.RF -= takeRF;
  w.RV += takeRF;
  need -= takeRF;
  
  // 2) Si aún falta, tomar de Cash pero sin bajar de minCash
  if (need > 0) {
    const availCash = Math.max(0, w.Cash - minCash);
    const takeC = Math.min(availCash, need);
    w.Cash -= takeC;
    w.RV += takeC;
    need -= takeC;
  }
  
  return w;
}

/** Devuelve pesos + etiqueta de perfil + notas explicativas de los ajustes */
export function buildProfile(quiz?: Quiz) {
  const notes: string[] = [];
  let w: Weights = { ...BASE };
 
  // Restricciones fuertes acumuladas
  let maxRV: number | null = null;
  let minCash = 0;
  let cryptoBlocked = false;
  let cryptoTarget = 0;
 
  // === 1) Reglas por respuestas (prioridad alta: horizonte y liquidez) ===
 
  // Horizonte (0:<1a, 1:1–2a, 2:3–7a, 3:>7a)
  const h = quiz?.raw?.horiz;
  if (h === 0 || quiz?.P_Horiz === 'Corto') {
    maxRV = (maxRV === null) ? RV_MAX_HORIZ_LT1 : Math.min(maxRV, RV_MAX_HORIZ_LT1);
    cryptoBlocked = true;
    notes.push(`Horizonte corto (< 1 año): RV máx ${Math.round(RV_MAX_HORIZ_LT1 * 100)}% y cripto bloqueada.`);
  } else if (h === 1) {
    maxRV = (maxRV === null) ? RV_MAX_HORIZ_1_2 : Math.min(maxRV, RV_MAX_HORIZ_1_2);
    cryptoBlocked = true;
    notes.push(`Horizonte 1–2 años: RV máx ${Math.round(RV_MAX_HORIZ_1_2 * 100)}% y cripto bloqueada.`);
  } else if (h === 2 || quiz?.P_Horiz === 'Medio') {
    maxRV = (maxRV === null) ? RV_MAX_HORIZ_3_7 : Math.min(maxRV, RV_MAX_HORIZ_3_7);
    notes.push(`Horizonte 3–7 años: RV máx ${Math.round(RV_MAX_HORIZ_3_7 * 100)}%.`);
  } else if (h === 3 || quiz?.P_Horiz === 'Largo') {
    notes.push('Horizonte largo (> 7 años): sin límite específico de RV.');
  }
 
  // Tolerancia baja (0: vendería todo)
  if (quiz?.raw?.toler === 0 || quiz?.P_Toler === 'Baja') {
    maxRV = (maxRV === null) ? RV_MAX_TOLER_BAJA : Math.min(maxRV, RV_MAX_TOLER_BAJA);
    cryptoBlocked = true;
    notes.push(`Tolerancia baja: RV máx ${Math.round(RV_MAX_TOLER_BAJA * 100)}% y cripto bloqueada.`);
  }
 
  // Estabilidad de ingresos
  if (quiz?.raw?.estab === 0 || quiz?.raw?.estab === 1 || quiz?.P_Estab === 'Inestables') {
    w.RV = clamp01(w.RV - RV_PENALTY_INGRESOS_INESTABLES);
    cryptoBlocked = true;
    notes.push(`Ingresos inestables: -${Math.round(RV_PENALTY_INGRESOS_INESTABLES * 100)} pp en RV y cripto bloqueada.`);
  }
 
  // Liquidez mínima
  const l = quiz?.raw?.liq;
  if (l === 0 || quiz?.P_Liq === 'Muy alta') {
    minCash = Math.max(minCash, CASH_MIN_LIQ_MUY_ALTA);
    notes.push(`Liquidez muy alta: cash mínimo ${Math.round(CASH_MIN_LIQ_MUY_ALTA * 100)}%.`);
  } else if (l === 1 || quiz?.P_Liq === 'Algo importante') {
    minCash = Math.max(minCash, CASH_MIN_LIQ_ALGO);
    notes.push(`Liquidez algo importante: cash mínimo ${Math.round(CASH_MIN_LIQ_ALGO * 100)}%.`);
  }
 
  // Preferencia cripto
  if (!cryptoBlocked) {
    const c = quiz?.raw?.crip;
    if (c === 2 || quiz?.P_Cripto === 'Sí') cryptoTarget = CRYPTO_TARGET_SI;
    else if (c === 1 || quiz?.P_Cripto === 'Indiferente') cryptoTarget = CRYPTO_TARGET_INDIF;
    else cryptoTarget = 0;
  } else {
    cryptoTarget = 0;
  }
 
  // === 2) Aplicación de restricciones fuertes (determinista) ===
 
  // Crypto al objetivo (quita de RV y luego de RF)
  const dC = cryptoTarget - w.Crypto;
  if (dC > 0) {
    let need = dC, t;
    [t, need] = take(w.RV, need);
    w.RV -= t;
    w.Crypto += t;
    if (need > 0) {
      [t, need] = take(w.RF, need);
      w.RF -= t;
      w.Crypto += t;
    }
  } else if (dC < 0) {
    w.Crypto += dC;
    w.RF -= dC; // devuelve a RF
  }
 
  // Cash mínimo (quita de RV y luego de RF)
  if (w.Cash < minCash) {
    let need = minCash - w.Cash, t;
    [t, need] = take(w.RV, need);
    w.RV -= t;
    w.Cash += t;
    if (need > 0) {
      [t, need] = take(w.RF, need);
      w.RF -= t;
      w.Cash += t;
    }
  }
 
  // RV máximo (mueve exceso a RF)
  if (maxRV != null && w.RV > maxRV) {
    const exceso = w.RV - maxRV;
    w.RV = maxRV;
    w.RF += exceso;
  }
 
  // RV mínima para perfil agresivo (h>7 y tolerancia alta, liquidez no prioritaria)
  let minRV: number | null = null;
  const isAggressive = (h === 3 || quiz?.P_Horiz === 'Largo') && (quiz?.raw?.toler === 3 || quiz?.P_Toler === 'Alta');
  const liqNotPrioritary = (l === 2 || l === 3) || (quiz?.P_Liq === 'No prioritaria');
  if (isAggressive && liqNotPrioritary) {
    minRV = (quiz?.raw?.exp === 3) ? 0.85 : 0.80; // exp avanzada → 85%, si no 80%
    w = enforceMinRV(w, minRV, minCash, maxRV);
    notes.push(`Perfil agresivo detectado: RV mínima establecida en ${Math.round(minRV * 100)}%.`);
  }
 
  // === 3) Ajustes suaves al final ===
 
  // 3.a) TOLERANCIA "vendería una parte" → mover 5 pp de RV a RF
  if (quiz?.raw?.toler === 1) {
    const move = Math.min(w.RV, Math.abs(TOLER_PARTIAL_SHIFT));
    w.RV -= move;
    w.RF += move;
    notes.push('Tolerancia intermedia: se reduce un 5% la exposición a RV.');
  }
 
  // 3.b) EXPERIENCIA inversora
  const e = quiz?.raw?.exp;
  let shift = 0;
  if (e === 0) {
    shift = EXP_SHIFT_NONE;
    if (shift !== 0) notes.push('Sin experiencia: ajuste conservador (-3% RV).');
  } else if (e === 1) {
    shift = EXP_SHIFT_BASIC;
    if (shift !== 0) notes.push('Experiencia básica: ajuste moderado (-1% RV).');
  } else if (e === 3) {
    shift = EXP_SHIFT_ADV;
    if (shift !== 0) notes.push('Experiencia avanzada: ajuste dinámico (+2% RV).');
  }
 
  if (shift !== 0) {
    if (shift > 0) {
      const mv = Math.min(w.RF, shift);
      w.RF -= mv;
      w.RV += mv;
    } else {
      const mv = Math.min(w.RV, -shift);
      w.RV -= mv;
      w.RF += mv;
    }
  }
 
  // 3.c) Reaplicar SOLO restricciones fuertes (horizonte / liquidez) tras ajustes finales
  if (w.Cash < minCash) {
    let need = minCash - w.Cash, t;
    [t, need] = take(w.RV, need);
    w.RV -= t;
    w.Cash += t;
    if (need > 0) {
      [t, need] = take(w.RF, need);
      w.RF -= t;
      w.Cash += t;
    }
  }
 
  if (maxRV != null && w.RV > maxRV) {
    const exceso = w.RV - maxRV;
    w.RV = maxRV;
    w.RF += exceso;
  }
 
  if (minRV != null && w.RV < minRV) {
    w = enforceMinRV(w, minRV, minCash, maxRV);
  }
 
  // Limpieza y normalización final
  w = normalize({
    RV: clamp01(w.RV),
    RF: clamp01(w.RF),
    Cash: clamp01(w.Cash),
    Crypto: clamp01(w.Crypto),
  });
 
  // Etiqueta de perfil (informativa)
  const profile =
    w.RV < 0.25 ? 'Muy conservador' :
    w.RV < 0.40 ? 'Conservador' :
    w.RV < 0.60 ? 'Moderado' :
    w.RV < 0.80 ? 'Dinámico' :
    'Agresivo';
 
  return { weights: w, profile, notes };
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate table per risk profile
// ─────────────────────────────────────────────────────────────────────────────
const RATE_TABLE: Record<string, { conservative: number; base: number; optimistic: number }> = {
  'Muy conservador': { conservative: 0.02, base: 0.04, optimistic: 0.06 },
  'Conservador': { conservative: 0.03, base: 0.05, optimistic: 0.07 },
  'Moderado': { conservative: 0.04, base: 0.07, optimistic: 0.10 },
  'Dinámico': { conservative: 0.05, base: 0.08, optimistic: 0.12 },
  'Agresivo': { conservative: 0.06, base: 0.10, optimistic: 0.15 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Future value formulas
// ─────────────────────────────────────────────────────────────────────────────
export function futureValue(
  principal: number,
  contrib: number,
  annualRate: number,
  years: number,
  frequency: 'weekly' | 'monthly' | 'annual' = 'monthly'
): number {
  const mults = { weekly: 52, monthly: 12, annual: 1 };
  const m = mults[frequency] || 12;
  
  if (annualRate === 0) return principal + (contrib * m * years);
  
  const r = annualRate / m;
  const n = years * m;
  
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvContribs = contrib * ((Math.pow(1 + r, n) - 1) / r);
  
  const result = fvPrincipal + fvContribs;
  return isFinite(result) ? Math.min(result, 1e25) : 1e25;
}

function buildYearlyValues(
  principal: number,
  contrib: number,
  annualRate: number,
  years: number,
  frequency: 'weekly' | 'monthly' | 'annual' = 'monthly'
): number[] {
  const values: number[] = [principal];
  for (let y = 1; y <= years; y++) {
    values.push(futureValue(principal, contrib, annualRate, y, frequency));
  }
  return values;
}

function buildScenario(
  label: 'conservative' | 'base' | 'optimistic',
  annualRate: number,
  principal: number,
  contrib: number,
  years: number,
  frequency: 'weekly' | 'monthly' | 'annual' = 'monthly'
): ScenarioResult {
  const finalValue = futureValue(principal, contrib, annualRate, years, frequency);
  
  const mults = { weekly: 52, monthly: 12, annual: 1 };
  const m = mults[frequency] || 12;
  const totalContributed = principal + (contrib * m * years);
  
  const totalGrowth = finalValue - totalContributed;
  const growthPercentage = totalContributed > 0 ? (totalGrowth / totalContributed) * 100 : 0;
  const yearlyValues = buildYearlyValues(principal, contrib, annualRate, years, frequency);

  return { label, annualRate, finalValue, totalContributed, totalGrowth, growthPercentage, yearlyValues };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function calculatePlan(quiz: Quiz, financialData: { horizon: number, capital: number, monthly: number, frequency?: 'weekly' | 'monthly' | 'annual' }): PlanResult {
  const { weights, profile, notes } = buildProfile(quiz);
  const rates = RATE_TABLE[profile] || RATE_TABLE['Moderado'];
  
  const horizon = Math?.max(1, Math.min(50, financialData.horizon));
  const principal = Math?.max(0, financialData.capital);
  const amount = Math?.max(0, financialData.monthly);
  const frequency = financialData.frequency || 'monthly';

  return {
    weights,
    profile,
    notes,
    scenarios: {
      conservative: buildScenario('conservative', rates.conservative, principal, amount, horizon, frequency),
      base: buildScenario('base', rates.base, principal, amount, horizon, frequency),
      optimistic: buildScenario('optimistic', rates.optimistic, principal, amount, horizon, frequency),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Compatibility Layer
// ─────────────────────────────────────────────────────────────────────────────
export function toPct(x: number) {
  return (x * 100).toFixed(1) + '%';
}

export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  if (!isFinite(value)) return '∞';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e15) return `${sign}$${(absValue / 1e15).toFixed(2)}Q`;
  if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
  if (absValue >= 1e9)  return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6)  return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  if (absValue >= 1e3)  return `${sign}$${(absValue / 1e3).toFixed(1)}K`;

  return `${sign}$${Math.round(absValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// Helper for RecommendedAllocation screen
export function calcAllocation(weights: Weights) {
  return {
    equity: weights.RV * 100,
    fixed: weights.RF * 100,
    cash: weights.Cash * 100,
    crypto: weights.Crypto * 100
  };
}

export function getProfileLabel(weights: Weights | any): string {
  const rv = weights.RV ?? weights.equity / 100;
  if (rv < 0.25) return 'Muy conservador';
  if (rv < 0.40) return 'Conservador';
  if (rv < 0.60) return 'Moderado';
  if (rv < 0.80) return 'Dinámico';
  return 'Agresivo';
}
