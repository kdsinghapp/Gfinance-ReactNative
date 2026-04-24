import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Analytics } from '../../engine/analytics';
import font from '../../theme/font';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROFILE_QUESTIONS = i18n.t('questions.profile') as any[];

const ProfileQuizScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { financialData } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime] = useState(Date.now());

  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = PROFILE_QUESTIONS[currentIndex];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / PROFILE_QUESTIONS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleSelect = (value: any) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    const isLast = currentIndex === PROFILE_QUESTIONS.length - 1;

    if (currentQuestion.type === 'options') {
      // Short delay to let the user see the selection, then move to next
      setTimeout(() => {
        if (!isLast) {
          setCurrentIndex(currentIndex + 1);
        } else {
          finishQuiz(updatedAnswers);
        }
      }, 200);
    } else {
      // For numeric, we don't auto-advance on text change, 
      // but we handle the "Next" button elsewhere.
    }
  };

  const handleNextNumeric = () => {
    if (currentIndex < PROFILE_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz(answers);
    }
  };

  const finishQuiz = (finalAnswers: any) => {
    const duration = (Date.now() - startTime) / 1000;
    Analytics.formCompleted(duration, { ...finalAnswers, ...financialData });
    navigation.navigate(ScreenNameEnum.RecommendedAllocation, {
      quiz: { raw: finalAnswers },
      financialData
    });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };
  const ft = i18n.t('questions.financial') as any;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />

      {/* Header Layout based on screenshot */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Image source={imageIndex.back} style={styles.backImage} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.headerTitle}>{ft.title}</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.questionWrapper}>
            <Text style={styles.qLabel}>{currentQuestion.label}</Text>
            <Text style={styles.qSub}>{currentQuestion.sub}</Text>

            {currentQuestion.type === 'options' ? (
              <View style={styles.optionsGrid}>
                {currentQuestion?.options?.map((opt: any) => {
                  const optionId = opt?.id;
                  const optionLabel = opt?.label;
                  const optionEmoji = opt?.emoji || '';
                  const isSelected = answers[currentQuestion.id] === optionId;

                  return (
                    <TouchableOpacity
                      key={optionId}
                      onPress={() => handleSelect(optionId)}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      activeOpacity={0.8}
                    >
                      {opt?.emoji && <View style={[styles.emojiBg, isSelected && styles.emojiBgSelected]}>
                        <Text style={styles.emojiText}>
                          {optionEmoji}
                        </Text>
                      </View>}

                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelSelected
                        ]}
                      >
                        {optionLabel} {"  "}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.numericContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.numericInput}
                    value={answers[currentQuestion.id]?.toString() || ''}
                    onChangeText={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#CBD5E1"
                    autoFocus
                  />
                  <Text style={styles.inputUnit}>{i18n.t('questions.financial.yearsUnit')}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.nextBtn,
                    (!answers[currentQuestion.id] || answers[currentQuestion.id] === '') && styles.nextBtnDisabled
                  ]}
                  onPress={handleNextNumeric}
                  disabled={!answers[currentQuestion.id] || answers[currentQuestion.id] === ''}
                >
                  <Text style={styles.nextBtnText}>{i18n.t('questions.next')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backImage: { width: 42, height: 42, },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 6
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D6B1', // Teal color matching screenshot
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40
  },
  questionWrapper: {
    width: '100%'
  },
  qLabel: {
    fontSize: 32,
    color: '#111',
    lineHeight: 38,
    fontFamily: font.PoppinsBold,
    marginBottom: 10,
  },
  qSub: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 30,
    fontFamily: font.PoppinsRegular,

  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16
  },
  optionCard: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
    height: 150,
    padding: 15,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',

    // iOS Shadow (visible banane ke liye darker + more opacity)
    shadowColor: '#BCDBFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    // Android
    elevation: 16,

  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  optionCardSelected: {
    borderColor: 'black',
    backgroundColor: 'black',
    borderWidth: 2,
  },
  emojiBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emojiBgSelected: {
    backgroundColor: 'white',
  },
  emojiText: {
    fontSize: 30,
    textAlign: "center",
    color: "white",
    fontFamily: font.PoppinsBold
  },
  optionLabel: {
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: font.PoppinsRegular,
    fontSize: 16

  },
  optionLabelSelected: {
    color: 'white',
    textAlign: 'center',
    fontFamily: font.PoppinsRegular,
    fontSize: 16

  },
  numericContainer: {
    marginTop: 20,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 24,
    height: 80,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  numericInput: {
    flex: 1,
    fontSize: 32,
    fontFamily: font.PoppinsBold,
    color: '#0F172A',
  },
  inputUnit: {
    fontSize: 18,
    fontFamily: font.PoppinsSemiBold,
    color: '#64748B',
    marginLeft: 10,
  },
  nextBtn: {
    backgroundColor: '#000',
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: font.PoppinsBold,
  },
});

export default ProfileQuizScreen;
