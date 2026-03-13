//  import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import i18n from '../../i18n';
// import { calculatePlan, formatCurrency } from '../../engine/calculator';
// import GrowthChart from '../../compoent/GrowthChart';
// import { Storage } from '../../engine/storage';
// import { Analytics } from '../../engine/analytics';
// import ScreenNameEnum from '../../routes/screenName.enum';
// import StatusBarComponent from '../../compoent/StatusBarCompoent';
// import CustomHeader from '../../compoent/CustomHeader';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const InvestmentScenarioScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

//   // Safe extraction with defaults
//   const { 
//     quiz = { raw: {} }, 
//     financialData = { horizon: 10, capital: 10000, monthly: 500 } 
//   } = route.params || {};

//   const [saved, setSaved] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   // Recalculate full plan for scenarios and data
//   const plan = calculatePlan(quiz, financialData);
//   const { scenarios, profile } = plan;

//   // Build chart points from yearlyValues
//   const chartData = scenarios.base.yearlyValues.map((val, idx) => ({
//       year: idx,
//       conservative: scenarios.conservative.yearlyValues[idx],
//       base: scenarios.base.yearlyValues[idx],
//       optimistic: scenarios.optimistic.yearlyValues[idx],
//   }));

//   useEffect(() => {
//     Analytics.resultsViewed(plan.weights, scenarios);
//     Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
//   }, [fadeAnim]);

//   const handleSave = async () => {
//     // Save identifying data and result summary
//     const ok = await Storage.savePlan({ 
//         answers: { ...quiz.raw, ...financialData }, 
//         allocation: plan.weights, 
//         scenarios: {
//             years: financialData.horizon,
//             base: scenarios.base.finalValue,
//             conservative: scenarios.conservative.finalValue,
//             optimistic: scenarios.optimistic.finalValue
//         }, 
//         chartData 
//     });
//     if (ok) {
//       setSaved(true);
//       Analytics.planSaved();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBarComponent />
//       <CustomHeader />

//       <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
//         <View style={styles.heroBox}>
//           <Text style={styles.heroLabel}>{i18n.t('results.title')}</Text>
//           <Text style={styles.heroProfile}>{profile}</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>
//             {i18n.t('results.scenarios_title', { years: financialData.horizon })}
//           </Text>
//           <View style={styles.scenariosRow}>
//             <ScenarioItem 
//                 label={i18n.t('results.conservative')} 
//                 value={scenarios.conservative.finalValue} 
//                 color="#6B839A" 
//             />
//             <ScenarioItem 
//                 label={i18n.t('results.base')} 
//                 value={scenarios.base.finalValue} 
//                 color="#4A9EFF" 
//                 featured 
//             />
//             <ScenarioItem 
//                 label={i18n.t('results.optimistic')} 
//                 value={scenarios.optimistic.finalValue} 
//                 color="#00E5C0" 
//             />
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>{i18n.t('results.growthChart')}</Text>
//           <GrowthChart data={chartData} />
//         </View>

//         <View style={styles.actions}>
//           <TouchableOpacity 
//             style={[styles.saveBtn, saved && styles.saveBtnSuccess]} 
//             onPress={handleSave}
//             disabled={saved}
//           >
//             <Text style={styles.saveBtnText}>{saved ? i18n.t('results.saved') : i18n.t('results.save')}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.newBtn} 
//             onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
//           >
//             <Text style={styles.newBtnText}>{i18n.t('results.new')}</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// function ScenarioItem({ label, value, color, featured }: any) {
//   return (
//     <View style={[styles.scenItem, featured && styles.scenItemFeatured]}>
//       <Text style={[styles.scenValue, { color }]}>{formatCurrency(value)}</Text>
//       <Text style={styles.scenLabel}>{label}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#FFF' },
//   scrollContent: { padding: 20 },
//   heroBox: { marginBottom: 20, alignItems: 'center' },
//   heroLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
//   heroProfile: { fontSize: 24, fontWeight: '900', color: '#111', marginTop: 4 },
//   card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#EEE', marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.05, shadowRadius:8 },
//   cardTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 },
//   scenariosRow: { flexDirection: 'row', gap: 8 },
//   scenItem: { flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#F8F9FA', alignItems: 'center' },
//   scenItemFeatured: { backgroundColor: '#F0F7FF', borderWidth: 1, borderColor: '#4A9EFF44' },
//   scenValue: { fontSize: 15, fontWeight: '900' },
//   scenLabel: { fontSize: 10, color: '#888', marginTop: 4, textTransform: 'uppercase', textAlign: 'center' },
//   actions: { gap: 12, marginTop: 10, paddingBottom: 20 },
//   saveBtn: { backgroundColor: '#111', height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
//   saveBtnSuccess: { backgroundColor: '#00B89A' },
//   saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
//   newBtn: { height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD' },
//   newBtnText: { color: '#666', fontSize: 16, fontWeight: '700' },
// });

