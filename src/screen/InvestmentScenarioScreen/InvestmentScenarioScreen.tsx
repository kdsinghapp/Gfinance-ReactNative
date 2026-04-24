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
import { calculatePlan, formatFullCurrency, parseLocaleNumber, Weights, futureValue, calculateProjectionTable, formatPercent, getWeightedRate } from '../../engine/calculator';
import InfoModal from '../../compoent/InfoModal';
import GrowthChart from '../../compoent/GrowthChart';
import { Storage } from '../../engine/storage';
import { Analytics } from '../../engine/analytics';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import CustomHeader from '../../compoent/CustomHeader';
import { successToast } from '../../utils/customToast';
import RecommendedAllocationChart from '../../compoent/RecommendedAllocationChart';
import font from '../../theme/font';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Initial plan based on quiz (Strictly logic-based, no manual overrides)
  const plan = useMemo(() => calculatePlan(quiz, {
    ...financialData,
    horizon: financialData?.horizon ?? 10,
  }), [quiz, financialData]);

  const horizon = Math.max(1, financialData?.horizon ?? 10);
  const principal = Number(financialData?.capital ?? 0);
  const contribution = Number(financialData?.monthly ?? 0);
  const frequency = financialData?.frequency || 'monthly';
  const weights = plan.weights;

  // 2. Scenarios based on the plan's weights and the user's selected horizon
  const currentScenarios = useMemo(() => {
    return plan.scenarios;
  }, [plan]);

  const fullChartData = useMemo(() => {
    const baseValues = currentScenarios.base.yearlyValues ?? [];
    const conservativeValues = currentScenarios.conservative.yearlyValues ?? [];
    const optimisticValues = currentScenarios.optimistic.yearlyValues ?? [];

    return baseValues.map((val: number, idx: number) => ({
      year: idx + 1,
      label: `Y${idx + 1}`,
      pessimistic: conservativeValues[idx] ?? 0,
      neutral: val ?? 0,
      optimistic: optimisticValues[idx] ?? 0,
    }));
  }, [currentScenarios]);

  const initialPoint = useMemo(() => {
    const initialValue = Number(financialData?.capital ?? 0);

    return {
      year: 0,
      label: 'Start',
      pessimistic: initialValue,
      neutral: initialValue,
      optimistic: initialValue,
    };
  }, [financialData]);

  const totalInvested = useMemo(() => {
    const years = horizon;
    const m = frequency === 'weekly' ? 52 : frequency === 'monthly' ? 12 : 1;
    return principal + (contribution * years * m);
  }, [principal, contribution, horizon, frequency]);

  const chartData = useMemo(() => {
    // Strictly follow the selected horizon
    const safeChartData = fullChartData ?? [];
    return [initialPoint, ...safeChartData];
  }, [fullChartData, initialPoint]);

  const lastPoint = chartData[chartData.length - 1];
  const totalPortfolioValue = currentScenarios.base.finalValue ?? 0;

  useEffect(() => {
    Analytics.resultsViewed(weights, currentScenarios);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, weights, currentScenarios]);

  const handleSave = async () => {
    if (!planName.trim()) {
      setSaveModalVisible(true);
      return;
    }

    const ok = await Storage.savePlan({
      name: planName,
      answers: { ...quiz.raw, ...financialData },
      allocation: weights,
      scenarios: {
        years: horizon,
        base: currentScenarios.base.finalValue,
        conservative: currentScenarios.conservative.finalValue,
        optimistic: currentScenarios.optimistic.finalValue,
      },
      chartData: fullChartData,
    });

    if (ok) {
      successToast('Plan agregado correctamente', 'El plan ha sido guardado.', 2000);
      setSaved(true);
      setSaveModalVisible(false);
      Analytics.planSaved();
      // Reset stack to ChoosePlan as root
      navigation.reset({
        index: 1,
        routes: [
          { name: ScreenNameEnum.ChoosePlan },
          { name: ScreenNameEnum.SavedPlansScreen }
        ],
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return formatFullCurrency(amount);
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
            <View style={styles.profileBadgeRow}>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>
                  {i18n.t('results.typeOfInvestor')}: {plan?.profile}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 0 }]}>
                {i18n.t('results.recommendedAllocation')}
              </Text>
              <TouchableOpacity onPress={() => showInfo('asset_allocation')}>
                <Icon name="info-outline" size={20} color="#B8B8B8" />
              </TouchableOpacity>
            </View>

            <AllocationRing
              allocation={{
                equities: weights.RV,
                fixedIncome: weights.RF,
                cash: weights.Cash,
                crypto: weights.Crypto
              }}
              totalValue={formatCurrency(totalPortfolioValue)}
              onInfoPress={showInfo}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={{
              color: "black",
              fontFamily: font.PoppinsBold
            }}>
              {i18n.t('results.futureValueScenarios')}
            </Text>
            <TouchableOpacity onPress={() => showInfo('estimated_scenarios')}>
              <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>

          {/* Scenario Cards - Displaying final future values only */}
          <View style={styles.metricsRow}>
            <MetricCard
              icon={imageIndex.Conservative}
              label={i18n.t('results.conservative')}
              value={formatCurrency(currentScenarios.conservative.finalValue)}
            />
            <MetricCard
              icon={imageIndex.Base}
              label={i18n.t('results.base')}
              value={formatCurrency(currentScenarios.base.finalValue)}
              active
            />
            <MetricCard
              icon={imageIndex.Optimistic}
              label={i18n.t('results.optimistic')}
              value={formatCurrency(currentScenarios.optimistic.finalValue)}
            />
          </View>

          {/* Chart Card - Strictly showing progression up to the selected horizon */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.chartTitle, { marginTop: 8 }]}>{i18n.t('results.growthChart')}</Text>
              <TouchableOpacity onPress={() => showInfo('results_growth_projection')}>
                <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5, marginTop: 8 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.chartWrap}>
              <GrowthChart data={chartData} />
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
                  {saved ? i18n.t('results.saved') : i18n.t('results.savePlanBtn')}
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
              <Text style={styles.newPlanText}>{i18n.t('results.newPlanBtn')}</Text>

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
              <Text style={styles.saveBtnText}>{i18n.t('results.newPlanBtn')}</Text>

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
              <Text style={styles.modalTitle}>{i18n.t('results.modalTitle')}</Text>
              <Text style={styles.modalSub}>{i18n.t('results.modalSub')}</Text>

              <TextInput
                style={styles.modalInput}
                value={planName}
                onChangeText={setPlanName}
                placeholder={i18n.t('results.modalPlaceholder')}
                placeholderTextColor="#94A3B8"
                autoFocus
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setSaveModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>{i18n.t('results.modalCancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalConfirm, !planName.trim() && { opacity: 0.5 }]}
                  onPress={handleSave}
                  disabled={!planName.trim()}
                >
                  <Text style={styles.modalConfirmText}>{i18n.t('results.modalSave')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <InfoModal
          visible={infoVisible}
          title={infoContent.title}
          description={infoContent.desc}
          onClose={() => setInfoVisible(false)}
        />
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
  onInfoPress: (key: string) => void;
};

const RING_SIZE = 200;
const STROKE_WIDTH = 18;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SLICES = [
  { key: 'equities', color: '#3B82F6', label: i18n.t('results.RV') },      // Blue
  { key: 'fixedIncome', color: '#22C55E', label: i18n.t('results.RF') }, // Green
  { key: 'cash', color: '#F59E0B', label: i18n.t('results.Cash') },              // Orange
  { key: 'crypto', color: '#8B5CF6', label: i18n.t('results.Crypto') },          // Purple
] as const;

const AllocationRing: React.FC<AllocationRingProps> = ({
  allocation,
  totalValue,
  onInfoPress,
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
    <View style={{
    }} >
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

          {arcs?.map((arc) => {
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
          <Image source={imageIndex.G}
            style={{
              width: 100,
              height: 49,

            }}
            resizeMode='contain'
          />
          {/* <Image source={imageIndex.greenG}
            style={{
              width: 100,
              height: 49,

            }}
            resizeMode='contain'
          /> */}
          {/* <Text style={styles.ringCenterSubText}>Portafolio total</Text> */}
          {/* <Text style={styles.ringCenterValue}>{totalValue}</Text> */}
        </View>
      </View>
      <View >
        <View style={{
          justifyContent: "space-around",
          flexDirection: "row"
        }}>

          <View>

            <View style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center"
            }}>

              <View style={{
                height: 10,
                width: 10,
                backgroundColor: "#3B82F6",
                borderRadius: 20,
                right: 8
              }} />

              <Text style={{
                color: "#A9A9A9",
                fontSize: 11,
                fontFamily: font.PoppinsRegular,
                marginBottom: 2

              }}>{i18n.t('results.RV')}</Text>
              <TouchableOpacity onPress={() => onInfoPress('rv')}>
                <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>

            <Text style={{
              color: "black",
              fontSize: 18,
              fontFamily: font.PoppinsBold,
              textAlign: "center"
            }}>{`${Math.round(allocation.equities * 100)}%`}</Text>
          </View>



          <View>

            <View style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center"
            }}>

              <View style={{
                height: 10,
                width: 10,
                backgroundColor: "#22C55E",
                borderRadius: 20,
                right: 4
              }} />

              <Text style={{
                color: "#A9A9A9",
                fontSize: 12,
                fontFamily: font.PoppinsRegular,
                marginBottom: 2
              }}>{i18n.t('results.RF')}</Text>
              <TouchableOpacity onPress={() => onInfoPress('rf')}>
                <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>

            <Text style={{
              color: "black",
              fontSize: 18,
              fontFamily: font.PoppinsBold,
              textAlign: "center"
            }}>{`${Math.round(allocation.fixedIncome * 100)}%`}</Text>
          </View>
        </View>
        <View style={{
          justifyContent: "space-around",
          flexDirection: "row",
          marginTop: 30
        }}>

          <View>

            <View style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center"
            }}>

              <View style={{
                height: 10,
                width: 10,
                backgroundColor: "#F59E0B",

                borderRadius: 20,
                right: 8
              }} />

              <Text style={{
                color: "#A9A9A9",
                fontSize: 12,
                fontFamily: font.PoppinsRegular,
                marginBottom: 2

              }}>{i18n.t('results.Cash')}</Text>
              <TouchableOpacity onPress={() => onInfoPress('cash')}>
                <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>

            <Text style={{
              color: "black",
              fontSize: 18,
              fontFamily: font.PoppinsBold,
              textAlign: "center"
            }}>{`${Math.round(allocation.cash * 100)}%`}

            </Text>
          </View>
          <View>
            <View style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center"
            }}>
              <View style={{
                height: 10,
                width: 10,
                backgroundColor: "#8B5CF6",
                borderRadius: 20,
                right: 8
              }} />
              <Text style={{
                color: "#A9A9A9",
                fontSize: 12,
                fontFamily: font.PoppinsRegular,
                marginBottom: 2
              }}>{i18n.t('results.Crypto')}</Text>
              <TouchableOpacity onPress={() => onInfoPress('crypto')}>
                <Icon name="info-outline" size={15} color="#B8B8B8" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>

            <Text style={{
              color: "black",
              fontSize: 18,
              fontFamily: font.PoppinsBold,
              textAlign: "center"
            }}>
              {`${Math.round(allocation.crypto * 100)}%`}

            </Text>
          </View>







        </View>

        {/* <RingFooterItem
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
        /> */}
      </View>
    </View>
  );
};
// const AllocationRing: React.FC<AllocationRingProps> = ({
//   allocation,
//   totalValue,
// }) => {
//   const cx = RING_SIZE / 2;
//   const cy = RING_SIZE / 2;

