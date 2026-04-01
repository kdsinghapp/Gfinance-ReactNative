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
          id: 'exp',
          label: 'What is your investment experience?',
          sub: 'Prior knowledge helps determine your risk tolerance.',
          type: 'options',
          options: [
            { id: 0, label: 'None' },
            { id: 1, label: 'Basic' },
            { id: 2, label: 'Intermediate' },
            { id: 3, label: 'Advanced' },
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
        initialLabel: 'Initial Investment',
        initialSub: 'Amount to invest today.',
        monthlyLabel: 'Periodic Contributions',
        monthlySub: 'Recurring savings amount.',
        frequencyLabel: 'Frequency',
        weekly: 'Weekly',
        monthly: 'Monthly',
        annual: 'Annual',
        horizonLabel: 'Investment Horizon',
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
      investorProfile: 'Investor Profile',
      title: 'Your GFinance Plan',
      allocation: 'Asset Allocation',
      RV: 'Stocks (Equities)',
      RF: 'Bonds (Fixed Income)',
      Cash: 'Cash',
      Crypto: 'Crypto',
      scenarios: 'Projection',
      scenarios_title: 'Projection for {{years}} years',
      growthChart: 'Growth Projection',
      conservative: 'Pessimistic',
      base: 'Neutral',
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

    definitions: {
      tae: {
        title: 'APR (Annual Percentage Rate)',
        desc: 'The annual cost of borrowing or the annual yield on an investment, including all fees and interests. Use it to compare different financial products.',
      },
      horizon: {
        title: 'Investment Horizon',
        desc: 'The period of time you expect to hold an investment before needing the money back. Longer horizons generally allow for higher risk and potential returns.',
      },
      equity: {
        title: 'Equities (Stocks)',
        desc: 'Ownership in companies. They don\'t have a guaranteed return and prices fluctuate, but historically they offer the highest long-term growth.',
      },
      fixed_income: {
        title: 'Fixed Income (Bonds)',
        desc: 'Loans to governments or corporations. You receive a fixed interest rate. It is more stable than stocks but typically offers lower long-term returns.',
      },
      amortization: {
        title: 'French Amortization',
        desc: 'A system where your monthly payment remains constant. Initially, you pay more interest; over time, more of your payment goes towards the principal.',
      },
      initial_capital: {
        title: 'Initial Investment',
        desc: 'The lump sum amount you invest at the start of your financial plan.',
      },
      contributions: {
        title: 'Periodic Contributions',
        desc: 'The amount of money you save and invest regularly (weekly, monthly, or annually).',
      },
    },
  },
  es: {
    ChangeLanguage: 'Cambiar idioma',
    financialCalculator: 'Calculadora financiera',

    splash: {
      tagline: 'Elabora tu plan financiero en minutos.',
      subtitle:
        'Responde a unas preguntas y obtén una simulación personalizada con tres escenarios.',
      cta: 'Iniciar mi plan',
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
          id: 'exp',
          label: '¿Cuál es tu experiencia inversora?',
          sub: 'El conocimiento previo ayuda a definir tu tolerancia.',
          type: 'options',
          options: [
            { id: 0, label: 'Ninguna' },
            { id: 1, label: 'Básica' },
            { id: 2, label: 'Media' },
            { id: 3, label: 'Avanzada' },
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
        initialLabel: 'Inversión inicial',
        initialSub: 'Cantidad que invertirás hoy.',
        monthlyLabel: 'Contribuciones periódicas',
        monthlySub: 'Ahorro recurrente para invertir.',
        frequencyLabel: 'Frecuencia de ahorro',
        weekly: 'Semanal',
        monthly: 'Mensual',
        annual: 'Anual',
        horizonLabel: 'Horizonte de inversión',
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
      investorProfile: 'Perfil de inversor',
      title: 'Tu Estrategia',
      allocation: 'Distribución de Activos',
      RV: 'Renta Variable (Acciones)',
      RF: 'Renta Fija (Bonos)',
      Cash: 'Efectivo / Liquidez',
      Crypto: 'Criptoactivos',
      scenarios: 'Resultados estimados',
      scenarios_title: 'Proyección a {{years}} años',
      growthChart: 'Proyección de crecimiento',
      conservative: 'Pesimista',
      base: 'Neutral',
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

    definitions: {
      tae: {
        title: 'TAE (Tasa Anual Equivalente)',
        desc: 'Indica el coste o rendimiento real de un producto financiero al año. Incluye intereses y comisiones, lo que permite comparar diferentes opciones fácilmente.',
      },
      horizon: {
        title: 'Horizonte de Inversión',
        desc: 'El tiempo que planeas mantener tu dinero invertido. Un horizonte largo te permite superar caídas temporales del mercado y buscar mayores beneficios.',
      },
      equity: {
        title: 'Renta Variable (Acciones)',
        desc: 'Inversión en empresas donde pasas a ser "socio". No hay rentabilidad garantizada y el precio oscila, pero ofrece el mayor potencial de crecimiento a largo plazo.',
      },
      fixed_income: {
        title: 'Renta Fija (Bonos)',
        desc: 'Préstamos que haces a gobiernos o empresas a cambio de un interés fijo. Es más segura y predecible que las acciones, aunque suele dar menor rentabilidad.',
      },
      amortization: {
        title: 'Amortización Francesa',
        desc: 'Sistema donde pagas una cuota mensual fija. Al principio de la hipoteca pagas más intereses y al final devuelves más capital acumulado.',
      },
      initial_capital: {
        title: 'Capital Inicial',
        desc: 'Cantidad de dinero con la que empiezas tu plan de inversión o el importe total del préstamo solicitado.',
      },
      contributions: {
        title: 'Contribuciones Periódicas',
        desc: 'El ahorro constante que añades a tu plan de inversión cada semana, mes o año para aprovechar el interés compuesto.',
      },
    },
  },
};

const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.locale = 'es';

export default i18n;