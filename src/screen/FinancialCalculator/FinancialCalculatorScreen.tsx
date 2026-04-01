import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';
import ScreenNameEnum from '../../routes/screenName.enum';
import { 
  formatCurrency, 
  futureValue, 
  calculateMortgagePayment, 
  generateAmortizationTable, 
  formatFullCurrency,
  parseLocaleNumber 
} from '../../engine/calculator';
import InfoModal from '../../compoent/InfoModal';
import i18n from '../../i18n';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvestmentGraph from '../../compoent/InvestmentGraph';
import font from '../../theme/font';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const frequencyOptions = [
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
];

const FinancialCalculatorScreen = () => {
  const navigation = useNavigation<any>();

  const [mode, setMode] = useState<'investment' | 'mortgage'>('mortgage');

  // Investment States
  const [capital, setCapital] = useState('');
  const [contribution, setContribution] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'annual'>('annual');
  const [returnRate, setReturnRate] = useState('');
  const [years, setYears] = useState('');

  // Mortgage States
  const [loanAmount, setLoanAmount] = useState('');
  const [mortgageRate, setMortgageRate] = useState('');
  const [mortgageYears, setMortgageYears] = useState('');

  // Info Modal State
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', desc: '' });

  const showInfo = (key: string) => {
    const defs = (i18n.t('definitions') as any) || {};
    if (defs[key]) {
      setInfoContent(defs[key]);
      setInfoVisible(true);
    }
  };

  const investmentResults = useMemo(() => {
    const cap = parseLocaleNumber(capital);
    const cont = parseLocaleNumber(contribution);
    const rawYears = parseInt(years, 10) || 0;
    const horizon = Math.max(1, Math.min(rawYears, 100));

    const annualRate = parseLocaleNumber(returnRate) / 100;
    const mults = { weekly: 52, monthly: 12, annual: 1 };
    const m = mults[frequency] || 12;
    const n = horizon * m;

    const finalValue = futureValue(cap, cont, annualRate, horizon, frequency);
    const totalInvested = cap + (cont * n);
    const totalGrowth = finalValue - totalInvested;
    const pct = totalInvested > 0 ? (totalGrowth / totalInvested) * 100 : 0;

    const pPoints: number[] = [];
    const cPoints: number[] = [];

    const steps = 7;
    for (let i = 0; i <= steps; i++) {
      const stepYears = horizon > 0 ? (i / steps) * horizon : 0;
      const v = futureValue(cap, cont, annualRate, stepYears, frequency);
      const inv = cap + cont * stepYears * m;

      pPoints.push(v);
      cPoints.push(inv);
    }

    return {
      fv: finalValue,
      invested: totalInvested,
      growth: totalGrowth,
      gainPct: pct,
      portfolioPoints: pPoints,
      capitalPoints: cPoints,
    };
  }, [capital, contribution, frequency, returnRate, years]);

  const mortgageResults = useMemo(() => {
    const principal = parseLocaleNumber(loanAmount);
    const rate = parseLocaleNumber(mortgageRate);
    const yrs = parseInt(mortgageYears, 10) || 0;

    const payment = calculateMortgagePayment(principal, rate, yrs);
    const table = generateAmortizationTable(principal, rate, yrs);

    const totalPaid = payment * (yrs * 12);
    const totalInterest = totalPaid - principal;

    // Points for graph (subset for performance)
    const points: number[] = [];
    const steps = 7;
    const totalMonths = table.length;

    if (totalMonths > 0) {
      for (let i = 0; i <= steps; i++) {
        const index = Math.min(totalMonths - 1, Math.floor((i / steps) * (totalMonths - 1)));
        points.push(table[index].remainingBalance);
      }
    } else {
      for (let i = 0; i <= steps; i++) points.push(principal);
    }

    return {
      monthlyPayment: payment,
      monthlyRate: rate / 12, // monthly linear rate
      totalInterest: totalInterest,
      totalPaid: totalPaid,
      balancePoints: points,
      amortizationTable: table,
    };
  }, [loanAmount, mortgageRate, mortgageYears]);

  const ft = (i18n.t('questions.financial') as any) || {};

  const isFormValid = mode === 'investment'
    ? (capital !== '' && contribution !== '' && years !== '' && returnRate !== '' && frequency)
    : (loanAmount !== '' && mortgageRate !== '' && mortgageYears !== '');

  const { fv, invested, growth, gainPct, portfolioPoints, capitalPoints } = investmentResults;
  const { monthlyPayment, monthlyRate, totalInterest, totalPaid, balancePoints, amortizationTable } = mortgageResults;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.screenTitle}>
          {mode === 'investment' ? '' : 'Mortgage Calculator'}
          {/* {mode === 'investment' ? 'Investment Calculator' : 'Mortgage Calculator'} */}
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, mode === 'investment' && styles.tabButtonActive]}
            onPress={() => setMode('investment')}
          >
            <Text style={[styles.tabText, mode === 'investment' && styles.tabTextActive]}>Investment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, mode === 'mortgage' && styles.tabButtonActive]}
            onPress={() => setMode('mortgage')}
          >
            <Text style={[styles.tabText, mode === 'mortgage' && styles.tabTextActive]}>Mortgage</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.mainCard, { paddingBottom: 24 }]}>
          {mode === 'investment' ? (
            <>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{ft.initialLabel || 'Initial Capital'}</Text>
                <TouchableOpacity onPress={() => showInfo('initial_capital')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={capital}
                onChangeText={setCapital}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor="#B8B8B8"
              />

              <View style={styles.labelRow}>
                <Text style={styles.label}>{ft.monthlyLabel || 'Periodic Contribution'}</Text>
                <TouchableOpacity onPress={() => showInfo('contributions')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={contribution}
                onChangeText={setContribution}
                keyboardType="numeric"
                placeholder="300"
                placeholderTextColor="#B8B8B8"
              />

              <Text style={styles.label}>{ft.frequencyLabel || 'Contribution Frequency'}</Text>
              <View style={styles.frequencyRow}>
                {frequencyOptions.map((item) => {
                  const active = frequency === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      activeOpacity={0.9}
                      onPress={() => setFrequency(item.value as 'weekly' | 'monthly' | 'annual')}
                      style={[styles.frequencyButton, active && styles.frequencyButtonActive]}
                    >
                      <Text style={[styles.frequencyButtonText, active && styles.frequencyButtonTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.labelRow}>
                <Text style={styles.label}>{ft.returnLabel || 'Expected Return (%)'}</Text>
                <TouchableOpacity onPress={() => showInfo('tae')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={returnRate}
                onChangeText={setReturnRate}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor="#B8B8B8"
              />

              <View style={styles.labelRow}>
                <Text style={styles.label}>{ft.horizonLabel || 'Horizon (Years)'}</Text>
                <TouchableOpacity onPress={() => showInfo('horizon')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor="#B8B8B8"
              />

              <View style={styles.resultCard}>
                <Text style={styles.resultHeaderText}>Estimated Future Value</Text>
                <View style={styles.resultValueRow}>
                  <Text style={styles.resultValue} numberOfLines={1} adjustsFontSizeToFit>
                    {formatCurrency(fv)}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {gainPct > 0 ? `${Math.round(gainPct)}%` : '0%'}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultBottomRow}>
                  <View style={styles.resultInfoBlock}>
                    <Text style={styles.resultInfoLabel}>Total Invested</Text>
                    <Text style={styles.resultInfoValue}>{formatCurrency(invested)}</Text>
                  </View>
                  <View style={styles.resultInfoBlock}>
                    <Text style={styles.resultInfoLabel}>Estimated Interest</Text>
                    <Text style={[styles.resultInfoValue, { color: '#34C759' }]}>+{formatCurrency(growth)}</Text>
                  </View>
                </View>
              </View>

              <InvestmentGraph
                portfolioData={portfolioPoints}
                capitalData={capitalPoints}
                years={parseInt(years, 10) || 1}
              />
            </>
          ) : (
            <>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Importe del préstamo</Text>
                <TouchableOpacity onPress={() => showInfo('initial_capital')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
                placeholder="70000"
                placeholderTextColor="#B8B8B8"
              />

              <View style={styles.labelRow}>
                <Text style={styles.label}>Tasa de interés anual (TAE %)</Text>
                <TouchableOpacity onPress={() => showInfo('tae')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={mortgageRate}
                onChangeText={setMortgageRate}
                keyboardType="numeric"
                placeholder="3.8"
                placeholderTextColor="#B8B8B8"
              />

              <View style={styles.labelRow}>
                <Text style={styles.label}>Plazo del préstamo (Años)</Text>
                <TouchableOpacity onPress={() => showInfo('horizon')}>
                  <Icon name="info-outline" size={18} color="#B8B8B8" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={mortgageYears}
                onChangeText={setMortgageYears}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor="#B8B8B8"
              />

               <View style={[styles.resultCard,]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.resultHeaderText, { color: '#999999' }]}>Pago mensual</Text>
                  <View style={[styles.badge, { backgroundColor: '#5D00DF', minWidth: 65 }]}>
                    <Text style={styles.badgeText}>{monthlyRate.toFixed(2)}% mes</Text>
                  </View>
                </View>
                <View style={styles.resultValueRow}>
                  <Text style={[styles.resultValue,  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {formatFullCurrency(monthlyPayment)}
                  </Text>
                </View>
                <View style={styles.resultBottomRow}>
                  <View style={styles.resultInfoBlock}>
                    <Text style={[styles.resultInfoLabel,  ]}>Total a pagar</Text>
                    <Text style={[styles.resultInfoValue,  ]}>{formatFullCurrency(totalPaid)}</Text>
                  </View>
                  <View style={styles.resultInfoBlock}>
                    <Text style={[styles.resultInfoLabel,  ]}>Intereses totales</Text>
                    <Text style={[styles.resultInfoValue, { color: '#34C759' }]}>{formatFullCurrency(totalInterest)}</Text>
                  </View>
                </View>
              </View>

              <InvestmentGraph
                portfolioData={balancePoints}
                capitalData={new Array(balancePoints.length).fill(0)}
                years={parseInt(mortgageYears, 10) || 1}
              />

              <TouchableOpacity
                style={[styles.generateButton, { marginTop: 24, opacity: isFormValid ? 1 : 0.5 }]}
                disabled={!isFormValid}
                onPress={() => navigation.navigate(ScreenNameEnum.MortgageDetails, {
                  loanAmount,
                  mortgageRate,
                  mortgageYears
                })}
              >
                <Text style={styles.generateButtonText}>Ver el horario completo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>

      <InfoModal
        visible={infoVisible}
        title={infoContent.title}
        description={infoContent.desc}
        onClose={() => setInfoVisible(false)}
      />
    </SafeAreaView>
  );
};

export default FinancialCalculatorScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },

  container: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  screenTitle: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
    marginTop: 6,
    marginBottom: 10,
    fontFamily: font.PoppinsBold
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    marginHorizontal: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  tabButtonActive: {
    backgroundColor: 'white',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  tabText: {
    fontSize: 14,
    fontFamily: font.PoppinsSemiBold,
    color: '#666666',
  },

  tabTextActive: {
    color: 'black',
  },

  mainCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    // iOS Shadow
    shadowColor: '#767676',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Android Shadow
    elevation: 15,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 0,
  },

  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
    marginTop: 0,
    fontFamily: font.PoppinsSemiBold
  },

  input: {
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F7F8F8',
    borderColor: '#ECECEC',
    paddingHorizontal: 14,
    color: 'black',
    fontSize: 15,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  frequencyButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  frequencyButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#111111',
    height: 48,
    borderRadius: 15,
  },

  frequencyButtonText: {
    color: '#111111',
    fontSize: 14,
    fontFamily: font.PoppinsSemiBold,
  },

  frequencyButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: font.PoppinsSemiBold,
  },

  resultCard: {
    backgroundColor: '#F7F8F8',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },

  resultHeaderText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
    marginTop: 5,
    fontFamily: font.PoppinsSemiBold,
  },

  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultValue: {
    flex: 1,
    fontSize: 31,
    fontFamily: font.PoppinsSemiBold,
    color: '#111111',
    marginRight: 12,
  },

  badge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    minWidth: 52,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: font.PoppinsSemiBold,
  },

  resultBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },

  resultInfoBlock: {
    flex: 1,
  },

  resultInfoLabel: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
    fontFamily: font.PoppinsRegular,
  },

  resultInfoValue: {
    fontSize: 15,
    color: '#111111',
    fontWeight: '700',
  },

  generateButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: font.PoppinsBold,
  },
});