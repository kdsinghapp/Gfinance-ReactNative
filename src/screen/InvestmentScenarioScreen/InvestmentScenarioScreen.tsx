import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  ImageSourcePropType,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import i18n from '../../i18n';
import { calculatePlan, formatCurrency } from '../../engine/calculator';
import GrowthChart from '../../compoent/GrowthChart';
import { Storage } from '../../engine/storage';
import { Analytics } from '../../engine/analytics';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import CustomHeader from '../../compoent/CustomHeader';
import { successToast } from '../../utils/customToast';

type RangeKey = '1Y' | '3Y' | '5Y' | '7Y' | '10Y';

const CARD_GAP = 10;

/* ---------------- Main Screen ---------------- */

const InvestmentScenarioScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    quiz = { raw: {} },
    financialData = { horizon: 10, capital: 10000, monthly: 500 },
    type,
  } = route?.params || {};

  const [saved, setSaved] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [planName, setPlanName] = useState('');
  const [selectedRange, setSelectedRange] = useState<RangeKey>('3Y');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const plan = calculatePlan(quiz, financialData);
  const { scenarios } = plan;

  const weights = plan?.weights ?? {};

  const allocation = {
    equities: weights.RV ?? 0,
    fixedIncome: weights.RF ?? 0,
    cash: weights.Cash ?? 0,
    crypto: weights.Crypto ?? 0,
  };

  const fullChartData = useMemo(() => {
    const baseValues = scenarios?.base?.yearlyValues ?? [];
    const conservativeValues = scenarios?.conservative?.yearlyValues ?? [];
    const optimisticValues = scenarios?.optimistic?.yearlyValues ?? [];

    return baseValues.map((val: number, idx: number) => ({
      year: idx + 1,
      label: `Y${idx + 1}`,
      conservative: conservativeValues[idx] ?? 0,
      base: val ?? 0,
      optimistic: optimisticValues[idx] ?? 0,
    }));
  }, [scenarios]);

  const initialPoint = useMemo(() => {
    const initialValue = Number(financialData?.capital ?? 0);

    return {
      year: 0,
      label: 'Start',
      conservative: initialValue,
      base: initialValue,
      optimistic: initialValue,
    };
  }, [financialData]);

  const chartData = useMemo(() => {
    const rangeMap: Record<RangeKey, number> = {
      '1Y': 1,
      '3Y': 3,
      '5Y': 5,
      '7Y': 7,
      '10Y': 10,
    };

    const maxYears = rangeMap[selectedRange];
    const safeChartData = fullChartData ?? [];
    const sliced = safeChartData.slice(0, Math.min(maxYears, safeChartData.length));

    return [initialPoint, ...sliced];
  }, [fullChartData, selectedRange, initialPoint]);

  const totalPortfolioValue = scenarios?.base?.finalValue ?? 0;

  useEffect(() => {
    Analytics.resultsViewed(plan?.weights, scenarios);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, plan?.weights, scenarios]);

  const handleSave = async () => {
    if (!planName.trim()) {
      setSaveModalVisible(true);
      return;
    }

    const ok = await Storage.savePlan({
      name: planName,
      answers: { ...quiz.raw, ...financialData },
      allocation: plan?.weights,
      scenarios: {
        years: financialData?.horizon,
        base: scenarios?.base?.finalValue,
        conservative: scenarios?.conservative?.finalValue,
        optimistic: scenarios?.optimistic?.finalValue,
      },
      chartData: fullChartData,
    });

    if (ok) {
      successToast('Plan agregado correctamente', 'El plan ha sido guardado.', 2000);
      setSaved(true);
      setSaveModalVisible(false);
      Analytics.planSaved();
      navigation.navigate(ScreenNameEnum.SavedPlansScreen);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <CustomHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Allocation Card */}
          <View style={[styles.card, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Asignación recomendada</Text>

            <AllocationRing
              allocation={allocation}
              totalValue={formatCurrency(totalPortfolioValue)}
            />
          </View>

          {/* Scenario Cards */}
          <View style={styles.metricsRow}>
            <MetricCard
              icon={imageIndex.Conservative}
              label={i18n.t('results.conservative')}
              value={formatCurrency(scenarios?.conservative?.finalValue ?? 0)}
            />
            <MetricCard
              icon={imageIndex.Base}
              label={i18n.t('results.base')}
              value={formatCurrency(scenarios?.base?.finalValue ?? 0)}
              active
            />
            <MetricCard
              icon={imageIndex.Optimistic}
              label={i18n.t('results.optimistic')}
              value={formatCurrency(scenarios?.optimistic?.finalValue ?? 0)}
            />
          </View>

          {/* Chart Card */}
          <View style={styles.card}>
            <Text style={styles.chartTitle}>{i18n.t('results.growthChart')}</Text>

            <RangeTabs selected={selectedRange} onSelect={setSelectedRange} />

            <View style={styles.chartWrap}>
              <GrowthChart data={chartData} allocation={allocation} />
            </View>

            <View style={styles.legendRow}>
               <LegendDot label="Equities" color="#3B82F6" />
               <LegendDot label="Fixed Income" color="#22C55E" />
               <LegendDot label="Cash" color="#F59E0B" />
               <LegendDot label="Crypto" color="#8B5CF6" />
            </View>
          </View>

          {/* Save / New Plan */}
          {type !== 'save' &&
            (!saved ? (
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  saved && styles.saveBtnSuccess,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
                onPress={handleSave}
                disabled={saved}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>
                  {saved ? i18n.t('results.saved') : 'Guardar plan'}
                </Text>

                <Image
                  source={imageIndex.saveP}
                  style={styles.saveBtnIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => navigation.navigate(ScreenNameEnum.SavedPlansScreen)}
              >
                <Text style={styles.saveBtnText}>{i18n.t('splash.saved')}</Text>
              </TouchableOpacity>
            ))}

          {type !== 'save' ? (
            <TouchableOpacity
              style={[styles.newPlanBtn, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
              activeOpacity={0.8}
            >
              <Text style={styles.newPlanText}>Nuevo plan</Text>

              <Image
                source={imageIndex.addplain}
                style={styles.newPlanIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
              onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Nuevo plan</Text>

              <Image
                source={imageIndex.addplain}
                style={styles.newPlanWhiteIcon}
              />
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Save Modal */}
        <Modal
          visible={saveModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSaveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Guardar plan</Text>
              <Text style={styles.modalSub}>Ponle un nombre a tu plan de inversión.</Text>

              <TextInput
                style={styles.modalInput}
                value={planName}
                onChangeText={setPlanName}
                placeholder="Nombre del plan"
                placeholderTextColor="#94A3B8"
                autoFocus
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setSaveModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalConfirm, !planName.trim() && { opacity: 0.5 }]}
                  onPress={handleSave}
                  disabled={!planName.trim()}
                >
                  <Text style={styles.modalConfirmText}>Ahorrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
};

/* ---------------- Allocation Ring ---------------- */

type AllocationRingProps = {
  allocation: {
    equities: number;
    fixedIncome: number;
    cash: number;
    crypto: number;
  };
  totalValue: string;
};

const RING_SIZE = 170;
const STROKE_WIDTH = 18;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SLICES = [
  { key: 'equities', color: '#3B82F6', label: 'Equities' },      // Blue
  { key: 'fixedIncome', color: '#22C55E', label: 'Fixed Income' }, // Green
  { key: 'cash', color: '#F59E0B', label: 'Cash' },              // Orange
  { key: 'crypto', color: '#8B5CF6', label: 'Crypto' },          // Purple
] as const;

const AllocationRing: React.FC<AllocationRingProps> = ({
  allocation,
  totalValue,
}) => {
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  let cumulativePct = 0;

  const arcs = SLICES.map((slice) => {
    const pct = allocation[slice.key] * 100;
    const startPct = cumulativePct;
    cumulativePct += pct;

    return { ...slice, pct, startPct };
  }).filter((slice) => slice.pct > 0);

  return (
    <View style={styles.ringWrap}>
      <View style={styles.ringContainer}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            stroke="#EDF2EE"
            fill="none"
            cx={cx}
            cy={cy}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />

          {arcs.map((arc) => {
            const arcLen = (CIRCUMFERENCE * arc.pct) / 100;
            const rotationDeg = (arc.startPct / 100) * 360 - 90;

            return (
              <Circle
                key={arc.key}
                stroke={arc.color}
                fill="none"
                cx={cx}
                cy={cy}
                r={RADIUS}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${Math.max(arcLen - 4, 0)} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
                rotation={rotationDeg}
                origin={`${cx}, ${cy}`}
              />
            );
          })}
        </Svg>

        <View style={styles.ringCenterContent}>
          <Text style={styles.ringCenterSubText}>Portafolio total</Text>
          <Text style={styles.ringCenterValue}>{totalValue}</Text>
        </View>
      </View>

      <View style={styles.ringFooter}>
        <RingFooterItem
          color="#3B82F6"
          label="Equities"
          value={`${Math.round(allocation.equities * 100)}%`}
        />
        <RingFooterItem
          color="#22C55E"
          label="Fixed Income"
          value={`${Math.round(allocation.fixedIncome * 100)}%`}
        />
        <RingFooterItem
          color="#F59E0B"
          label="Cash"
          value={`${Math.round(allocation.cash * 100)}%`}
        />
        <RingFooterItem
          color="#8B5CF6"
          label="Crypto"
          value={`${Math.round(allocation.crypto * 100)}%`}
        />
      </View>
    </View>
  );
};

const RingFooterItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) => (
  <View style={styles.ringFooterItem}>
    <View style={styles.footerRow}>
      <View style={[styles.smallDot, { backgroundColor: color }]} />
      <Text style={styles.footerLabel}>{label}</Text>
    </View>
    <Text style={styles.footerValue}>{value}</Text>
  </View>
);

/* ---------------- Metric Card ---------------- */

const MetricCard = ({
  icon,
  label,
  value,
  active,
}: {
  icon: ImageSourcePropType;
  label: string;
  value: string;
  active?: boolean;
}) => (
  <View style={[styles.metricCard, active && styles.metricCardActive]}>
    <View style={styles.metricImageWrap}>
      <Image source={icon} style={styles.metricIconImage} resizeMode="contain" />
    </View>

    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

/* ---------------- Tabs ---------------- */

const RangeTabs = ({
  selected,
  onSelect,
}: {
  selected: RangeKey;
  onSelect: (value: RangeKey) => void;
}) => {
  const tabs: RangeKey[] = ['1Y', '3Y', '5Y', '7Y', '10Y'];

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => {
        const active = selected === tab;

        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, active && styles.tabBtnActive]}
            onPress={() => onSelect(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {tab.replace('Y', ' Year')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ---------------- Legend ---------------- */

const LegendDot = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },

  ringWrap: {
    alignItems: 'center',
  },
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  ringCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterSubText: {
    fontSize: 12,
    color: '#B0B7C3',
    marginBottom: 5,
  },
  ringCenterValue: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 3,
  },

  ringFooter: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    paddingHorizontal: 6,
  },
  ringFooterItem: {
    width: '48%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  smallDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  footerLabel: {
    fontSize: 12,
    color: '#A9A9A9',
    fontWeight: '700',
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    paddingLeft: 13,
  },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: CARD_GAP,
    marginBottom: 14,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  metricCardActive: {},
  metricImageWrap: {
    marginBottom: 2,
    bottom: 11,
  },
  metricIconImage: {
    width: 55,
    height: 55,
  },
  metricLabel: {
    fontSize: 10,
    color: '#AEAEB2',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },

  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7DDE5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabBtnActive: {
    borderColor: '#1D5FA0',
    backgroundColor: '#EEF6FF',
  },
  tabText: {
    fontSize: 10,
    color: '#7A8394',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1D5FA0',
    fontSize: 10,
    fontWeight: '600',
  },

  chartWrap: {
    minHeight: 220,
    justifyContent: 'center',
  },

  legendRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },

  saveBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#19C84B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#19C84B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  saveBtnSuccess: {
    backgroundColor: '#129B45',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  saveBtnIcon: {
    height: 27,
    width: 27,
    left: 11,
    resizeMode: 'cover',
  },

  newPlanBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPlanText: {
    color: '#19C84B',
    fontSize: 14,
    fontWeight: '700',
  },
  newPlanIcon: {
    height: 33,
    width: 33,
    resizeMode: 'contain',
    left: 11,
  },
  newPlanWhiteIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    left: 11,
    tintColor: 'white',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirm: {
    flex: 2,
    height: 50,
    backgroundColor: '#19C84B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
});

export default InvestmentScenarioScreen;