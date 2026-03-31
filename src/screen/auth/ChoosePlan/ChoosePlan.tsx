import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  Platform,
  Easing,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import imageIndex from '../../../assets/imageIndex';
import i18n from '../../../i18n';
import { Storage } from '../../../engine/storage';
import { useFocusEffect } from '@react-navigation/native';
import font from '../../../theme/font';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const ChoosePlan = () => {
  const navigation = useNavigation<any>();
  const [hasSaved, setHasSaved] = useState(false);
  const [locale, setLocale] = useState(i18n.locale);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      Storage.hasPlan().then(setHasSaved);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      return () => {
        // optional cleanup
      };
    }, [])
  );

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
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Language Toggle */}
        {/* <View style={styles.langToggleWrap}>
            <TouchableOpacity
              style={[styles.langBtn, i18n.locale === 'es' && styles.langBtnActive]}
              onPress={() => {
                i18n.locale = 'es';
                setLocale('es');
              }}
            >
              <Text style={[styles.langText, i18n.locale === 'es' && styles.langTextActive]}>ES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, i18n.locale === 'en' && styles.langBtnActive]}
              onPress={() => {
                i18n.locale = 'en';
                setLocale('en');
              }}
            >
              <Text style={[styles.langText, i18n.locale === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
          </View> */}
        <View style={{
          justifyContent: 'center',
          alignItems: "center"
        }}>
          <Image source={imageIndex.appLogo1} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={[styles.title, {
          fontFamily: font.PoppinsBold,

        }]}>{i18n.t('splash.tagline')}</Text>
        <Text style={[styles.subtitle, {
          fontFamily: font.PoppinsRegular,
          color: "#000000"
        }]}>{i18n.t('splash.subtitle')}</Text>

        <Image source={imageIndex.financeIllustration} style={styles.heroImage} resizeMode="contain" />

        <View style={styles.buttonGroup}>
          {/* Start My Plan */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.mainBtn, { backgroundColor: '#000000' }]} // Vibrant Teal
            onPress={() => navigation.navigate(ScreenNameEnum.ProfileQuizScreen)}
          >
            <Text style={styles.primaryBtnText}>{i18n.t('splash.cta')}</Text>
            <Image source={imageIndex.Planning} style={styles.btnIcon} />
          </TouchableOpacity>

          {/* View Saved Plans */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.mainBtn, { backgroundColor: '#5D00DF' }]} // Indigo
            onPress={() => navigation.navigate(ScreenNameEnum.SavedPlansScreen)}
          >
            <Text style={styles.primaryBtnText}>{i18n.t('splash.saved')}</Text>
            <Image source={imageIndex.ViewSavedPlans} style={styles.btnIcon} />
          </TouchableOpacity>

          {/* Financial Calculator */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.mainBtn, { backgroundColor: '#22C55E' }]} // Amber
            onPress={() => navigation.navigate(ScreenNameEnum.FinancialCalculatorScreen)}
          >
            <Text style={styles.primaryBtnText}>{i18n.t('financialCalculator')}</Text>
            <Image source={imageIndex.calnder} style={styles.btnIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'space-between', paddingVertical: WINDOW_HEIGHT * 0.04 },
  logo: { width: 133, height: 33, marginBottom: 8 },
  title: { fontSize: 26, color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 8, lineHeight: 20 },
  heroImage: { width: '100%', flex: 1, maxHeight: WINDOW_HEIGHT * 0.39, marginBottom: 15 },
  buttonGroup: { width: '100%', gap: 10 },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

  },
  btnIcon: {
    height: 22,
    width: 22,
    marginLeft: 12,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: font.PoppinsBold },
  secondaryBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD' },
  secondaryBtnText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  langToggleWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 4,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  langTextActive: {
    color: '#0F172A',
  },
});

export default ChoosePlan;