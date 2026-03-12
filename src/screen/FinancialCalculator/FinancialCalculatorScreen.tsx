import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import imageIndex from '../../assets/imageIndex';
import ScreenNameEnum from '../../routes/screenName.enum';

const contributionTabs = ['Annual', 'Monthly', 'Manual'];

const portfolioData = [2, 4, 7, 10, 14, 18, 23, 29];
const capitalData = [2, 3.5, 5, 7, 9, 11, 13, 15];

const Graph = () => {
  const width = 300;
  const height = 160;
  const padding = 16;

  const maxValue = Math.max(...portfolioData, ...capitalData);

  const getX = (index: number) => {
    return padding + (index * (width - padding * 2)) / (portfolioData.length - 1);
  };

  const getY = (value: number) => {
    return height - padding - (value / maxValue) * (height - padding * 2);
  };

  const buildPath = (data: number[]) => {
    return data
      .map((value, index) => {
        const x = getX(index);
        const y = getY(value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <View style={styles.graphCard}>
      <Text style={styles.sectionTitle}>Growth trajectory</Text>

      <Svg width={width} height={height}>
        {[0, 1, 2, 3].map((_, i) => {
          const y = padding + (i * (height - padding * 2)) / 3;
          return (
            <Line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#E9E9E9"
              strokeWidth="1"
            />
          );
        })}

        <Path
          d={buildPath(portfolioData)}
          fill="none"
          stroke="#39C98D"
          strokeWidth="3"
        />
        <Path
          d={buildPath(capitalData)}
          fill="none"
          stroke="#F5A46C"
          strokeWidth="3"
        />

        {portfolioData.map((value, index) => (
          <Circle
            key={`p-${index}`}
            cx={getX(index)}
            cy={getY(value)}
            r="3"
            fill="#39C98D"
          />
        ))}

        {capitalData.map((value, index) => (
          <Circle
            key={`c-${index}`}
            cx={getX(index)}
            cy={getY(value)}
            r="3"
            fill="#F5A46C"
          />
        ))}
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#39C98D' }]} />
          <Text style={styles.legendText}>Portfolio</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F5A46C' }]} />
          <Text style={styles.legendText}>Capital</Text>
        </View>
      </View>
    </View>
  );
};

const FinancialCalculatorScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <Text style={styles.backText}>{'‹'}</Text>
          </TouchableOpacity>

          <Image source={imageIndex.appLogo1}
            style={{

              width: 140,
              height: 32,


            }}
            resizeMode="contain"

          />
          <View style={{ width: 34 }} />
        </View>

        <Text style={styles.title}>Financial Calculator</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Initial Capital</Text>
          <TextInput
            style={styles.input}
            placeholder="10,000"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Periodic Contribution</Text>
          <TextInput
            style={styles.input}
            placeholder="200"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Contribution frequency</Text>
          <View style={styles.tabRow}>
            {contributionTabs.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.tabButton,
                  index === 0 && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    index === 0 && styles.activeTabText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Expected Annual Return</Text>
          <TextInput
            style={styles.input}
            placeholder="8"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Return</Text>
          <TextInput
            style={styles.input}
            placeholder="8"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Estimated future value</Text>

          <View style={styles.resultTopRow}>
            <Text style={styles.resultValue}>25,935€</Text>
            <View style={styles.gainBadge}>
              <Text style={styles.gainBadgeText}>+ 159%</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountTitle}>Invested amount</Text>
              <Text style={styles.amountValue}>13,000€</Text>
            </View>

            <View>
              <Text style={styles.amountTitle}>Growth of worth</Text>
              <Text style={styles.amountValue}>+ 12,935€</Text>
            </View>
          </View>
        </View>

        <Graph />

        <TouchableOpacity style={styles.button} 
        onPress={()=> navigation.navigate(ScreenNameEnum.InvestmentScenarioScreen)}
        >
          <Text style={styles.buttonText}>Generate Simulation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinancialCalculatorScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  header: {
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  logoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  brandText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    marginTop: -2,
  },


  title: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
     borderColor: '#E7E7E7',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ECECEC',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  tabButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  resultCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  resultTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
  },
  gainBadge: {
    backgroundColor: '#3BCB86',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  gainBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountTitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  graphCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
  },
  sectionTitle: {
    width: '100%',
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    marginTop: 18,
    backgroundColor: 'black',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});