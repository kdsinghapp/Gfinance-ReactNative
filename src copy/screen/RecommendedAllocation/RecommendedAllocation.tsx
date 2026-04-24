import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import { buildProfile, calcAllocation } from '../../engine/calculator';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import font from '../../theme/font';
import DonutChart from '../../compoent/DonutChart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InfoModal from '../../compoent/InfoModal';

const RecommendedAllocation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { quiz = { raw: {} }, financialData: initialFinancialData = { horizon: 10, capital: 10000, monthly: 500 } } = route.params || {};
  const financialData = {
    ...initialFinancialData,
    horizon: quiz?.raw?.horiz ? parseFloat(quiz.raw.horiz) : initialFinancialData.horizon
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Info Modal State
  const [infoVisible, setInfoVisible] = React.useState(false);
  const [infoContent, setInfoContent] = React.useState({ title: '', desc: '' });

  const showInfo = (key: string) => {
    const defs = (i18n.t('definitions') as any) || {};
    if (defs[key]) {
      setInfoContent(defs[key]);
      setInfoVisible(true);
    }
  };

  const { weights, profile, notes } = buildProfile(quiz);
  const allocation = calcAllocation(weights);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim]);


  const total =
    (allocation?.equity ?? 0) +
    (allocation?.fixed ?? 0) +
    (allocation?.cash ?? 0) +
    (allocation?.crypto ?? 0);

  const equityPercent =
    total > 0
      ? ((allocation?.equity ?? 0) / total) * 100
      : 0;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <CustomHeader />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text style={[styles.cardTitle, { flexShrink: 1, marginBottom: 0 }]}>
                {i18n.t('results.allocation')}
              </Text>
              <TouchableOpacity onPress={() => showInfo('asset_allocation')} style={{ marginTop: 6 }}>
                <Icon name="info-outline" size={24} color="#B8B8B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Investor Type Badge */}
          {/* <View style={styles.profileBadgeRow}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Tipo de inversor: {profile}</Text>
            </View>
          </View> */}

          <View style={styles.chartWrap}>
            <DonutChart
              equity={allocation.equity}
              fixed={allocation.fixed}
              cash={allocation.cash}
              crypto={allocation.crypto}
              totalValue={`$${allocation?.equity?.toFixed(2)}`}
              size={230}
            />
          </View>

          <View style={styles.legend}>
            <LegendItem color="#00C81A" label={i18n.t('results.RV')} pct={allocation.equity} onInfo={() => showInfo('rv')} />
            <LegendItem color="#4A9EFF" label={i18n.t('results.RF')} pct={allocation.fixed} onInfo={() => showInfo('rf')} />
            <LegendItem color="#F5B942" label={i18n.t('results.Cash')} pct={allocation.cash} onInfo={() => showInfo('cash')} />
            {allocation.crypto > 0 && (
              <LegendItem color="#FF6B6B" label={i18n.t('results.Crypto')} pct={allocation.crypto} onInfo={() => showInfo('crypto')} />
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <InfoModal
        visible={infoVisible}
        title={infoContent.title}
        description={infoContent.desc}
        onClose={() => setInfoVisible(false)}
      />
      <TouchableOpacity
        style={[styles.nextBtn, {
          marginHorizontal: 15,
          marginBottom: 15
        }]}
        onPress={() => navigation.navigate(ScreenNameEnum.ContributionInputScreen, { quiz, financialData, weights })}
      >
        <Text style={styles.nextBtnText}>{i18n.t('results.scenarios')}  </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function LegendItem({ color, label, pct, onInfo }: any) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.legendLabelWrapper}>
        <Text style={styles.legendLabel}>{label}</Text>
        {onInfo && (
          <TouchableOpacity onPress={onInfo} style={styles.legendInfoBtn}>
            <Icon name="info-outline" size={16} color="#B8B8B8" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.legendPct, { color }]}>{pct.toFixed(1)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: 'white',
  },
  scrollContent: { padding: 20 },
  heroCard: { backgroundColor: '#111', borderRadius: 20, padding: 24, marginBottom: 20 },
  heroSub: { color: '#00E5C0', fontSize: 13, fontFamily: font.PoppinsSemiBold, textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { color: '#FFF', fontSize: 28, fontFamily: font.PoppinsBold },
  card: {

    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,

    // iOS Shadow
    shadowColor: '#BCDBFF', // always dark use karo
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, // increase karo
    shadowRadius: 12,

    // Android
    elevation: 16,

  },
  cardTitle: { fontSize: 28, fontFamily: font.PoppinsBold, color: '#111', marginBottom: 8 },
  profileBadgeRow: { flexDirection: 'row', marginBottom: 16 },
  profileBadge: {
    backgroundColor: '#E8F8ED',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#B2E5BC',
  },
  profileBadgeText: {
    color: '#1A7A35',
    fontSize: 13,
    fontFamily: font.PoppinsSemiBold,
    letterSpacing: 0.2,
  },
  chartWrap: { alignItems: 'center', marginBottom: 20 },
  legend: { gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  legendLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8, // Ensure gap before percentage
  },
  legendLabel: {
    fontSize: 16,
    color: 'black',
    fontFamily: font.PoppinsSemiBold,
    marginRight: 6,
    flexShrink: 1, // Prevent pushing the icon out
  },
  legendInfoBtn: {
    padding: 2,
  },
  legendPct: { fontSize: 18, fontFamily: font.PoppinsBold },
  notesCard: {

    shadowColor: '#BCDBFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,

    backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20,
    elevation: 16
  },
  notesTitle: { fontSize: 14, fontFamily: font.PoppinsSemiBold, color: 'black', marginBottom: 12, textTransform: 'uppercase' },
  noteItem: { flexDirection: 'row', marginBottom: 6 },
  noteBullet: { color: 'black', fontSize: 11, marginRight: 8, fontFamily: font.PoppinsRegular, },
  noteText: { flex: 1, fontSize: 11, color: 'black', lineHeight: 20, fontWeight: "500" },
  nextBtn: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontFamily: font.PoppinsSemiBold, },
});

export default RecommendedAllocation;