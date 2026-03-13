import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import imageIndex from '../../assets/imageIndex';
import ScreenNameEnum from '../../routes/screenName.enum';
import { formatCurrency, futureValue } from '../../engine/calculator';
import i18n from '../../i18n';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const frequencyOptions = [
  { label: 'Weekly', value: 'weekly', mult: 52 },
  { label: 'Monthly', value: 'monthly', mult: 12 },
  { label: 'Annual', value: 'annual', mult: 1 },
];

const Graph = ({ portfolioData, capitalData }: { portfolioData: number[], capitalData: number[] }) => {
  const width = SCREEN_WIDTH - 64;
  const height = 180;
  const padding = 20;

  const maxValue = Math.max(...portfolioData, ...capitalData, 1);

  const getX = (index: number) => {
    return padding + (index * (width - padding * 2)) / (portfolioData.length - 1);
  };

  const getY = (value: number) => {
    if (!isFinite(value) || !isFinite(maxValue) || maxValue === 0) return height - padding;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return isFinite(y) ? y : height - padding;
  };

  const buildSmoothPath = (data: number[]) => {
    if (data.length < 2) return '';

    const startX = getX(0);
    const startY = getY(data[0]);
    if (!isFinite(startX) || !isFinite(startY)) return '';

    let path = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i]);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1]);

      if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) continue;

      const cp1x = x1 + (x2 - x1) / 2;
      const cp1y = y1;
      const cp2x = x1 + (x2 - x1) / 2;
      const cp2y = y2;

      if (!isFinite(cp1x) || !isFinite(cp1y) || !isFinite(cp2x) || !isFinite(cp2y)) {
        path += ` L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      } else {
        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }
    }
    return path;
  };

  const labels = [0, 1, 2, 3];

  return (
    <View style={styles.graphCard}>
      <Text style={styles.sectionTitle}>{i18n.t('results.growthChart')}</Text>

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="fillP" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#39C98D" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#39C98D" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {labels.map((_, i) => {
          const y = padding + (i * (height - padding * 2)) / (labels.length - 1);
          return (
            <Line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth="1"
            />
          );
        })}

        <Path
          d={buildSmoothPath(portfolioData)}
          fill="none"
          stroke="#39C98D"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d={buildSmoothPath(capitalData)}
          fill="none"
          stroke="#F5A46C"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <Circle
          cx={getX(portfolioData.length - 1)}
          cy={getY(portfolioData[portfolioData.length - 1])}
          r="4"
          fill="#39C98D"
          stroke="#FFF"
          strokeWidth={1}
        />
        <Circle
          cx={getX(capitalData.length - 1)}
          cy={getY(capitalData[capitalData.length - 1])}
          r="4"
          fill="#F5A46C"
          stroke="#FFF"
          strokeWidth={1}
        />
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#39C98D' }]} />
          <Text style={styles.legendText}>{i18n.t('questions.financial.portfolio')}</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F5A46C' }]} />
          <Text style={styles.legendText}>{i18n.t('questions.financial.capital')}</Text>
        </View>
      </View>
    </View>
  );
};

const FinancialCalculatorScreen = () => {
  const navigation = useNavigation<any>();

  const [capital, setCapital] = useState('');
  const [contribution, setContribution] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [returnRate, setReturnRate] = useState('');
  const [years, setYears] = useState('');

  const { fv, invested, growth, gainPct, portfolioPoints, capitalPoints } = useMemo(() => {
    const cap = parseFloat(capital) || 0;
    const cont = parseFloat(contribution) || 0;
    const rawRate = parseFloat(returnRate) || 0;
    const annualRate = (Math.min(rawRate, 1000) || 0) / 100;
    const rawYears = parseInt(years) || 0;
    const horizon = Math.min(rawYears, 100);
    const mults: any = { weekly: 52, monthly: 12, annual: 1 };
    const m = mults[frequency] || 12;
    const freq = frequency as 'weekly' | 'monthly' | 'annual';

    const r = annualRate / m;
    const n = horizon * m;

    const finalValue = futureValue(cap, cont, annualRate, horizon, freq);
    const totalInvested = cap + (cont * n);
    const totalGrowth = finalValue - totalInvested;
    const pct = totalInvested > 0 ? (totalGrowth / totalInvested) * 100 : 0;

    // Generate path points (8 steps)
    const pPoints: number[] = [];
    const cPoints: number[] = [];
    for (let i = 0; i <= 7; i++) {
      const stepYears = (i / 7) * horizon;
      const v = futureValue(cap, cont, annualRate, stepYears, freq);
      const inv = cap + (cont * stepYears * m);

      pPoints.push(v);
      cPoints.push(inv);
    }

    return {
      fv: finalValue,
      invested: totalInvested,
      growth: totalGrowth,
      gainPct: pct,
      portfolioPoints: pPoints,
      capitalPoints: cPoints
    };
  }, [capital, contribution, frequency, returnRate, years]);

  const ft = i18n.t('questions.financial') as any;
  const isFormValid =
    capital !== '' &&
    contribution !== '' &&
    years !== '' &&
    frequency !== '';
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader />

      <ScrollView
        contentContainerStyle={[styles.container, {
          paddingHorizontal: 15,
        }]}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>{i18n.t('financialCalculator')}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>{ft.initialLabel} $</Text>
          <TextInput
            style={styles.input}
            value={capital}
            onChangeText={setCapital}
            keyboardType="numeric"
            placeholder="10000"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>{ft.monthlyLabel} $</Text>
          <TextInput
            style={styles.input}
            value={contribution}
            onChangeText={setContribution}
            keyboardType="numeric"
            placeholder="500"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>{ft.frequencyLabel}</Text>
          <View style={styles.tabRow}>
            {frequencyOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.tabButton, frequency === opt.value && styles.activeTabButton]}
                onPress={() => setFrequency(opt.value)}
              >
                <Text style={[styles.tabText, frequency === opt.value && styles.activeTabText]}>
                  {ft[opt.value] || opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{ft.horizonLabel}</Text>
              <TextInput
                style={styles.input}
                value={years}
                onChangeText={setYears}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{ft.returnLabel}</Text>
              <TextInput
                style={styles.input}
                value={returnRate}
                onChangeText={setReturnRate}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{ft.futureValueLabel}</Text>
          <View style={styles.resultTopRow}>
            <Text
              style={styles.resultValue}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatCurrency(fv)}
            </Text>
            {/* <View style={styles.gainBadge}>
              <Text style={styles.gainBadgeText}>+ {gainPct.toFixed(0)} Year</Text>
            </View> */}
            <View style={styles.gainBadge}>
              <Text style={styles.gainBadgeText}>
                {Math.round(gainPct)}  Year
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.amountTitle}>{ft.investedLabel}</Text>
              <Text style={styles.amountValue} adjustsFontSizeToFit numberOfLines={1}>
                {formatCurrency(invested)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.amountTitle}>{ft.growthLabel}</Text>
              <Text style={[styles.amountValue, { color: '#39C98D' }]} adjustsFontSizeToFit numberOfLines={1}>
                + {formatCurrency(growth)}
              </Text>
            </View>
          </View>
        </View>

        <Graph portfolioData={portfolioPoints} capitalData={capitalPoints} />

        <View style={{ gap: 12, marginTop: 20 }}>
          {/* <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>{ft.savePlan}</Text>
              <View style={styles.checkIcon}>
                 <Text style={{color:'#FFF', fontSize: 10}}>✓</Text>
              </View>
            </TouchableOpacity> */}

          <TouchableOpacity
            style={[
              styles.button,
              { opacity: isFormValid ? 1 : 0.5 }  // disabled hone par fade effect
            ]}
            disabled={!isFormValid}
            onPress={() =>
              navigation.navigate(ScreenNameEnum.FinanShare, {
                quiz: { raw: {} },
                financialData: {
                  capital: parseFloat(capital) || 0,
                  monthly: parseFloat(contribution) || 0,
                  frequency: frequency,
                  horizon: parseFloat(years) || 1,
                  returnRate: returnRate ,
                  gainPct:  gainPct  ,
                  growth: growth,
                  invested: invested ,
                  fv: fv
                  
                },
              })
            }
          >
            <Text style={styles.buttonText}>Generar simulación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinancialCalculatorScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingBottom: 40 },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
  },
  tabRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  tabButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: { backgroundColor: '#000' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  resultLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  resultTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultValue: { fontSize: 32, fontWeight: '900', color: '#111' },
  gainBadge: { backgroundColor: '#39C98D', paddingHorizontal: 10, height: 26, borderRadius: 13, justifyContent: 'center' },
  gainBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  amountTitle: { fontSize: 11, color: '#94A3B8', marginBottom: 4, fontWeight: '700' },
  amountValue: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  graphCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  sectionTitle: { width: '100%', fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 15 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  button: {
    backgroundColor: 'black',
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  saveBtn: {
    backgroundColor: '#39C98D',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});