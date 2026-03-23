import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n';
import { Storage, PlanData } from '../../engine/storage';
import { Analytics } from '../../engine/analytics';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import { getProfileLabel, formatCurrency } from '../../engine/calculator';
import ScreenNameEnum from '../../routes/screenName.enum';
import imageIndex from '../../assets/imageIndex';
import { successToast } from '../../utils/customToast';
import font from '../../theme/font';

const SavedPlansScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const storedPlans = await Storage.loadPlans();
      setPlans(storedPlans || []);
console.log("storedPlans",storedPlans)
      if (storedPlans?.length > 0) {
        Analytics.savedPlanViewed();
      }
    } catch (error) {
      console.log('Load plans error:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPlanDate = (dateString?: string) => {
    if (!dateString) return '--';
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '--';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getHorizonYears = (item: any) => {
    return item?.scenarios?.years || item?.answers?.horizon || 0;
  };

  const getBaseValue = (item: any) => {
    if (item?.scenarios?.base) return item.scenarios.base;
    if (item?.answers?.capital) return item.answers.capital;
    return 0;
  };

  const openPlanDetails = (item: any) => {
    const quiz = { raw: item.answers };
    const type = 'save';

    const financialData = {
      capital: item?.answers?.capital || 0,
      monthly: item?.answers?.monthly || 0,
      frequency: item?.answers?.frequency || 'monthly',
      horizon: getHorizonYears(item),
      returnRate: '8',
    };

    navigation.navigate(ScreenNameEnum.InvestmentScenarioScreen, {
      quiz,
      financialData,
      type,
      savedPlan: item,
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar plan',
      '¿Estás seguro de que quieres eliminar este plan?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await Storage.deletePlan(id);
              const updatedPlans = plans.filter(plan => plan.id !== id);
              setPlans(updatedPlans);
              Analytics.planDeleted();
              successToast("Plan eliminado", "Su plan ha sido eliminado correctamente.", 8000);
            } catch (error) {
              console.log('Delete plan error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={imageIndex.back} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Planes guardados</Text>

          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            marginTop: 15
          }]}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#5F16EA" />
              <Text style={styles.loaderText}>Cargando planes...</Text>
            </View>
          ) : plans.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No hay planes guardados</Text>
              <Text style={styles.emptySubtitle}>
                Tus planes de inversión guardados aparecerán aquí.
              </Text>
            </View>
          ) : (
            plans.map((item) => {
              const profile = getProfileLabel(item?.allocation);
              const horizon = getHorizonYears(item);
              const baseValue = getBaseValue(item);

              return (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.planTitle}>
                    {item?.name || 'Plan'} - {formatPlanDate(item?.savedAt)}
                  </Text>

                  <View style={styles.infoBlock}>
                    <InfoRow
                      label="Profile:"
                      value={profile}
                      valueStyle={styles.profileValue}
                    />
                    <InfoRow
                      label="Horizonte:"
                      value={`${horizon} years`}
                      valueStyle={styles.blueValue}
                    />
                    <InfoRow
                      label="Valor base:"
                      value={formatCurrency(baseValue)}
                      valueStyle={styles.greenValue}
                    />
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.detailsButtonWrap}
                      onPress={() => openPlanDetails(item)}
                    >
                      <LinearGradient
                        colors={['#5D00DF', '#2F0071',]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.detailsButton}
                      >
                        <Text style={styles.detailsButtonText}>Ver detalles</Text>

                        <View style={styles.eyeWrap}>
                          <Image
                            source={imageIndex.ViewSavedPlans}
                            style={styles.eyeIcon}
                          />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      <Image source={imageIndex.delite} style={styles.deleteIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
  valueStyle?: any;
};

const InfoRow = ({ label, value, valueStyle }: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginHorizontal: 10,
  },
  headerRightSpace: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  loaderWrap: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 15,
    color: '#7C7C7C',
    fontWeight: '500',
  },

  emptyWrap: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
  backgroundColor: '#FFF',
borderRadius: 22,
padding: 16,
marginBottom: 16,

// iOS Shadow (FIXED)
shadowColor: '#BCDBFF', // must be dark
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.3,
shadowRadius: 10,

// Android
elevation: 20,

  },

  planTitle: {
    fontSize: 21,
     color: '#121212',
    marginBottom: 10,
    fontFamily:font.PoppinsBold
  },

  infoBlock: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  infoLabel: {
 
    color: '#A9A9A9',
    fontFamily:font.PoppinsRegular
 
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
     color: '#1E1E1E',
     fontFamily:font.PoppinsSemiBold ,
     marginLeft:10
  },
  profileValue: {
    color: '#1F1F1F',
  },
  blueValue: {
    color: '#0088FF',
  },
  greenValue: {
    color: '#22C55E',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonWrap: {
    flex: 1,
    marginRight: 12,
  },
  detailsButton: {
    height: 48,
    borderRadius: 18,
     flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006C282E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily:font.PoppinsBold
   },
  eyeWrap: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
    tintColor: '#FFF',
  },

  deleteButton: {
    alignItems: "center",
    justifyContent: "center" ,
 
  },
  deleteIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});

export default SavedPlansScreen;