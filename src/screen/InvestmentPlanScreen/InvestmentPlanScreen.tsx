//  import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//    Animated,
//   Image,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import i18n from '../../i18n';
// import { Analytics } from '../../engine/analytics';
// import ScreenNameEnum from '../../routes/screenName.enum';
// import StatusBarComponent from '../../compoent/StatusBarCompoent';
// import imageIndex from '../../assets/imageIndex';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const QUESTIONS = i18n.t('questions.items');

// const InvestmentPlanScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const [answers, setAnswers] = useState<Record<string, any>>({});
//   const [startTime] = useState(Date.now());
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Analytics.formStarted();
//     Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
//   }, []);

//   const setAnswer = (id: string, value: any) => {
//     setAnswers((prev) => ({ ...prev, [id]: value }));
//   };

//   const answeredCount = QUESTIONS.filter((q: any) => answers[q.id] !== undefined && answers[q.id] !== '').length;
//   const allAnswered = answeredCount === QUESTIONS.length;

//   const handleSubmit = () => {
//     const duration = (Date.now() - startTime) / 1000;
//     Analytics.formCompleted(duration, answers);
//     navigation.navigate(ScreenNameEnum.RecommendedAllocation, { answers });
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBarComponent />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//          <Image source={imageIndex.back} 
         
//          style={{
//           height:43,
//           width:43,

//          }}
//          />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{i18n.t('questions.title')}</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
//         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
//           <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//             {/* <Text style={styles.introText}>{i18n.t('questions.subtitle')}</Text> */}

//             {QUESTIONS.map((q: any, idx: number) => (
//               <QuestionCard
//                 key={q.id}
//                 question={q}
//                 index={idx}
//                 value={answers[q.id]}
//                 onChange={(val: any) => setAnswer(q.id, val)}
//               />
//             ))}

//             <TouchableOpacity
//               style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]}
//               onPress={handleSubmit}
//               disabled={!allAnswered}
//             >
//               <Text style={styles.submitBtnText}>{i18n.t('questions.calculate')}</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// function QuestionCard({ question, index, value, onChange }: any) {
//   const isAnswered = value !== undefined && value !== '';

//   return (
//     <View style={[styles.qCard, isAnswered && styles.qCardAnswered]}>
//       <View style={styles.qHeader}>
//         <View style={[styles.qNum, isAnswered && styles.qNumAnswered]}>
//           <Text style={[styles.qNumText, isAnswered && styles.qNumTextAnswered]}>{isAnswered ? '✓' : index + 1}</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.qLabel}>{question.label}</Text>
//           <Text style={styles.qSub}>{question.sub}</Text>
//         </View>
//       </View>

//       <View style={styles.inputWrap}>
//         {question.type === 'options' ? (
//           <View style={styles.optionsWrap}>
//             {question.options.map((opt: string) => (
//               <TouchableOpacity
//                 key={opt}
//                 onPress={() => onChange(opt)}
//                 style={[styles.optionBtn, value === opt && styles.optionBtnSelected]}
//               >
//                 <Text style={[styles.optionText, value === opt && styles.optionTextSelected]}>{opt}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.numInputWrap}>
//             {question.unit === '$' && <Text style={styles.unitPrefix}>$</Text>}
//             <TextInput
//               style={styles.numInput}
//               value={value?.toString() || ''}
//               onChangeText={onChange}
//               keyboardType="numeric"
//               placeholder={question.placeholder}
//               placeholderTextColor="#999"
//             />
//             {question.unit && question.unit !== '$' && <Text style={styles.unitSuffix}>{question.unit}</Text>}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#FFF' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
//   backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
//   backIcon: { fontSize: 24, color: '#000' },
//   headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '900', color: '#000' },
//   scrollContent: { padding: 20, paddingBottom: 40 },
//   introText: { textAlign: 'center', color: '#666', marginBottom: 20, fontSize: 14 },
//   qCard: { backgroundColor: '#F8F9FA', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
//   qCardAnswered: { borderColor: '#424c4a66', backgroundColor: '#FFFFD' },
//   qHeader: { flexDirection: 'row', gap: 12, marginBottom: 16 },
//   qNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
//   qNumAnswered: { backgroundColor: 'black' },
//   qNumText: { fontSize: 13, fontWeight: '700', color: '#666' },
//   qNumTextAnswered: { color: '#FFF' },
//   qLabel: { fontSize: 16, fontWeight: '700', color: '#111' },
//   qSub: { fontSize: 12, color: '#888', marginTop: 2 },
//   inputWrap: { marginTop: 8 },
//   optionsWrap: { gap: 8 },
//   optionBtn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
//   optionBtnSelected: { borderColor: 'black', backgroundColor: 'black' },
//   optionText: { fontSize: 14, color: '#333' },
//   optionTextSelected: { color: 'white', fontWeight: '700' },
//   numInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#DDD', paddingHorizontal: 12 },
//   unitPrefix: { fontSize: 16, fontWeight: '700', color: 'black', marginRight: 4 },
//   numInput: { flex: 1, height: 48, fontSize: 16, color: '#111', fontWeight: '600' },
//   unitSuffix: { fontSize: 14, color: '#666', marginLeft: 4 },
//   submitBtn: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
//   submitBtnDisabled: { opacity: 0.5 },
//   submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
// });

