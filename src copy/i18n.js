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
          type: 'numeric',
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
        investment: 'Investment',
        mortgage: 'Mortgage',
        savings: 'Savings',
        totalPaid: 'Total paid',
        totalInterest: 'Total interest',
      },
      buildPlan: "Let's build your plan",
      investmentData: 'Investment Data',
      manualCalculatorBtn: 'Manual Calculator (Excel Style)',
    },

    manualCalculator: {
      screenTitle: 'Portfolio Calculator',
      configTitle: 'Configuration',
      initialCapital: 'Initial Capital (€)',
      periodicContribution: 'Periodic Contribution (€)',
      weightsTitle: 'Portfolio Weights',
      total: 'Total',
      cagrNeutral: 'Portfolio CAGR (Neutral)',
      projectionTitle: 'Projection per Scenario',
      years: 'Years',
      vfPessimistic: 'Pessimistic FV',
      vfNeutral: 'Neutral FV',
      vfOptimistic: 'Optimistic FV',
      cagrN: 'CAGR N.',
    },

    results: {
      investorProfile: 'Investor Profile',
      title: 'Your GFinance Plan',
      allocation: 'Asset Allocation',
      RV: 'Stocks (Equities)',
      RF: 'Bonds (Fixed Income)',
      Cash: 'Cash',
      Crypto: 'Crypto',
      scenarios: 'Continue',
      scenarios_title: 'Projection for {{years}} years',
      growthChart: 'Growth Projection',
      conservative: 'Pessimistic',
      base: 'Neutral',
      optimistic: 'Optimistic',
      save: 'Save Plan',
      saved: '✓ Saved',
      new: 'New Plan',
      notesTitle: 'Profile Adjustments',
      typeOfInvestor: 'Investor Type',
      recommendedAllocation: 'Recommended Allocation',
      futureValueScenarios: 'Future value by scenarios',
      savePlanBtn: 'Save Plan',
      newPlanBtn: 'New Plan',
      modalTitle: 'Save Plan',
      modalSub: 'Give your investment plan a name.',
      modalPlaceholder: 'Plan Name',
      modalCancel: 'Cancel',
      modalSave: 'Save',
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
      equity: {
        title: 'Equities (RV)',
        desc: 'Investment in company shares. Historically offers highest long-term growth but with price fluctuations (volatility).',
      },
      fixed_income: {
        title: 'Fixed Income (RF)',
        desc: 'Loans to governments or companies (bonds). Provides steady interest payments and capital protection.',
      },
      tae: {
        title: 'Yield/Interest',
        desc: 'The annual percentage return generated by your cash or savings.',
      },
      crypto: {
        title: 'Cryptocurrencies',
        desc: 'Digital assets like Bitcoin. High growth potential but with extreme volatility and risk.',
      },
      horizon: {
        title: 'Investment Horizon',
        desc: 'The total time you plan to keep your money invested before needing it.',
      },
      amortization: {
        title: 'French Amortization',
        desc: 'A system where your monthly payment remains constant while interest and principal balance shift over time.',
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
          type: 'numeric',
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
        monthlySub: 'Aportaciones recurrentes para invertir.',
        frequencyLabel: 'Frecuencia de Aportaciones',
        weekly: 'Semanal',
        monthly: 'Mensual',
        annual: 'Anual',
        horizonLabel: 'Horizonte de inversión',
        horizonSub: '¿Durante cuánto tiempo invertirás?',
        yearsUnit: 'años',
        returnLabel: 'Rentabilidad (%)',
        futureValueLabel: 'Valor futuro estimado',
        investedLabel: 'Total Aportado',
        growthLabel: 'Intereses estimados',
        savePlan: 'Guardar mi plan',
        generateSim: 'Ver simulación completa',
        portfolio: 'Cartera',
        capital: 'Capital',
        investment: 'Inversión',
        mortgage: 'Hipoteca',
        savings: 'Aportaciones',
        totalPaid: 'Total a pagar',
        totalInterest: 'Intereses totales',
      },
      buildPlan: 'Construyamos tu plan',
      investmentData: 'Datos de inversión',
      manualCalculatorBtn: 'Calculadora Manual (Estilo Excel)',
    },

    manualCalculator: {
      screenTitle: 'Calculadora de Portafolio',
      configTitle: 'Configuración',
      initialCapital: 'Capital Inicial (€)',
      periodicContribution: 'Aportación Periódica (€)',
      weightsTitle: 'Pesos de la Cartera',
      total: 'Total',
      cagrNeutral: 'CAGR Portafolio (Neutral)',
      projectionTitle: 'Proyección por Escenario',
      years: 'Años',
      vfPessimistic: 'VF Pesimista',
      vfNeutral: 'VF Neutral',
      vfOptimistic: 'VF Optimista',
      cagrN: 'CAGR N.',
    },

    results: {
      investorProfile: 'Perfil de inversor',
      title: 'Tu Estrategia',
      allocation: 'Distribución de Activos',
      RV: 'Renta Variable (Acciones)',
      RF: 'Renta Fija (Bonos)',
      Cash: 'Efectivo / Liquidez',
      Crypto: 'Criptoactivos',
      scenarios: 'Continuar',
      scenarios_title: 'Proyección a {{years}} años',
      growthChart: 'Proyección de crecimiento',
      conservative: 'Pesimista',
      base: 'Neutral',
      optimistic: 'Optimista',
      save: 'Guardar Plan',
      saved: '✓ Guardado correctamente',
      new: 'Crear nuevo plan',
      notesTitle: 'Ajustes del Perfil',
      typeOfInvestor: 'Tipo de inversor',
      recommendedAllocation: 'Asignación recomendada',
      futureValueScenarios: 'Valor futuro según escenarios',
      savePlanBtn: 'Guardar plan',
      newPlanBtn: 'Nuevo plan',
      modalTitle: 'Guardar plan',
      modalSub: 'Ponle un nombre a tu plan de inversión.',
      modalPlaceholder: 'Nombre del plan',
      modalCancel: 'Cancelar',
      modalSave: 'Ahorrar',
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
      rf: {
        title: 'Renta Fija',
        desc: '¿Qué es?\nPrestas tu dinero a un gobierno o empresa y te pagan intereses por ello.\n\nLo importante:\nSuelen ser más estables que las acciones.\nSabes cuánto te pagarán (si todo va bien).\nLa rentabilidad normalmente es moderada.\n\nRiesgo:\nQue quien te debe el dinero tenga problemas o que suban los tipos de interés.\n\n👉 Sirve para dar estabilidad y equilibrio a tu cartera.'
      },
      rv: {
        title: 'Renta Variable',
        desc: '¿Qué es?\nCompras una parte de una empresa (acciones).\n\nLo importante:\nPuede subir mucho… y también bajar.\nA largo plazo suele ser la que más rentabilidad ofrece.\nEs más volátil que la renta fija.\n\nRiesgo:\nLas empresas pueden ganar menos dinero o atravesar momentos difíciles.\n\n👉 Es la parte que impulsa el crecimiento de tu cartera.'
      },
      crypto: {
        title: 'Criptomonedas',
        desc: '¿Qué es?\nActivos digitales que funcionan sin bancos, gracias a la tecnología blockchain.\n\nLo importante:\nMovimientos de precio muy rápidos.\nMercado abierto 24/7.\nPotencial alto… con riesgo alto.\n\nRiesgo:\nGran volatilidad y cambios regulatorios.\n\n👉 Se suelen usar en pequeñas proporciones dentro de una cartera diversificada.'
      },
      cash: {
        title: 'Cash',
        desc: '¿Qué es?\nDinero en efectivo o en cuenta bancaria.\n\nLo importante:\nNo fluctúa prácticamente.\nDisponible en cualquier momento.\nRentabilidad baja.\n\nRiesgo:\nPierde poder adquisitivo con la inflación.\n\n👉 Es tu colchón de seguridad y liquidez inmediata.'
      },
      initial_investment: {
        title: 'Inversión inicial',
        desc: '¿Qué es?\nEl dinero con el que empiezas a invertir desde el principio.\n\nLo importante:\nEs la base sobre la que crecerá tu inversión.\nCuanto mayor sea, más efecto tendrá el interés compuesto.\n\n👉 Es el punto de partida de tu plan.'
      },
      periodic_contributions: {
        title: 'Contribuciones periódicas',
        desc: '¿Qué es?\nEl dinero que vas añadiendo a tu inversión de forma regular.\n\nLo importante:\nPuede ser semanal, mensual o anual.\nAyuda a hacer crecer tu dinero poco a poco.\nReduce el impacto de entrar en mal momento.\n\n👉 Es la clave para construir patrimonio con el tiempo.'
      },
      contribution_frequency: {
        title: 'Frecuencia de aportaciones',
        desc: '¿Qué es?\nCada cuánto tiempo haces esas contribuciones.\n\nLo importante:\nPuede ser semanal, mensual o anual.\nCuanto más frecuente, más constante será el crecimiento.\n\n👉 Define el ritmo al que inviertes.'
      },
      estimated_scenarios: {
        title: 'Valor estimado según escenarios',
        desc: '¿Qué es?\nUna estimación de cuánto podría valer tu inversión en distintos escenarios.\n\nLo importante:\nMuestra diferentes resultados según cómo se comporte el mercado.\nNormalmente incluye:\nEscenario conservador: crecimiento bajo.\nEscenario medio: crecimiento esperado.\nEscenario optimista: crecimiento alto.\nTe ayuda a entender posibles resultados, no solo uno.\n\nRiesgo:\nSon simulaciones, el resultado real puede ser diferente.\n\n👉 Te permite ver distintos caminos que puede tomar tu inversión.'
      },
      results_growth_projection: {
        title: 'Proyección de crecimiento',
        desc: '¿Qué es?\nUna estimación de cómo podría evolucionar tu inversión a lo largo del tiempo.\n\nLo importante:\nMuestra el crecimiento durante el horizonte de inversión.\nIncluye tres escenarios:\nOptimista (violeta): crecimiento por encima de lo esperado.\nNeutral (verde): crecimiento medio estimado.\nPesimista (rojo): crecimiento más bajo o periodos difíciles.\nTe permite comparar distintos posibles resultados.\n\nRiesgo:\nSon simulaciones basadas en supuestos, el resultado real puede variar.\n\n👉 Te ayuda a entender cómo puede comportarse tu inversión en diferentes situaciones de mercado.'
      },
      return_pct: {
        title: 'Rentabilidad (%)',
        desc: '¿Qué es?\nEl rendimiento anual que esperas obtener de tu inversión.\n\nLo importante:\nEs una estimación, no está garantizada.\nCuanto mayor sea, mayor crecimiento… pero normalmente más riesgo.\n\n👉 Determina cuánto puede crecer tu dinero.'
      },
      investment_horizon: {
        title: 'Horizonte de inversión',
        desc: '¿Qué es?\nEl tiempo durante el cual mantendrás tu inversión.\n\nLo importante:\nSe mide en años.\nA mayor plazo, más capacidad de asumir riesgo.\nEl tiempo potencia el interés compuesto.\n\n👉 Es uno de los factores más importantes al invertir.'
      },
      estimated_future_value: {
        title: 'Valor futuro estimado',
        desc: '¿Qué es?\nEl dinero total que podrías tener al final del periodo.\n\nLo importante:\nIncluye tu inversión inicial + aportaciones + rentabilidad.\nEs una estimación basada en los datos que introduces.\n\n👉 Te da una idea de hasta dónde puede llegar tu inversión.'
      },
      calculator_growth_projection: {
        title: 'Proyección de crecimiento',
        desc: '¿Qué es?\nEs una estimación de cómo podría evolucionar tu dinero a lo largo del tiempo.\n\nLo importante:\nMuestra el crecimiento año a año.\nIncluye dos líneas:\nInversión (verde): tu dinero creciendo con rentabilidad.\nAhorro (amarillo): lo que tendrías solo guardando el dinero, sin invertir.\nTe permite comparar la diferencia entre invertir y no hacerlo.\n\nRiesgo:\nEs solo una estimación, el resultado real puede ser diferente.\n\n👉 Te ayuda a entender cuánto puede marcar la diferencia invertir a largo plazo'
      },
      loan_amount: {
        title: 'Importe del préstamo',
        desc: '¿Qué es?\nEl dinero que te presta el banco.\n\nLo importante:\nEs la cantidad sobre la que pagarás intereses.\nCuanto mayor sea, mayor será la cuota.\n\n👉 Es la base de tu hipoteca o préstamo.'
      },
      annual_interest_rate: {
        title: 'Tasa de interés anual (TAE %)',
        desc: '¿Qué es?\nEl coste real del préstamo expresado en porcentaje anual.\n\nLo importante:\nIncluye intereses y otros costes.\nSirve para comparar préstamos fácilmente.\nCuanto más alta, más caro te sale el préstamo.\n\n👉 Determina cuánto pagarás por pedir dinero prestado.'
      },
      loan_term_years: {
        title: 'Plazo del préstamo (Años)',
        desc: '¿Qué es?\nEl tiempo que tienes para devolver el préstamo.\n\nLo importante:\nCuanto más largo, menor cuota mensual… pero más intereses totales.\nCuanto más corto, mayor cuota… pero menos intereses.\n\n👉 Define cómo repartes el pago en el tiempo.'
      },
      monthly_payment_m: {
        title: 'Cuota mensual (M)',
        desc: '¿Qué es?\nEl dinero que pagas cada mes al banco.\n\nLo importante:\nIncluye parte de capital + intereses.\nEs el gasto fijo que tendrás durante el préstamo.\n\n👉 Es lo que impacta directamente en tu día a día.'
      },
      capital_p: {
        title: 'Capital (P)',
        desc: '¿Qué es?\nEl dinero que te presta el banco (importe inicial del préstamo).\n\nLo importante:\nEs la base sobre la que se calculan los intereses.\nVa disminuyendo a medida que pagas cuotas.\n\n👉 Es la deuda pendiente que vas devolviendo poco a poco.'
      },
      months_n: {
        title: 'Meses (n)',
        desc: '¿Qué es?\nEl número total de pagos que vas a realizar.\n\nLo importante:\nDepende del plazo del préstamo.\nSe usa para calcular la cuota mensual.\n\n👉 Marca cuántas veces pagarás al banco.'
      },
      total_to_pay: {
        title: 'Total a pagar',
        desc: '¿Qué es?\nEl dinero total que acabarás pagando al banco.\n\nLo importante:\nIncluye el capital + todos los intereses.\nSuele ser bastante mayor que el importe inicial.\n\n👉 Es el coste real de tu préstamo.'
      },
      total_interest: {
        title: 'Intereses totales',
        desc: '¿Qué es?\nEl dinero extra que pagas por el préstamo.\n\nLo importante:\nEs la diferencia entre lo que recibes y lo que devuelves.\nAumenta cuanto mayor sea el plazo o el tipo de interés.\n\n👉 Es lo que le pagas al banco por prestarte el dinero.'
      },
      monthly_payment_sim: {
        title: 'Pago mensual',
        desc: '¿Qué es?\nEl dinero que pagas cada mes por tu préstamo.\n\nLo importante:\nIncluye una parte de intereses y otra de capital.\nEs el gasto fijo que tendrás durante el plazo.\n\n👉 Es lo que impacta directamente en tu bolsillo cada mes.'
      },
      loan_amount_sim: {
        title: 'Monto del préstamo',
        desc: '¿Qué es?\nEl dinero que te presta el banco al inicio.\n\nLo importante:\nEs la base sobre la que se calculan los intereses.\nEs lo que tendrás que devolver con el tiempo.\n\n👉 Es la cantidad que estás financiando.'
      },
      total_interest_sim: {
        title: 'Intereses totales',
        desc: '¿Qué es?\nEl dinero extra que pagas al banco por el préstamo.\n\nLo importante:\nEs la diferencia entre lo que te prestan y lo que devuelves.\nAumenta con el tiempo y con el tipo de interés.\n\n👉 Es el coste real de financiarte.'
      },
      total_paid_sim: {
        title: 'Total pagado',
        desc: '¿Qué es?\nEl total que habrás pagado al final del préstamo.\n\nLo importante:\nIncluye el capital + todos los intereses.\nSiempre será mayor que el monto del préstamo.\n\n👉 Es lo que realmente te cuesta el préstamo.'
      },
      payment_sim: {
        title: 'Pago',
        desc: '¿Qué es?\nCada una de las cuotas que vas pagando mes a mes.\n\nLo importante:\nSuele ser la misma cantidad cada mes.\nForma parte del total pagado.\n\n👉 Es cada paso del proceso de devolución.'
      },
      interest_sim: {
        title: 'Interés',
        desc: 'La parte de la cuota que corresponde al coste del préstamo.\n\nLo importante:\nAl principio es mayor.\nVa disminuyendo con el tiempo.\n\n👉 Es lo que pagas al banco por prestarte el dinero.'
      },
      principal_sim: {
        title: 'Principal',
        desc: 'La parte de la cuota que reduce tu deuda.\n\nLo importante:\nAl principio es menor.\nVa aumentando con el tiempo.\n\n👉 Es lo que realmente devuelve el dinero prestado.'
      },
      balance_sim: {
        title: 'Balance',
        desc: 'El dinero que aún te queda por pagar del préstamo.\n\nLo importante:\nVa bajando con cada cuota.\nAl final llega a cero.\n\n👉 Es tu deuda pendiente en cada momento.'
      },
      asset_allocation: {
        title: 'Distribución de Activos',
        desc: '¿Qué es?\nEs la forma en que repartes tu dinero entre distintos tipos de inversión (acciones, bonos, efectivo, etc.).\n\nLo importante:\nUna buena distribución reduce el riesgo total.\nSe adapta a tu perfil y objetivos.\nEs el factor más determinante en la rentabilidad a largo plazo.\n\n👉 Es el «mix» que define el comportamiento de tu cartera.'
      }
    },
  },
};

const i18n = new I18n(translations);

i18n.enableFallback = true;
// i18n.locale = __DEV__ ? 'en' : 'es';
i18n.locale = 'es';

export default i18n;