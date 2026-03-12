import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import imageIndex from '../../assets/imageIndex';
import ScreenNameEnum from '../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

const PreferencesScreen = () => {
  const [useRiskMoney, setUseRiskMoney] = useState(false);
const na = useNavigation()
  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.phoneFrame}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity  
            
                        onPress={()=> na.goBack()}

            style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <View style={styles.logoCircle}>
  <Image
            source={imageIndex.appLogo1} // replace with your finance logo
            style={{
            
    height:101,
    width:101
 
            }}
            resizeMode="contain"
          />    
          
                    </View>
             </View>

            <View style={styles.headerRightSpace} />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            {/* Switch Row */}
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextWrap}>
                <Text style={styles.preferenceLabel}>
                  Would you need to withdraw money before the next week?
                </Text>
              </View>

              <Switch
                value={useRiskMoney}
                onValueChange={setUseRiskMoney}
                trackColor={{ false: '#E5E7EB', true: '#111111' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>

            {/* Input / Dropdown */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Financial Knowledge Level</Text>
              <TouchableOpacity style={styles.selectBox}>
                <Text style={styles.placeholderText}>Select level</Text>
                <Text style={styles.dropdownIcon}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Disabled Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Review your inputs before generating
              </Text>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} 
            onPress={()=>{
              na.navigate(ScreenNameEnum.RecommendedAllocation)
            }}
            >
              <Text style={styles.buttonText}>Generate Simulation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
     justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
   },
  phoneFrame: {
   width:"100%" ,
   flex:1 ,
       backgroundColor:"white"

  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 22,
     fontWeight: '600',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  headerRightSpace: {
    width: 34,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
   },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  
  preferenceTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  preferenceLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  selectBox: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  noteBox: {
    height: 42,
      justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  noteText: {
    fontSize: 11,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});