// export default InvestmentScenarioScreen;


// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Svg, { Circle } from 'react-native-svg';

// import i18n from '../../i18n';
// import { calculatePlan, formatCurrency } from '../../engine/calculator';
// import GrowthChart from '../../compoent/GrowthChart';
// import { Storage } from '../../engine/storage';
// import { Analytics } from '../../engine/analytics';
// import ScreenNameEnum from '../../routes/screenName.enum';
// import StatusBarComponent from '../../compoent/StatusBarCompoent';
// import imageIndex from '../../assets/imageIndex';

// const { width } = Dimensions.get('window');

// const InvestmentScenarioScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

//   const {
//     quiz = { raw: {} },
//     financialData = { horizon: 10, capital: 10000, monthly: 500 },
//   } = route.params || {};

//   const [saved, setSaved] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const plan = calculatePlan(quiz, financialData);
//   const { scenarios, profile } = plan;

//   const allocation = {
//     equities: plan?.weights?.equity ?? 70,
//     fixedIncome: plan?.weights?.fixed ?? 30,
//   };

//   const chartData = scenarios.base.yearlyValues.map((val: number, idx: number) => ({
//     year: idx,
//     conservative: scenarios.conservative.yearlyValues[idx],
//     base: scenarios.base.yearlyValues[idx],
//     optimistic: scenarios.optimistic.yearlyValues[idx],
//   }));

//   useEffect(() => {
//     Analytics.resultsViewed(plan.weights, scenarios);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 450,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleSave = async () => {
//     const ok = await Storage.savePlan({
//       answers: { ...quiz.raw, ...financialData },
//       allocation: plan.weights,
//       scenarios: {
//         years: financialData.horizon,
//         base: scenarios.base.finalValue,
//         conservative: scenarios.conservative.finalValue,
//         optimistic: scenarios.optimistic.finalValue,
//       },
//       chartData,
//     });

//     if (ok) {
//       setSaved(true);
//       Analytics.planSaved();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBarComponent />

//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <View style={styles.topHeader}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//             <Text style={styles.backText}>‹</Text>
//           </TouchableOpacity>

//           <Text style={styles.brand}>Gfinance</Text>

//           <View style={styles.headerRightSpace} />
//         </View>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <Text style={styles.sectionTitle}>Recommended Allocation</Text>

//           <View style={styles.card}>
//             <AllocationRing
//               percentage={allocation.equities}
//               leftLabel="Equities"
//               leftValue={`${allocation.equities}%`}
//               rightLabel="Fixed Income"
//               rightValue={`${allocation.fixedIncome}%`}
//             />
//           </View>

//           <View style={styles.metricsRow}>
//             <MetricCard
//               emoji={imageIndex.conservativeIcon}
//               label="Conservative"
//               value={formatCurrency(scenarios.conservative.finalValue)}
//             />
//             <MetricCard
//               emoji={imageIndex.Base}
//               label="Base"
//               value={formatCurrency(scenarios.base.finalValue)}
//               active
//             />
//             <MetricCard

//                             emoji={imageIndex.Optimistic}

//               label="Optimistic"
//               value={formatCurrency(scenarios.optimistic.finalValue)}
//             />
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.chartTitle}>Recommended Allocation</Text>
//             <GrowthChart data={chartData} />
//             <View style={styles.legendRow}>
//               <LegendDot label="Conservative" color="#7FA7FF" />
//               <LegendDot label="Base" color="#22C55E" />
//               <LegendDot label="Optimistic" color="#8B5CF6" />
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
//             onPress={handleSave}
//             disabled={saved}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.saveBtnText}>
//               {saved ? i18n.t('results.saved') : 'Save Plan'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.newPlanBtn}
//             onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
//           >
//             <Text style={styles.newPlanText}>New Plan</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// type AllocationRingProps = {
//   percentage: number;
//   leftLabel: string;
//   leftValue: string;
//   rightLabel: string;
//   rightValue: string;
// };

// const AllocationRing: React.FC<AllocationRingProps> = ({
//   percentage,
//   leftLabel,
//   leftValue,
//   rightLabel,
//   rightValue,
// }) => {
//   const size = 118;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const progress = Math.max(0, Math.min(percentage, 100));
//   const strokeDashoffset = circumference - (circumference * progress) / 100;

