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
import { formatCurrency, futureValue } from '../../engine/calculator';
import i18n from '../../i18n';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvestmentGraph from '../../compoent/InvestmentGraph';
import font from '../../theme/font';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const frequencyOptions = [
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
];

const FinancialCalculatorScreen = () => {
  const navigation = useNavigation<any>();

  const [capital, setCapital] = useState('');
  const [contribution, setContribution] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'annual'>('annual');
  const [returnRate, setReturnRate] = useState('');
  const [years, setYears] = useState('');

  const { fv, invested, growth, gainPct, portfolioPoints, capitalPoints } = useMemo(() => {
    const cap = parseFloat(capital) || 0;
    const cont = parseFloat(contribution) || 0;
    const rawYears = parseInt(years, 10) || 0;
    const horizon = Math.max(1, Math.min(rawYears, 100));

    const annualRate = (parseFloat(returnRate) || 0) / 100;
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

  const ft = (i18n.t('questions.financial') as any) || {};
  const isFormValid =
    capital !== '' &&
    contribution !== '' &&
    years !== '' &&
    returnRate !== '' &&
    frequency;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.screenTitle}>Financial Calculator</Text>

        <View style={styles.mainCard}>
          <Text style={styles.label}>
            {ft.initialLabel || 'Initial Capital'}
          </Text>
          <TextInput
            style={styles.input}
            value={capital}
            onChangeText={setCapital}
            keyboardType="numeric"
            placeholder="10000"
            placeholderTextColor="#B8B8B8"
          />

          <Text style={styles.label}>
            {ft.monthlyLabel || 'Periodic Contribution'}
          </Text>
          <TextInput
            style={styles.input}
            value={contribution}
            onChangeText={setContribution}
            keyboardType="numeric"
            placeholder="300"
            placeholderTextColor="#B8B8B8"
          />

          <Text style={styles.label}>
            {ft.frequencyLabel || 'Contribution Frequency'}
          </Text>

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
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      active && styles.frequencyButtonTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            {ft.returnLabel || 'Expected Return (%)'}
          </Text>
          <TextInput
            style={styles.input}
            value={returnRate}
            onChangeText={setReturnRate}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor="#B8B8B8"
          />

          <Text style={styles.label}>
            {ft.horizonLabel || 'Horizon (Years)'}
          </Text>
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
                <Text style={styles.resultInfoValue}>
                  {formatCurrency(invested)}
                </Text>
              </View>

              <View style={styles.resultInfoBlock}>
                <Text style={styles.resultInfoLabel}>Estimated Interest</Text>
                <Text style={[styles.resultInfoValue, { color: '#111111' }]}>
                  +{formatCurrency(growth)}
                </Text>
              </View>
            </View>
          </View>

          <InvestmentGraph
            portfolioData={portfolioPoints}
            capitalData={capitalPoints}
            years={parseInt(years, 10) || 1}
          />

        </View>

        {/* <TouchableOpacity
          style={[
            styles.generateButton,
            { opacity: isFormValid ? 1 : 0.5 }
          ]}
          disabled={!isFormValid}
          onPress={() =>
            navigation.navigate(ScreenNameEnum.FinanShare, {
              financialData: {
                capital: parseFloat(capital) || 0,
                monthly: parseFloat(contribution) || 0,
                frequency: frequency,
                horizon: parseFloat(years) || 1,
                returnRate: returnRate,
                gainPct: gainPct,
                growth: growth,
                invested: invested,
                fv: fv
              },
            })
          }
        >
          <Text style={styles.generateButtonText}>Generar simulación</Text>
        </TouchableOpacity> */}
      </ScrollView>
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
    marginBottom: 20,
    fontFamily: font.PoppinsBold
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

  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
    marginTop: 10,
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

  graphCard: {
    backgroundColor: '#F7F8F8',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop: 14,
    borderColor: '#ECECEC',
    alignItems: 'center',
  },

  graphTitle: {
    width: '100%',
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
    paddingHorizontal: 6,
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 4,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    marginRight: 6,
  },

  legendText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '500',
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
    fontWeight: '700',
  },
});