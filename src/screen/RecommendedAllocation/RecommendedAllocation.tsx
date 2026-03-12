// src/screen/RecommendedAllocation/RecommendedAllocation.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,   Animated, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import { calcAllocation, getProfileLabel } from '../../engine/calculator';
import DonutChart from '../../compoent/DonutChart';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';

const RecommendedAllocation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { answers } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const allocation = calcAllocation(answers);
  const profileLabel = getProfileLabel(allocation);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
   

     <CustomHeader/>

      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.heroSub}>Your recommended profile</Text>
          <Text style={styles.heroTitle}>{profileLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('results.allocation')}</Text>
          <View style={styles.chartWrap}>
            <DonutChart equity={allocation.equity} fixed={allocation.fixed} cash={allocation.cash} />
          </View>

          <View style={styles.legend}>
            <LegendItem color="#00E5C0" label={i18n.t('results.equity')} pct={allocation.equity} />
            <LegendItem color="#4A9EFF" label={i18n.t('results.fixed')} pct={allocation.fixed} />
            <LegendItem color="#F0C040" label={i18n.t('results.cash')} pct={allocation.cash} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.navigate(ScreenNameEnum.InvestmentScenarioScreen, { answers, allocation })}
        >
          <Text style={styles.nextBtnText}>View Projections →</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

function LegendItem({ color, label, pct }: any) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={[styles.legendPct, { color }]}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#000' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#000' },
  scrollContent: { padding: 20 },
  heroCard: { backgroundColor: '#111', borderRadius: 20, padding: 24, marginBottom: 20 },
  heroSub: { color: '#00E5C0', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EEE' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 20 },
  chartWrap: { alignItems: 'center', marginBottom: 20 },
  legend: { gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 14, color: '#666' },
  legendPct: { fontSize: 16, fontWeight: '800' },
  nextBtn: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default RecommendedAllocation;