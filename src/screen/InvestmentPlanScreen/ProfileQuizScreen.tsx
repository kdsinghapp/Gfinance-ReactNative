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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Analytics } from '../../engine/analytics';

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

    // Short delay to let the user see the selection, then move to next
    setTimeout(() => {
        if (currentIndex < PROFILE_QUESTIONS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            const duration = (Date.now() - startTime) / 1000;
            Analytics.formCompleted(duration, { ...updatedAnswers, ...financialData });
            navigation.navigate(ScreenNameEnum.RecommendedAllocation, { 
                quiz: { raw: updatedAnswers }, 
                financialData 
            });
        }
    }, 200);
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

      <View style={styles.content}>
        <View style={styles.questionWrapper}>
            <Text style={styles.qLabel}>{currentQuestion.label}</Text>
            <Text style={styles.qSub}>{currentQuestion.sub}</Text>

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
                          {opt?.emoji &&  <View style={[styles.emojiBg, isSelected && styles.emojiBgSelected]}>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1   ,     backgroundColor: 'white',
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
  backImage: { width: 42, height: 42,   },
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
      fontSize: 28, 
      fontWeight: '900', 
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
      color: '#111', 
      lineHeight: 36, 
      marginBottom: 12 
  },
  qSub: { 
      fontSize: 16, 
      color: '#94A3B8', 
      lineHeight: 24, 
      marginBottom: 40 
  },
  optionsGrid: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between',
      gap: 16
  },
  optionCard: {
    width: (SCREEN_WIDTH - 48 - 16) / 2, // 2 items per row, gaps accounted
    height: 150,
    padding: 16,
    borderRadius: 24,
      backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
        elevation:10

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
      fontSize: 30 ,
      textAlign:"center" ,
      color:"white"
  },
  optionLabel: { 
      fontSize: 15, 
      fontWeight: '700', 
      color: '#1E293B',
      textAlign: 'center',
   },
  optionLabelSelected: { 
      color: 'white' ,
            textAlign: 'center',

  },
});

export default ProfileQuizScreen;
