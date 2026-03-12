// src/screen/auth/ChoosePlan/ChoosePlan.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  Easing,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import imageIndex from '../../../assets/imageIndex';
import i18n from '../../../i18n';
import { Storage } from '../../../engine/storage';

const ChoosePlan = () => {
  const navigation = useNavigation<any>();
  const [hasSaved, setHasSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Storage.hasPlan().then(setHasSaved);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBarComponent />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Image source={imageIndex.appLogo1} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>{i18n.t('splash.tagline')}</Text>
          <Text style={styles.subtitle}>{i18n.t('splash.subtitle')}</Text>

          <Image source={imageIndex.financeIllustration} style={styles.heroImage} resizeMode="contain" />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.primaryBtn}
              onPress={() => navigation.navigate(ScreenNameEnum.InvestmentPlanScreen)}
            >
              <Text style={styles.primaryBtnText}>{i18n.t('splash.cta')}</Text>
            </TouchableOpacity>

            {hasSaved && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate(ScreenNameEnum.SavedPlansScreen)}
              >
                <Text style={styles.secondaryBtnText}>{i18n.t('splash.saved')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 120, height: 32, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#111', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  heroImage: { width: '100%', height: 260, marginBottom: 40 },
  buttonGroup: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD' },
  secondaryBtnText: { color: '#333', fontSize: 16, fontWeight: '600' },
});

export default ChoosePlan;