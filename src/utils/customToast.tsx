import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';

// App theme colors (aligned with HEADER_BG, CARD_BLUE, error/success used across app)
const TOAST_THEME = {
  primary: '#035093',
  primaryText: '#FFFFFF',
  errorBg: '#FEE2E2',
  errorText: '#DC2626',
  errorBorder: '#DC2626',
  normalBg: '#F8FAFC',
  normalText: '#0F172A',
  normalBorder: '#64748B',
  shadow: '#000',
};

const AnimatedToastWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: object;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      {children}
    </Animated.View>
  );
};

const toastConfig = {
  successResponse: ({ text1 }: { text1?: string }) => (
    <AnimatedToastWrapper style={styles.successContainer}>
      <Text style={[styles.textStyle, { color: TOAST_THEME.primaryText }]} numberOfLines={3}>
        {text1}
      </Text>
    </AnimatedToastWrapper>
  ),
  errorResponse: ({ text1 }: { text1?: string }) => (
    <AnimatedToastWrapper style={styles.errorContainer}>
      <Text style={[styles.textStyle, { color: TOAST_THEME.errorText }]} numberOfLines={3}>
        {text1}
      </Text>
    </AnimatedToastWrapper>
  ),
  normalResponse: ({ text1 }: { text1?: string }) => (
    <AnimatedToastWrapper style={styles.normalContainer}>
      <Text style={[styles.textStyle, { color: TOAST_THEME.normalText }]} numberOfLines={3}>
        {text1}
      </Text>
    </AnimatedToastWrapper>
  ),
};

// Toast functions – theme-aligned, consistent position & timing
export const successToast = (message: string, time = 3000) => {
  Toast.show({
    type: 'successResponse',
    text1: message,
    position: 'bottom',
    visibilityTime: time,
    bottomOffset: 65,
  });
};

export const errorToast = (message: string, time = 2000, position: 'top' | 'bottom' = 'bottom') => {
  Toast.show({
    type: 'errorResponse',
    text1: message,
    position,
    visibilityTime: time,
    ...(position === 'top' ? { topOffset: 50 } : { bottomOffset: 60 }),
  });
};

export const normalToast = (message: string, time = 2000) => {
  Toast.show({
    type: 'normalResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 50,
  });
};

export default toastConfig;

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '600',
  },

  successContainer: {
    minHeight: 52,
    width: '92%',
    maxWidth: 400,
    backgroundColor: TOAST_THEME.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(255,255,255,0.5)',
    shadowColor: TOAST_THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
   
  },

  errorContainer: {
    minHeight: 52,
    width: '92%',
    maxWidth: 400,
    backgroundColor: TOAST_THEME.errorBg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    borderLeftColor: TOAST_THEME.errorBorder,
    shadowColor: TOAST_THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
 
  },

  normalContainer: {
    minHeight: 52,
    width: '92%',
    maxWidth: 400,
    backgroundColor: TOAST_THEME.normalBg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    borderLeftColor: TOAST_THEME.normalBorder,
    shadowColor: TOAST_THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  
  },
});

