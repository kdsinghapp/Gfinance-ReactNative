import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import imageIndex from '../../assets/imageIndex';
import { styles } from './style';
import TextInputField from '../../compoent/TextInputField';
import ScreenNameEnum from '../../routes/screenName.enum';


const goalOptions = [
  'Retirement',
  'General Savings',
  'Home Purchase',
  'Financial Independence',
];

const riskOptions = [
  {
    key: 'Conservative',
    label: 'Conservative',
    icon: imageIndex.conservativeIcon,
  },
  {
    key: 'Moderate',
    label: 'Moderate',
    icon: imageIndex.moderateIcon,
  },
  {
    key: 'Aggressive',
    label: 'Aggressive',
    icon: imageIndex.aggressiveIcon,
  },
];

const YourGoalScreen = () => {
  const navigation = useNavigation();
  const [age, setAge] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Home Purchase');
  const [selectedRisk, setSelectedRisk] = useState('');

  const isFormValid = age.trim() !== '' && selectedGoal !== '' && selectedRisk !== '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>{'‹'}</Text>
          </TouchableOpacity>

          <Image
            source={imageIndex.appLogo1} // replace with your finance logo
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerRightSpace} />
        </View>

        <Text style={styles.screenTitle}>Your Goal</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInputField placeholder="Enter your age"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
          />


          <Text style={[styles.label, styles.sectionSpacing]}>Primary Goal</Text>

          {goalOptions.map((goal) => {
            const isSelected = selectedGoal === goal;
            return (
              <TouchableOpacity
                key={goal}
                style={[styles.goalButton, isSelected && styles.goalButtonSelected]}
                onPress={() => setSelectedGoal(goal)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    isSelected && styles.goalButtonTextSelected,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.label, styles.sectionSpacing]}>Risk Tolerance</Text>

          <View style={styles.riskRow}>
            {riskOptions.map((item) => {
              const isSelected = selectedRisk === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.riskCard, isSelected && styles.riskCardSelected]}
                  onPress={() => setSelectedRisk(item.key)}
                  activeOpacity={0.85}
                >
                  <Image source={item.icon} style={styles.riskIcon} resizeMode="contain" />
                  <Text style={[styles.riskText, isSelected && {
                    color: "white",
                    fontSize: 13,
                    fontWeight: '600',

                  }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, isFormValid && styles.nextButtonActive]}
            activeOpacity={0.85}
            disabled={!isFormValid}
            onPress={() => {
              navigation.navigate(ScreenNameEnum.InvestmentPlanScreen)
            }}
          >
            <Text
              style={[
                styles.nextButtonText,
                isFormValid && styles.nextButtonTextActive,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default YourGoalScreen;