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
import RecommendedAllocationChart from '../../compoent/RecommendedAllocationChart';
import DonutChart from '../../compoent/DonutChart';

const RecommendedAllocation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { quiz = { raw: {} }, financialData = { horizon: 10, capital: 10000, monthly: 500 } } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { weights, profile, notes } = buildProfile(quiz);
  const allocation = calcAllocation(weights);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim]);
  const total =
    allocation.equity +
    allocation.fixed +
    allocation.cash +
    allocation.crypto;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <CustomHeader />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
        {/* <View style={styles.heroCard}>
          <Text style={styles.heroSub}>{i18n.t('results.title')}</Text>
          <Text style={styles.heroTitle}>{profile}</Text>
        </View> */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('results.allocation')}</Text>
          <View style={styles.chartWrap}>
<DonutChart
              equity={allocation.equity}
              fixed={allocation.fixed}
              cash={allocation.cash}
              crypto={allocation.crypto}
              totalValue={allocation.equity}
            />
            {/* <RecommendedAllocationChart
              value={allocation.equity} // ya jo highlight karna hai
              total={total}
              centerLabel={"Portfolio Total"}
            /> */}
          </View>

          <View style={styles.legend}>
            <LegendItem color="#00C81A" label={i18n.t('results.RV')} pct={allocation.equity} />
            <LegendItem color="#4A9EFF" label={i18n.t('results.RF')} pct={allocation.fixed} />
            <LegendItem color="#F5B942" label={i18n.t('results.Cash')} pct={allocation.cash} />
            {allocation.crypto > 0 && (
              <LegendItem color="#FF6B6B" label={i18n.t('results.Crypto')} pct={allocation.crypto} />
            )}
          </View>
        </View>

        {notes && notes.length > 0 && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>{i18n.t('results.notesTitle')}</Text>
            {notes.map((note, idx) => (
              <View key={idx} style={styles.noteItem}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
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

function LegendItem({ color, label, pct }: any) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
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
  heroSub: { color: '#00E5C0', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { color: '#FFF', fontSize: 28, fontWeight: '900' },
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
  cardTitle: { fontSize: 28, fontFamily: font.PoppinsBold, color: '#111', marginBottom: 1 },
  chartWrap: { alignItems: 'center', marginBottom: 20 },
  legend: { gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 13, color: 'black', fontFamily: font.PoppinsRegular },
  legendPct: { fontSize: 14, fontFamily: font.PoppinsRegular },
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