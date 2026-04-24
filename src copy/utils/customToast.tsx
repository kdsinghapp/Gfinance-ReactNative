import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const THEME = {
  successAccent: '#111111',
  successIcon: '#111111',
  successIconFg: '#FFFFFF',
  successTitle: '#111111',
  successSub: '#6B7280',

  errorAccent: '#DC2626',
  errorIcon: '#FEE2E2',
  errorIconFg: '#DC2626',
  errorTitle: '#B91C1C',
  errorSub: '#9CA3AF',

  normalAccent: '#64748B',
  normalIcon: '#F1F5F9',
  normalIconFg: '#64748B',
  normalTitle: '#0F172A',
  normalSub: '#6B7280',
};

const AnimatedToast = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: object;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

const CheckIcon = () => (
  <View style={[styles.iconWrap, { backgroundColor: THEME.successIcon }]}>
    <View style={styles.checkInner}>
      {/* replace with your icon library e.g. <Feather name="check" /> */}
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>✓</Text>
    </View>
  </View>
);

const CrossIcon = () => (
  <View style={[styles.iconWrap, { backgroundColor: THEME.errorIcon }]}>
    <Text style={{ color: THEME.errorIconFg, fontSize: 14, fontWeight: '700' }}>✕</Text>
  </View>
);

const InfoIcon = () => (
  <View style={[styles.iconWrap, { backgroundColor: THEME.normalIcon }]}>
    <Text style={{ color: THEME.normalIconFg, fontSize: 14, fontWeight: '700' }}>i</Text>
  </View>
);

const ToastContent = ({
  title,
  subtitle,
  titleColor,
}: {
  title: string;
  subtitle: string;
  titleColor: string;
}) => (
  <View style={styles.textBlock}>
    <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>{title}</Text>
    <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
  </View>
);

const DismissBtn = () => (
  <TouchableOpacity onPress={() => Toast.hide()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
    <Text style={styles.dismiss}>✕</Text>
  </TouchableOpacity>
);

const toastConfig = {
  successResponse: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <AnimatedToast style={[styles.base, styles.successBase]}>
      <View style={[styles.accent, { backgroundColor: THEME.successAccent }]} />
      <CheckIcon />
      <ToastContent
        title={text1 ?? 'Success'}
        subtitle={text2 ?? 'Your changes have been saved.'}
        titleColor={THEME.successTitle}
      />
      <DismissBtn />
    </AnimatedToast>
  ),

  errorResponse: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <AnimatedToast style={[styles.base, styles.errorBase]}>
      <View style={[styles.accent, { backgroundColor: THEME.errorAccent }]} />
      <CrossIcon />
      <ToastContent
        title={text1 ?? 'Error'}
        subtitle={text2 ?? 'Please try again later.'}
        titleColor={THEME.errorTitle}
      />
      <DismissBtn />
    </AnimatedToast>
  ),

  normalResponse: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <AnimatedToast style={[styles.base, styles.normalBase]}>
      <View style={[styles.accent, { backgroundColor: THEME.normalAccent }]} />
      <InfoIcon />
      <ToastContent
        title={text1 ?? 'Info'}
        subtitle={text2 ?? ''}
        titleColor={THEME.normalTitle}
      />
      <DismissBtn />
    </AnimatedToast>
  ),
};

// ── Toast helpers ──────────────────────────────────────────────
export const successToast = (title: string, subtitle = 'Your changes have been saved.', time = 3000) => {
  Toast.show({ type: 'successResponse', text1: title, text2: subtitle, position: 'top', visibilityTime: time, topOffset: 50 });
};

export const errorToast = (title: string, subtitle = 'Please try again later.', time = 2500, position: 'top' | 'bottom' = 'top') => {
  Toast.show({ type: 'errorResponse', text1: title, text2: subtitle, position, visibilityTime: time, ...(position === 'top' ? { topOffset: 50 } : { bottomOffset: 60 }) });
};

export const normalToast = (title: string, subtitle = '', time = 2000) => {
  Toast.show({ type: 'normalResponse', text1: title, text2: subtitle, position: 'top', visibilityTime: time, topOffset: 50 });
};
export default toastConfig;

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    width: '92%',
    maxWidth: 420,
    minHeight: 60,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  successBase: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorBase: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDE8E8',
  },
  normalBase: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkInner: { alignItems: 'center', justifyContent: 'center' },
  textBlock: { flex: 1, gap: 2 },
  title: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  subtitle: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  dismiss: { fontSize: 15, color: '#9CA3AF', fontWeight: '400' },
});