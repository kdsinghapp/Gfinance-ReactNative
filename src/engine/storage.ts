// src/engine/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAN_KEY = '@gfinance_plans_v2';

export type PlanData = {
  id: string;
  answers: Record<string, any>;
  allocation: any;
  scenarios: any;
  chartData: any;
  savedAt: string;
};

export const Storage = {
  async savePlan(data: Omit<PlanData, 'id' | 'savedAt'>): Promise<boolean> {
    try {
      const existing = await this.loadPlans();
      const newPlan: PlanData = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        savedAt: new Date().toISOString(),
      };
      const updated = [newPlan, ...existing];
      await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('[Storage] savePlan error:', e);
      return false;
    }
  },

  async loadPlans(): Promise<PlanData[]> {
    try {
      const raw = await AsyncStorage.getItem(PLAN_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('[Storage] loadPlans error:', e);
      return [];
    }
  },

  async deletePlan(id: string): Promise<boolean> {
    try {
      const existing = await this.loadPlans();
      const filtered = existing.filter(p => p.id !== id);
      await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('[Storage] deletePlan error:', e);
      return false;
    }
  },

  async hasPlan(): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(PLAN_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  },
  
  // Backward compatibility helper
  async loadPlan(): Promise<PlanData | null> {
    const plans = await this.loadPlans();
    return plans.length > 0 ? plans[0] : null;
  }
};