//   return (
//     <View style={styles.ringWrap}>
//       <View style={styles.ringContainer}>
//         <Svg width={size} height={size}>
//           <Circle
//             stroke="#DDF3DF"
//             fill="none"
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             strokeWidth={strokeWidth}
//           />
//           <Circle
//             stroke="#1DB954"
//             fill="none"
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             strokeWidth={strokeWidth}
//             strokeDasharray={`${circumference} ${circumference}`}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             rotation="-90"
//             origin={`${size / 2}, ${size / 2}`}
//           />
//         </Svg>

//         <View style={styles.ringCenter}>
//           <Text style={styles.ringCenterIcon}>↻</Text>
//         </View>
//       </View>

//       <View style={styles.ringFooter}>
//         <View style={styles.ringFooterItem}>
//           <View style={[styles.smallDot, { backgroundColor: '#CDEFD2' }]} />
//           <Text style={styles.footerLabel}>{leftLabel}</Text>
//           <Text style={styles.footerValue}>{leftValue}</Text>
//         </View>

//         <View style={styles.ringFooterItem}>
//           <View style={[styles.smallDot, { backgroundColor: '#1DB954' }]} />
//           <Text style={styles.footerLabel}>{rightLabel}</Text>
//           <Text style={styles.footerValue}>{rightValue}</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const MetricCard = ({
//   emoji,
//   label,
//   value,
//   active,
// }: {
//   emoji: string;
//   label: string;
//   value: string;
//   active?: boolean;
// }) => {
//   return (
//     <View style={[styles.metricCard, active && styles.metricCardActive]}>
//       <View style={styles.metricIconWrap}>
//         <Image source={imageIndex.emoji} 
//         style={{
//           height:22,
//           width:22
//         }}
//         />
//        </View>
//       <Text style={styles.metricLabel}>{label}</Text>
//       <Text style={styles.metricValue}>{value}</Text>
//     </View>
//   );
// };