//   let cumulativePct = 0;

//   const arcs = SLICES.map((slice) => {
//     const pct = allocation[slice.key] * 100;
//     const startPct = cumulativePct;
//     cumulativePct += pct;

//     return { ...slice, pct, startPct };
//   }).filter((slice) => slice.pct > 0);

//   return (
//     <View  >
//       {/* <View style={styles.ringContainer}>
//         <Svg width={RING_SIZE} height={RING_SIZE}>
//           <Circle
//             stroke="#EDF2EE"
//             fill="none"
//             cx={cx}
//             cy={cy}
//             r={RADIUS}
//             strokeWidth={STROKE_WIDTH}
//           />

//           {arcs.map((arc) => {
//             const arcLen = (CIRCUMFERENCE * arc.pct) / 100;
//             const rotationDeg = (arc.startPct / 100) * 360 - 90;

//             return (
//               <Circle
//                 key={arc.key}
//                 stroke={arc.color}
//                 fill="none"
//                 cx={cx}
//                 cy={cy}
//                 r={RADIUS}
//                 strokeWidth={STROKE_WIDTH}
//                 strokeDasharray={`${Math.max(arcLen - 4, 0)} ${CIRCUMFERENCE}`}
//                 strokeLinecap="round"
//                 rotation={rotationDeg}
//                 origin={`${cx}, ${cy}`}
//               />
//             );
//           })}
//         </Svg>