// export default InvestmentPlanScreen;

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
import { Analytics } from '../../engine/analytics';
import ScreenNameEnum from '../../routes/screenName.enum';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import imageIndex from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUESTIONS = i18n.t('questions.items') as any[];

const InvestmentPlanScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime] = useState(Date.now());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Analytics.formStarted();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const setAnswer = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = QUESTIONS.filter(
    (q: any) => answers[q.id] !== undefined && answers[q.id] !== ''
  ).length;

  const allAnswered = answeredCount === QUESTIONS.length;

  const handleSubmit = () => {
    const duration = (Date.now() - startTime) / 1000;
    Analytics.formCompleted(duration, answers);
    navigation.navigate(ScreenNameEnum.RecommendedAllocation, { answers });
  };

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

        <Text style={styles.headerTitle}>{i18n.t('questions.title')}</Text>
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
            {QUESTIONS.map((q: any, idx: number) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                value={answers[q.id]}
                onChange={(val: any) => setAnswer(q.id, val)}
              />
            ))}

            <TouchableOpacity
              style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!allAnswered}
            >
              <Text style={styles.submitBtnText}>
                {i18n.t('questions.calculate')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface QuestionCardProps {
  question: any;
  index: number;
  value: any;
  onChange: (val: any) => void;
}

function QuestionCard({ question, index, value, onChange }: QuestionCardProps) {
  const isAnswered = value !== undefined && value !== '';

  return (
    <View style={[styles.qCard, isAnswered && styles.qCardAnswered]}>
      <View style={styles.qHeader}>
        <View style={[styles.qNum, isAnswered && styles.qNumAnswered]}>
          <Text style={[styles.qNumText, isAnswered && styles.qNumTextAnswered]}>
            {isAnswered ? '✓' : index + 1}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.qLabel}>{question.label}</Text>
          <Text style={styles.qSub}>{question.sub}</Text>
        </View>
      </View>

      <View style={styles.inputWrap}>
        {question.type === 'options' ? (
          <View style={[styles.optionsWrap, question.bigOptions && styles.optionsWrapBig]}>
            {question.options.map((opt: any) => {
              const optionId = typeof opt === 'string' ? opt : opt.id;
              const optionLabel = typeof opt === 'string' ? opt : opt.label;
              const optionEmoji = typeof opt === 'string' ? '' : opt.emoji || '';
              const isSelected = value === optionId;

              return (
                <TouchableOpacity
                  key={optionId}
                  onPress={() => onChange(optionId)}
                  style={[
                    styles.optionBtn,
                    question.bigOptions && styles.bigOptionBtn,
                    isSelected && styles.optionBtnSelected,
                  ]}
                  activeOpacity={0.8}
                >
                  {optionEmoji ? (
                    <View style={styles.optionContent}>
                      {question.bigOptions && <Text style={styles.emojiBig}>{optionEmoji}</Text>}
                      <Text
                        style={[
                          styles.optionText,
                          question.bigOptions && styles.bigOptionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {!question.bigOptions && `${optionEmoji} `}
                        {optionLabel}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {optionLabel}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.numInputWrap}>
            {question.unit === '$' && <Text style={styles.unitPrefix}>$</Text>}

            <TextInput
              style={styles.numInput}
              value={value?.toString() || ''}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder={question.placeholder}
              placeholderTextColor="#999"
            />

            {question.unit && question.unit !== '$' && (
              <Text style={styles.unitSuffix}>{question.unit}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },

  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backImage: {
    width: 43,
    height: 43,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  qCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  qCardAnswered: {
    borderColor: '#00000022',
    backgroundColor: '#F3F6F4',
  },

  qHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  qNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  qNumAnswered: {
    backgroundColor: '#000000',
  },

  qNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666666',
  },

  qNumTextAnswered: {
    color: '#FFFFFF',
  },

  qLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },

  qSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    lineHeight: 18,
  },

  inputWrap: {
    marginTop: 8,
  },

  optionsWrap: {
    gap: 8,
  },
  optionsWrapBig: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBig: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },

  bigOptionBtn: {
    width: '48%',
    minHeight: 110,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 8,
  },

  optionBtnSelected: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },

  optionText: {
    fontSize: 14,
    color: '#333333',
  },

  bigOptionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  numInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 12,
  },

  unitPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
  },

  numInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
  },

  unitSuffix: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },

  submitBtn: {
    backgroundColor: '#000000',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  submitBtnDisabled: {
    opacity: 0.5,
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InvestmentPlanScreen;