// const LegendDot = ({ label, color }: { label: string; color: string }) => (
//   <View style={styles.legendItem}>
//     <View style={[styles.legendDot, { backgroundColor: color }]} />
//     <Text style={styles.legendText}>{label}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#F5F6F8',
//   },
//   container: {
//     flex: 1,
//   },
//   topHeader: {
//     height: 58,
//     paddingHorizontal: 18,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F5F6F8',
//   },
//   backBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#111',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backText: {
//     color: '#FFF',
//     fontSize: 22,
//     lineHeight: 24,
//     fontWeight: '700',
//     marginTop: -2,
//   },
//   brand: {
//     fontSize: 22,
//     fontWeight: '900',
//     color: '#111',
//   },
//   headerRightSpace: {
//     width: 32,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#111',
//     marginBottom: 12,
//     marginTop: 2,
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 22,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 2,
//   },
//   ringWrap: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   ringContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 2,
//     marginBottom: 18,
//   },
//   ringCenter: {
//     position: 'absolute',
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: '#F3FFF5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   ringCenterIcon: {
//     fontSize: 20,
//     color: '#1DB954',
//     fontWeight: '800',
//   },
//   ringFooter: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 4,
//   },
//   ringFooterItem: {
//     alignItems: 'center',
//   },
//   smallDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginBottom: 6,
//   },
//   footerLabel: {
//     fontSize: 10,
//     color: '#9AA0A6',
//     marginBottom: 2,
//   },
//   footerValue: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#111',
//   },
//   metricsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 14,
//   },
//   metricCard: {
//     width: (width - 32 - 12) / 3,
//     backgroundColor: '#FFF',
//     borderRadius: 18,
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.04,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   metricCardActive: {
//     borderWidth: 1,
//     borderColor: '#DDF3DF',
//   },
//   metricIconWrap: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   metricEmoji: {
//     fontSize: 14,
//   },
//   metricLabel: {
//     fontSize: 10,
//     color: '#9AA0A6',
//     marginBottom: 5,
//   },
//   metricValue: {
//     fontSize: 13,
//     fontWeight: '800',
//     color: '#111',
//   },
//   chartTitle: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#111',
//     marginBottom: 10,
//   },
//   legendRow: {
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 8,
//     marginTop: 4,
//   },
//   legendDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   legendText: {
//     fontSize: 11,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   saveBtn: {
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: '#1DB954',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   saveBtnSuccess: {
//     backgroundColor: '#129B45',
//   },
//   saveBtnText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   newPlanBtn: {
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   newPlanText: {
//     color: '#1DB954',
//     fontSize: 14,
//     fontWeight: '700',
//   },
// });

// export default InvestmentScenarioScreen;

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
type RangeKey = '1Y' | '3Y' | '5Y' | '7Y' | '10Y';
const CARD_GAP = 10;
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
    equities: Math.round((weights.RV ?? 0) * 100),
    fixedIncome: Math.round((weights.RF ?? 0) * 100),
    cash: Math.round((weights.Cash ?? 0) * 100),
    crypto: Math.round((weights.Crypto ?? 0) * 100),
  };

  const fullChartData = useMemo(() => {
    return scenarios?.base?.yearlyValues?.map((val: number, idx: number) => ({
      year: idx + 1,
      label: `Y${idx + 1}`,
      conservative: scenarios?.conservative?.yearlyValues[idx],
      base: val,
      optimistic: scenarios?.optimistic?.yearlyValues[idx],
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
    const sliced = fullChartData.slice(0, Math.min(maxYears, fullChartData?.length));

    // Important: always prepend starting point
    return [initialPoint, ...sliced];
  }, [fullChartData, selectedRange, initialPoint]);
  const totalPortfolioValue = scenarios?.base?.finalValue;

  useEffect(() => {
    Analytics.resultsViewed(plan.weights, scenarios);

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
      setSaved(true);
      setSaveModalVisible(false);
      Analytics.planSaved();
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
          <View style={[styles.card,{
            marginTop:20
          }]}>
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
              label="Conservative"
              value={formatCurrency(scenarios.conservative.finalValue)}
            />
            <MetricCard
              icon={imageIndex.Base}
              label="Base"
              value={formatCurrency(scenarios.base.finalValue)}
              active
            />
            <MetricCard
              icon={imageIndex.Optimistic}
              label="Optimistic"
              value={formatCurrency(scenarios.optimistic.finalValue)}
            />
          </View>

          {/* Chart Card */}
          <View style={styles.card}>
            <Text style={styles.chartTitle}>Future Value Projection</Text>

            <RangeTabs selected={selectedRange} onSelect={setSelectedRange} />

            <View style={styles.chartWrap}>
              <GrowthChart data={chartData} />
            </View>

            <View style={styles.legendRow}>
              <LegendDot label="Conservative" color="#7FA7FF" />
              <LegendDot label="Base" color="#22C55E" />
              <LegendDot label="Optimistic" color="#F59E0B" />
            </View>
          </View>
          {type !== "save" && (
            !saved ? (
              <TouchableOpacity
                style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
                onPress={handleSave}
                disabled={saved}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>
                  {saved ? i18n.t('results.saved') : 'Guardar plan'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.saveBtn,]}
                onPress={() => navigation.navigate(ScreenNameEnum.SavedPlansScreen)}
              >
                <Text style={styles.saveBtnText}>
                  {i18n.t('splash.saved')}
                </Text>
              </TouchableOpacity>
            )
          )}


          <TouchableOpacity
            style={styles.newPlanBtn}
            onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
            activeOpacity={0.8}
          >
            <Text style={styles.newPlanText}>Nuevo plan</Text>
          </TouchableOpacity>
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
                placeholder="My House Fund"
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
  { key: 'equities', color: '#BEECC7', label: 'Equities' },
  { key: 'fixedIncome', color: '#03C81C', label: 'Fixed Income' },
  { key: 'cash', color: '#0EAD29', label: 'Cash' },
  { key: 'crypto', color: '#79D98C', label: 'Crypto' },
] as const;

const AllocationRing: React.FC<AllocationRingProps> = ({
  allocation,
  totalValue,
}) => {
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  let cumulativePct = 0;

  const arcs = SLICES.map((slice) => {
    const pct = allocation[slice.key];
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
        <RingFooterItem color="#BEECC7" label="Equities" value={`${allocation.equities}%`} />
        <RingFooterItem color="#03C81C" label="Fixed Income" value={`${allocation.fixedIncome}%`} />
        <RingFooterItem color="#0EAD29" label="Cash" value={`${allocation.cash}%`} />
        <RingFooterItem color="#79D98C" label="Crypto" value={`${allocation.crypto}%`} />
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
    <View style={{
      bottom: 11
    }}>
      <Image
        source={icon}
        style={styles.metricIconImage}
        resizeMode="contain"
      />
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
      {tabs?.map((tab) => {
        const active = selected === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, active && styles.tabBtnActive]}
            onPress={() => onSelect(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {tab?.replace('Y', ' Year')}
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
   marginTop:3
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
    marginTop:8
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
  },
  metricCardActive: {
  },
  metricIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricIconWrapActive: {
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
    fontWeight:"500"
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
    height: 56,
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