//         <View style={styles.ringCenterContent}>
//           <Text style={styles.ringCenterSubText}>Portafolio total</Text>
//           <Text style={styles.ringCenterValue}>{totalValue}</Text>
//         </View>
//       </View> */}

//       <View style={[styles.ringFooter,{
//          backgroundColor:"red" ,
//        }]}>
//         <RingFooterItem
//           color="#3B82F6"
//           label="Equities"
//           value={`${Math.round(allocation.equities * 100)}%`}
//         />
//         <RingFooterItem
//           color="#22C55E"
//           label="Fixed Income"
//           value={`${Math.round(allocation.fixedIncome * 100)}%`}
//         />
//         <RingFooterItem
//           color="#F59E0B"
//           label="Cash"
//           value={`${Math.round(allocation.cash * 100)}%`}
//         />
//         <RingFooterItem
//           color="#8B5CF6"
//           label="Crypto"
//           value={`${Math.round(allocation.crypto * 100)}%`}
//         />
//       </View>
//     </View>
//   );
// };

const RingFooterItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) => (
  <View style={[styles.ringFooterItem, {
  }]}>
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
            // style={[styles.tabBtn,]}
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
  profileBadgeRow: { flexDirection: 'row', marginBottom: 16 },
  profileBadge: {
    backgroundColor: '#E8F8ED',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#B2E5BC',
  },
  profileBadgeText: {
    color: '#1A7A35',
    fontSize: 20,
    fontFamily: font.PoppinsBold,
    // letterSpacing: 0.3,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 15,
    marginBottom: 14,

    shadowColor: '#BCDBFF', // iOS me dark color better dikhta hai
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, // increase karo
    shadowRadius: 12,

    elevation: 18, // Android ke liye
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
  summaryLabel: {
    fontSize: 13,
    color: '#64728B',
    fontFamily: font.PoppinsRegular,
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 18,
    color: '#1E293B',
    fontFamily: font.PoppinsBold
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  ringFooterItem: {
    width: '45%',
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
    color: 'red',
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
    marginBottom: 12,
    marginTop: 5,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#BCDBFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, // 30% opacity
    shadowRadius: 10,
    elevation: 18,
    opacity: 0.9
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
    textAlign: 'center',
    fontFamily: font.PoppinsMedium,
    marginBottom: 2
  },
  metricValue: {
    fontSize: 18,
    color: '#111111',
    textAlign: 'center',
    fontFamily: font.PoppinsBold
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: font.PoppinsBold,
    marginBottom: 15,
    color: "black"
  },

  totValue: {
    fontSize: 24,
    color: 'black',
    fontFamily: font.PoppinsBold
  },
  totText: {
    fontSize: 14,
    color: '#A9A9A9',
    fontFamily: font.PoppinsRegular
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  totalWeight: {
    fontSize: 15,
    fontFamily: font.PoppinsBold,
    color: '#10B981'
  },
  errorText: {
    color: '#EF4444'
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
    color: '#000000',
    fontFamily: font.PoppinsMedium
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
    fontFamily: font.PoppinsBold,

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
    fontFamily: font.PoppinsBold
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