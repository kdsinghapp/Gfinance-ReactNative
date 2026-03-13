import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

const InvestmentPlanScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [capital, setCapital] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
  const [horizon, setHorizon] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const allFilled = capital !== '' && amount !== '' && horizon !== '';

  const handleSubmit = () => {
    const financialData = {
      capital: parseFloat(capital),
      monthly: parseFloat(amount),
      frequency,
      horizon: parseFloat(horizon),
    };
    navigation.navigate(ScreenNameEnum.ProfileQuizScreen, { financialData });
  };

  const ft = i18n.t('questions.financial') as any;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={imageIndex.back}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{ft?.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.qCard}>
              <Text style={styles.qLabel}>{ft.initialLabel}</Text>
              <Text style={styles.qSub}>{ft.initialSub}</Text>
              <View style={[styles.numInputWrap, { marginTop: 12 }]}>
                <Text style={styles.unitPrefix}>$</Text>
                <TextInput
                  style={styles.numInput}
                  value={capital}
                  onChangeText={setCapital}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.qCard}>
              <Text style={styles.qLabel}>{ft.monthlyLabel}</Text>
              <Text style={styles.qSub}>{ft.monthlySub}</Text>
              <View style={[styles.numInputWrap, { marginTop: 12, marginBottom: 16 }]}>
                <Text style={styles.unitPrefix}>$</Text>
                <TextInput
                  style={styles.numInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.freqLabel}>{ft.frequencyLabel}</Text>
              <View style={styles.tabRow}>
                {(['weekly', 'monthly', 'annual'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.tabButton, frequency === f && styles.activeTabButton]}
                    onPress={() => setFrequency(f)}
                  >
                    <Text style={[styles.tabText, frequency === f && styles.activeTabText]}>
                      {ft[f]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.qCard}>
              <Text style={styles.qLabel}>{ft.horizonLabel}</Text>
              <Text style={styles.qSub}>{ft.horizonSub}</Text>
              <View style={[styles.numInputWrap, { marginTop: 12 }]}>
                <TextInput
                  style={styles.numInput}
                  value={horizon}
                  onChangeText={setHorizon}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor="#999"
                />
                <Text style={styles.unitSuffix}>{ft.yearsUnit}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, !allFilled && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!allFilled}
            >
              <Text style={styles.submitBtnText}>
                {i18n.t('questions.next')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backImage: { width: 43, height: 43 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  qCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  qLabel: { fontSize: 16, fontWeight: '800', color: '#111111' },
  qSub: { fontSize: 12, color: '#888888', marginTop: 4 },
  numInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
  },
  unitPrefix: { fontSize: 18, fontWeight: '700', color: '#000000', marginRight: 6 },
  numInput: { flex: 1, height: '100%', fontSize: 16, color: '#111111', fontWeight: '700' },
  unitSuffix: { fontSize: 14, color: '#64748B', marginLeft: 6, fontWeight: '600' },
  freqLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 10, textTransform: 'uppercase' },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: { backgroundColor: '#000000' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#4A5568' },
  activeTabText: { color: '#FFFFFF' },
  submitBtn: {
    backgroundColor: '#000000',
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});

export default InvestmentPlanScreen;