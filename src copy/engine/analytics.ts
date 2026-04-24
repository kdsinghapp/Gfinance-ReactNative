// src/engine/analytics.ts

const isDev = __DEV__;

function log(event: string, params: Record<string, any> = {}) {
  if (isDev) {
    console.log(`[GFinance Analytics] ${event}`, params);
  }
}

export const Analytics = {
  formStarted() {
    log('form_started', { screen: 'questionnaire' });
  },

  questionAnswered(questionId: string, questionIndex: number) {
    log('question_answered', { question_id: questionId, index: questionIndex });
  },

  formCompleted(durationSeconds: number, answers: Record<string, any>) {
    log('form_completed', {
      duration_seconds: Math.round(durationSeconds),
      horizon_years: answers.horizon,
      goal: answers.goal,
      age_group: answers.age,
    });
  },

  resultsViewed(allocation: any, scenarios: any) {
    log('results_viewed', {
      equity_pct: allocation.equity,
      fixed_pct: allocation.fixed,
      cash_pct: allocation.cash,
      years: scenarios.years,
    });
  },

  planSaved() {
    log('plan_saved');
  },

  savedPlanViewed() {
    log('saved_plan_viewed');
  },

  planDeleted() {
    log('plan_deleted');
  },
};
