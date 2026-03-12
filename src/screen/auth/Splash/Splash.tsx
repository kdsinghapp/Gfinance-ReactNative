// src/screen/auth/Splash/Splash.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import ScreenNameEnum from '../../../routes/screenName.enum';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import i18n from '../../../i18n';
import { Storage } from '../../../engine/storage';

const Splash: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    Storage.hasPlan().then(setHasPlan);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace(ScreenNameEnum.ChoosePlan);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent backgroundColor="#FFF" barStyle="dark-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoBox}>
          <FastImage
            style={styles.logo}
            source={imageIndex.appLogo1}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center' },
  content: { alignItems: 'center' },
  logoBox: { marginBottom: 20 },
  logo: { width: 140, height: 40 },
  tagline: { fontSize: 16, color: '#666', fontWeight: '600', textAlign: 'center' },
});

export default Splash;