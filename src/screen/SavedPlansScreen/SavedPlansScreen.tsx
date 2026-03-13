// src/screen/SavedPlansScreen/SavedPlansScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n';
import { Storage, PlanData } from '../../engine/storage';
import { Analytics } from '../../engine/analytics';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import { getProfileLabel, formatCurrency } from '../../engine/calculator';
import ScreenNameEnum from '../../routes/screenName.enum';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

const SavedPlansScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const p = await Storage.loadPlans();
    setPlans(p);
    setLoading(false);
    if (p.length > 0) Analytics.savedPlanViewed();
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Eliminar plan', 'Estas segura', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive', onPress: async () => {
          await Storage.deletePlan(id);
          const updated = plans.filter(p => p.id !== id);
          setPlans(updated);
          Analytics.planDeleted();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={imageIndex.back}

            style={{
              height: 44,
              width: 44
            }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('saved.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.infoText}>Cargando...</Text>
        ) : plans?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>{i18n.t('saved.empty')}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.primaryBtn}
              onPress={() => navigation.navigate(ScreenNameEnum.InvestmentPlanScreen)}
            >
              <Text style={styles.primaryBtnText}>{i18n.t('splash.cta')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          plans?.map((item) => {
            return (
              <View key={item.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <View>
                    <Text style={styles.planType}>{i18n.t('saved.profile')} {getProfileLabel(item.allocation)}</Text>
                    <Text style={styles.planTitle}>Plan</Text>
                    <Text style={styles.planDate}>{new Date(item.savedAt).toLocaleDateString()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Image source={imageIndex.delite}
                      style={{
                        height: 25,
                        width: 25,
                        resizeMode: "contain"
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.stats}>
                  <StatItem label={i18n.t('questions.financial.initialLabel')} value={formatCurrency(item?.answers.capital)} />
                  <StatItem label={i18n.t('questions.financial.monthlyLabel')} value={formatCurrency(item?.answers.monthly)} />
                  <StatItem label={i18n.t('questions.financial.horizonLabel')} value={`${item.scenarios?.years || 0} ${i18n.t('questions.financial.yearsUnit')}`} />
                </View>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => {
                    const quiz = { raw: item.answers };
                    const type = "save"

                    const financialData = {
                      capital: item.answers.capital,
                      monthly: item.answers.monthly,
                      horizon: item.scenarios?.years || 10
                    };
                    navigation.navigate(ScreenNameEnum.InvestmentScenarioScreen, { quiz, financialData, type


                    });
                  }}
                >
                  <Text style={styles.viewBtnText}>{i18n.t('saved.viewDetails')} →</Text>
                </TouchableOpacity>
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function StatItem({ label, value, text }: any) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLab}>{label}</Text>
      {
        text
      }
      <Text style={styles.statLab}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#000' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#000' },
  scroll: { padding: 20 },
  infoText: { textAlign: 'center', color: '#999', marginTop: 40 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16, },
  emptyText: { color: '#999', fontSize: 16 },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,

    // Android shadow
    elevation: 5,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  planType: { color: 'black', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  planTitle: { color: 'black', fontSize: 20, fontWeight: '800', marginTop: 4 },
  planDate: { color: '#666', fontSize: 10, marginTop: 2 },
  deleteIcon: { fontSize: 24 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  stat: { flex: 1 },
  statVal: { color: 'black', fontSize: 16, fontWeight: '700' },
  statLab: { color: '#888', fontSize: 11, marginTop: 4 },
  viewBtn: { backgroundColor: 'black', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  viewBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  primaryBtn: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', width: "100%", marginTop: 20 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  buttonGroup: { width: '100%', gap: 12 },

});


export default SavedPlansScreen;