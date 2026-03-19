import { calculatePlan, Quiz, getAssetRate } from './src/engine/calculator';

test('calculatePlan works with CAGR data', () => {
  const quiz: Quiz = {
    raw: { horiz: 2, toler: 2, liq: 1, estab: 1, exp: 1, crip: 1 }
  };

  const financialData = {
    horizon: 5,
    capital: 10000,
    monthly: 500
  };

  const result = calculatePlan(quiz, financialData);
  console.log("Profile:", result.profile);
  console.log("Weights:", result.weights);
  console.log("Conservative (Pessimistic):", result.scenarios.conservative.annualRate);
  console.log("Base (Neutral):", result.scenarios.base.annualRate);
  console.log("Optimistic:", result.scenarios.optimistic.annualRate);
  
  expect(result.profile).toBeDefined();
  expect(result.scenarios.conservative.annualRate).toBeGreaterThan(-1);
  expect(result.scenarios.base.annualRate).toBeGreaterThan(-1);
  expect(result.scenarios.optimistic.annualRate).toBeGreaterThan(-1);
});

test('verify interpolation math for CAGR', () => {
  const rate3 = getAssetRate('equity', 'optimistic', 3); // 10.0
  const rate5 = getAssetRate('equity', 'optimistic', 5); // 8.5
  const interp = getAssetRate('equity', 'optimistic', 4); // (10.0 + 8.5) / 2 = 9.25
  
  expect(rate3).toBe(10.0);
  expect(rate5).toBe(8.5);
  expect(interp).toBe(9.25);

  // Test boundary case
  const rateOver = getAssetRate('equity', 'optimistic', 20); // must be 15Y value (7.5)
  expect(rateOver).toBe(7.5);

  const rateUnder = getAssetRate('equity', 'optimistic', 0.5); // must be 1Y value (16.0)
  expect(rateUnder).toBe(16.0);
});
