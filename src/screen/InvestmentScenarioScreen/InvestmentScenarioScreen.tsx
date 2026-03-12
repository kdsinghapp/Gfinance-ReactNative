// src/screen/InvestmentScenarioScreen/InvestmentScenarioScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,   Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import { calcScenarios, formatCurrency, calcFV } from '../../engine/calculator';
import GrowthChart from '../../compoent/GrowthChart';
import { Storage } from '../../engine/storage';
import { Analytics } from '../../engine/analytics';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const InvestmentScenarioScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { answers, allocation } = route.params;
  const [saved, setSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scenarios = calcScenarios(answers, allocation);
  
  // Build chart points
  const chartData = [];
  const years = scenarios.years;
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * years;
    chartData.push({
      year: Math.round(y),
      conservative: calcFV(scenarios.capital, scenarios.monthly, y, scenarios.rates.conservative),
      base: calcFV(scenarios.capital, scenarios.monthly, y, scenarios.rates.base),
      optimistic: calcFV(scenarios.capital, scenarios.monthly, y, scenarios.rates.optimistic),
    });
  }

  useEffect(() => {
    Analytics.resultsViewed(allocation, scenarios);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleSave = async () => {
    const ok = await Storage.savePlan({ answers, allocation, scenarios, chartData });
    if (ok) {
      setSaved(true);
      Analytics.planSaved();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
        <CustomHeader/>

      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('results.scenarios', { years: scenarios.years })}</Text>
          <View style={styles.scenariosRow}>
            <ScenarioItem label={i18n.t('results.conservative')} value={scenarios.conservative} color="#6B839A" />
            <ScenarioItem label={i18n.t('results.base')} value={scenarios.base} color="#4A9EFF" featured />
            <ScenarioItem label={i18n.t('results.optimistic')} value={scenarios.optimistic} color="#00E5C0" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Projected Growth</Text>
          <GrowthChart data={chartData} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.saveBtn, saved && styles.saveBtnSuccess]} 
            onPress={handleSave}
            disabled={saved}
          >
            <Text style={styles.saveBtnText}>{saved ? i18n.t('results.saved') : i18n.t('results.save')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.newBtn} 
            onPress={() => navigation.navigate(ScreenNameEnum.InvestmentPlanScreen)}
          >
            <Text style={styles.newBtnText}>{i18n.t('results.new')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

function ScenarioItem({ label, value, color, featured }: any) {
  return (
    <View style={[styles.scenItem, featured && styles.scenItemFeatured]}>
      <Text style={[styles.scenValue, { color }]}>{formatCurrency(value)}</Text>
      <Text style={styles.scenLabel}>{label}</Text>
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
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EEE', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 },
  scenariosRow: { flexDirection: 'row', gap: 8 },
  scenItem: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#F8F9FA', alignItems: 'center' },
  scenItemFeatured: { backgroundColor: '#F0F7FF', borderWidth: 1, borderColor: '#4A9EFF44' },
  scenValue: { fontSize: 15, fontWeight: '900' },
  scenLabel: { fontSize: 10, color: '#888', marginTop: 4, textTransform: 'uppercase' },
  actions: { gap: 12, marginTop: 10 },
  saveBtn: { backgroundColor: '#111', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveBtnSuccess: { backgroundColor: '#00B89A' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  newBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD' },
  newBtnText: { color: '#666', fontSize: 15, fontWeight: '600' },
});

export default InvestmentScenarioScreen;