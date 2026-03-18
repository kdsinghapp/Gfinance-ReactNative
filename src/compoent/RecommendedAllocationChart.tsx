// import React, { useMemo } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Svg, { Circle } from 'react-native-svg';

// type Props = {
//   value: number;
//   total?: number;
//   title?: string;
//   centerLabel?: string;
//   size?: number;
//   strokeWidth?: number;
//   activeColor?: string;
//   trackColor?: string;
// };

// const formatCurrency = (amount: number) => {
//   return `$${amount.toLocaleString('en-US')}`;
// };

// export default function RecommendedAllocationChart({
//   value,
//   total = 100,
//   title = 'Recommended Allocation',
//   centerLabel = 'Total Portfolio',
//   size = 220,
//   strokeWidth = 28,
//   activeColor = '#08C315',
//   trackColor = '#BFE8C2',
// }: Props) {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   const progress = Math.max(0, Math.min(value / total, 1));
//   const dashOffset = circumference * (1 - progress);

//   const center = size / 2;

//   const displayValue = useMemo(() => formatCurrency(value), [value]);

//   return (
//     <View style={styles.card}>
 
//       <View style={styles.chartWrapper}>
//         <Svg width={size} height={size}>
//           {/* Background Track */}
//           <Circle
//             cx={center}
//             cy={center}
//             r={radius}
//             stroke={trackColor}
//             strokeWidth={strokeWidth}
//             fill="none"
//             strokeLinecap="round"
//           />

//           {/* Active Arc */}
//           <Circle
//             cx={center}
//             cy={center}
//             r={radius}
//             stroke={activeColor}
//             strokeWidth={strokeWidth}
//             fill="none"
//             strokeLinecap="round"
//             strokeDasharray={`${circumference} ${circumference}`}
//             strokeDashoffset={dashOffset}
//             transform={`rotate(40 ${center} ${center})`}
//           />
//         </Svg>

//         <View style={[styles.centerContent, { width: size, height: size }]}>
//           <Text style={styles.centerLabel}>{centerLabel}</Text>
//           <Text style={styles.centerValue}>{displayValue}</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     paddingHorizontal: 18,
//     paddingTop: 18,
//     paddingBottom: 22,
//     alignItems: 'flex-start',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111111',
//     marginBottom: 18,
//   },
//   chartWrapper: {
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerContent: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerLabel: {
//     fontSize: 15,
//     color: '#A0A0A0',
//     marginBottom: 6,
//   },
//   centerValue: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#111111',
//   },
// });
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import font from '../theme/font';

type Props = {
  value: number;
  total?: number;
  title?: string;
  centerLabel?: string;
  size?: number;
  strokeWidth?: number;
  activeColor?: string;
  trackColor?: string;
};

const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function RecommendedAllocationChart({
  value,
  total = 100,
  title = '',
  centerLabel = '',
  size = 189,
  strokeWidth = 28,
  activeColor = '#08C315',
  trackColor = '#BFE8C2',
}: Props) {
  const safeTotal = total > 0 ? total : 1;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(value / safeTotal, 1));
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;

  const displayValue = useMemo(() => formatCurrency(value), [value]);
  const progressPercent = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  return (
    <View style={styles.card}>
        {title &&       <Text style={styles.title}>{title}</Text>
}

      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        <View style={[styles.centerContent, { width: size, height: size }]}>
          <Text style={styles.centerLabel}>{centerLabel}</Text>
       

          <Text style={styles.centerValue}>{displayValue} {""}</Text>

 
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 18,
  },
  chartWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    fontSize: 12,
    color: '#A9A9A9',
    marginBottom: 6,
    fontFamily:font.PoppinsRegular
  },
  centerValue: {
    fontSize: 21,
     color: '#111111',
    fontFamily:font.PoppinsBold
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#08C315',
    marginTop: 6,
  },
});