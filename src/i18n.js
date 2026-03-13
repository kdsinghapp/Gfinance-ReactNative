import { I18n } from 'i18n-js';

const translations = {
  en: {
    ChangeLanguage: 'Change Language',
    financialCalculator: 'Financial Calculator',

    splash: {
      tagline: 'Your financial future,\nsimplified.',
      subtitle:
        'Answer a few questions and get your\npersonalized financial plan in minutes.',
      cta: 'Start my plan',
      saved: 'View saved plans',
    },

    questions: {
      title: 'Your Profile',
      subtitle:
        'Your confidential answers are stored only on your device.',
      next: 'Next',
      calculate: 'View my plan',

      profile: [
        {
          id: 'horiz',
          label: 'In how many years do you need the money?',
          sub: 'Estimated investment horizon.',
          type: 'options',
          options: [
            { id: 0, label: '0 < 1 year' },
            { id: 1, label: '1–2 years' },
            { id: 2, label: '3–6 years' },
            { id: 3, label: '7 > 9 years' },
          ],
        },

        {
          id: 'toler',
          label: 'If the market drops 20%, what would you do?',
          sub: 'Understanding your reaction to risk.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 0, label: 'Sell everything', emoji: '💸' },
            { id: 1, label: 'Sell part of it', emoji: '📉' },
            { id: 2, label: 'Hold my investment', emoji: '🛡️' },
            { id: 3, label: 'Invest more', emoji: '🚀' },
          ],
        },

        {
          id: 'liq',
          label: 'How important is immediate access to this money?',
          sub: 'Liquidity affects long-term investing capacity.',
          type: 'options',
          options: [
            { id: 0, label: 'Very important' },
            { id: 1, label: 'Somewhat important' },
            { id: 2, label: 'Slightly important' },
            { id: 3, label: 'Not important' },
          ],
        },

        {
          id: 'estab',
          label: 'How stable is your current income?',
          sub: 'Stable income allows higher volatility.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 0, label: 'Very unstable', emoji: '⚠️' },
            { id: 1, label: 'Unstable', emoji: '📉' },
            { id: 2, label: 'Stable', emoji: '📈' },
            { id: 3, label: 'Very stable', emoji: '💎' },
          ],
        },

        {
          id: 'crip',
          label: 'Include cryptocurrencies?',
          sub: 'Digital assets in your portfolio.',
          type: 'options',
          options: [
            { id: 0, label: 'No' },
            { id: 1, label: 'Indifferent' },
            { id: 2, label: 'Yes' },
          ],
        },
      ],

      financial: {
        title: 'Investment Plan',
        initialLabel: 'Initial capital',
        initialSub: 'Amount to invest today.',
        monthlyLabel: 'Periodic contribution',
        monthlySub: 'Recurring savings amount.',
        frequencyLabel: 'Frequency',
        weekly: 'Weekly',
        monthly: 'Monthly',
        annual: 'Annual',
        horizonLabel: 'Years to goal',
        horizonSub: 'How long will you stay invested?',
        yearsUnit: 'years',
        returnLabel: 'Return (%)',
        futureValueLabel: 'Estimated future value',
        investedLabel: 'Invested amount',
        growthLabel: 'Yield / Growth',
        savePlan: 'Save Investment Plan',
        generateSim: 'Generate Full Simulation',
        portfolio: 'Portfolio',
        capital: 'Capital',
      },
    },

    results: {
      title: 'Your GFinance Plan',
      allocation: 'Asset Allocation',
      RV: 'Stocks (Equities)',
      RF: 'Bonds (Fixed Income)',
      Cash: 'Cash',
      Crypto: 'Crypto',
      scenarios: 'Projection',
      scenarios_title: 'Projection for {{years}} years',
      growthChart: 'Growth Projection',
      conservative: 'Conservative',
      base: 'Base',
      optimistic: 'Optimistic',
      save: 'Save Plan',
      saved: '✓ Saved',
      new: 'New Plan',
      notesTitle: 'Profile Adjustments',
    },

    saved: {
      title: 'Saved Plans',
      empty: 'No saved plans yet.',
      delete: 'Delete',
      viewDetails: 'View Details',
      profile: 'Profile',
      defaultPlanTitle: 'My Financial Plan',
    },

    settings: {
      title: 'Settings',
      preferences: 'Preferences',
      language: 'Language',
      logout: 'Logout',
    },
  },
  es: {
    ChangeLanguage: 'Cambiar idioma',
    financialCalculator: 'Calculadora Financiera',

    splash: {
      tagline: 'Tu futuro financiero,\nsimplificado.',
      subtitle:
        'Responde algunas preguntas y obtén tu\nplan financiero personalizado en minutos.',
      cta: 'Empezar mi plan',
      saved: 'Ver planes guardados',
    },

    questions: {
      title: 'Tu Perfil',
      subtitle:
        'Tus respuestas confidenciales se guardan solo en tu dispositivo.',
      next: 'Siguiente',
      calculate: 'Ver mi plan',

      profile: [
        {
          id: 'horiz',
          label: '¿En cuántos años necesitarás el dinero?',
          sub: 'Horizonte estimado de inversión.',
          type: 'options',
          options: [
            { id: 0, label: '< 1 año' },
            { id: 1, label: '1–2 años' },
            { id: 2, label: '3–7 años' },
            { id: 3, label: '> 7 años' },
          ],
        },

        {
          id: 'toler',
          label: 'Si el mercado cae un 20%, ¿qué harías?',
          sub: 'Comprender tu respuesta ante el riesgo.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 0, label: 'Vender todo', emoji: '💸' },
            { id: 1, label: 'Vender una parte', emoji: '📉' },
            { id: 2, label: 'Mantener mi inversión', emoji: '🛡️' },
            { id: 3, label: 'Invertir más', emoji: '🚀' },
          ],
        },

        {
          id: 'liq',
          label: '¿Qué importancia tiene el acceso inmediato a este capital?',
          sub: 'La liquidez influye en tu capacidad a largo plazo.',
          type: 'options',
          options: [
            { id: 0, label: 'Mucha' },
            { id: 1, label: 'Bastante' },
            { id: 2, label: 'Poca' },
            { id: 3, label: 'Ninguna' },
          ],
        },

        {
          id: 'estab',
          label: '¿Cómo de estables son tus ingresos actuales?',
          sub: 'Unos ingresos estables permiten mayor volatilidad.',
          type: 'options',
          bigOptions: true,
          options: [
            { id: 0, label: 'Inestables', emoji: '⚠️' },
            { id: 1, label: 'Variables', emoji: '📉' },
            { id: 2, label: 'Estables', emoji: '📈' },
            { id: 3, label: 'Muy seguros', emoji: '💎' },
          ],
        },

        {
          id: 'crip',
          label: '¿Quieres incluir criptomonedas?',
          sub: 'Activos digitales en tu cartera.',
          type: 'options',
          options: [
            { id: 0, label: 'No' },
            { id: 1, label: 'Me es indiferente' },
            { id: 2, label: 'Sí' },
          ],
        },
      ],

      financial: {
        title: 'Plan de Inversión',
        initialLabel: 'Capital inicial',
        initialSub: 'Cantidad que invertirás hoy.',
        monthlyLabel: 'Contribución periódica',
        monthlySub: 'Ahorro recurrente para invertir.',
        frequencyLabel: 'Frecuencia de ahorro',
        weekly: 'Semanal',
        monthly: 'Mensual',
        annual: 'Anual',
        horizonLabel: 'Años de inversión',
        horizonSub: '¿Durante cuánto tiempo invertirás?',
        yearsUnit: 'años',
        returnLabel: 'Rentabilidad (%)',
        futureValueLabel: 'Valor futuro estimado',
        investedLabel: 'Capital total aportado',
        growthLabel: 'Ganancias proyectadas',
        savePlan: 'Guardar mi plan',
        generateSim: 'Ver simulación completa',
        portfolio: 'Cartera',
        capital: 'Capital',
      },
    },

    results: {
      title: 'Tu Estrategia',
      allocation: 'Distribución de Activos',
      RV: 'Renta Variable (Acciones)',
      RF: 'Renta Fija (Bonos)',
      Cash: 'Efectivo / Liquidez',
      Crypto: 'Criptoactivos',
      scenarios: 'Resultados estimados',
      scenarios_title: 'Proyección a {{years}} años',
      growthChart: 'Proyección de crecimiento',
      conservative: 'Conservador',
      base: 'Base',
      optimistic: 'Optimista',
      save: 'Guardar Plan',
      saved: '✓ Guardado correctamente',
      new: 'Crear nuevo plan',
      notesTitle: 'Ajustes del Perfil',
    },

    saved: {
      title: 'Planes guardados',
      empty: 'Aún no has guardado ningún plan.',
      delete: 'Eliminar',
      viewDetails: 'Ver Detalles',
      profile: 'Perfil',
      defaultPlanTitle: 'Mi Plan Financiero',
    },

    settings: {
      title: 'Ajustes',
      preferences: 'Preferencias',
      language: 'Idioma',
      logout: 'Cerrar sesión',
    },
  },
};

const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.locale = 'es';

export default i18n;