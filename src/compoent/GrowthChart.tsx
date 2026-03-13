// // src/compoent/GrowthChart.tsx
// import React from 'react';
// import { View, StyleSheet, Dimensions, Text } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText, Line, Circle } from 'react-native-svg';
// import { formatCurrency } from '../engine/calculator';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const CHART_W = SCREEN_WIDTH - 64; 
// const CHART_H = 180;
// const PAD_L = 50;
// const PAD_R = 20;
// const PAD_T = 20;
// const PAD_B = 30;

// type Props = {
//   data: any[];
// };

// export default function GrowthChart({ data }: Props) {
//   if (!data || data.length < 2) return null;
// const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const maxVal = Math.max(...data.map((d) => d.optimistic));
//   const minVal = 0;
//   const range = maxVal - minVal || 1;
//   const plotW = CHART_W - PAD_L - PAD_R;
//   const plotH = CHART_H - PAD_T - PAD_B;

//   const xOf = (i: number) => {
//     const val = PAD_L + (i / (Math.max(1, data.length - 1))) * plotW;
//     return isNaN(val) ? PAD_L : val;
//   };
//   const yOf = (v: number) => {
//     const pct = range > 0 ? (v - minVal) / range : 0;
//     const val = PAD_T + (1 - Math.min(1, Math.max(0, pct))) * plotH;
//     return isNaN(val) ? PAD_T + plotH : val;
//   };

//   // Build a cubic bezier path for smooth curves
//   const buildSmoothPath = (key: string) => {
//     if (data.length < 2) return '';
//     let path = `M ${xOf(0).toFixed(1)} ${yOf(data[0][key]).toFixed(1)}`;
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = xOf(i);
//       const y1 = yOf(data[i][key]);
//       const x2 = xOf(i + 1);
//       const y2 = yOf(data[i + 1][key]);
      
//       const cp1x = x1 + (x2 - x1) / 2;
//       const cp1y = y1;
//       const cp2x = x1 + (x2 - x1) / 2;
//       const cp2y = y2;
      
//       path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
//     }
//     return path;
//   };

//   const buildSmoothFill = (key: string) => {
//     const path = buildSmoothPath(key);
//     if (!path) return '';
//     const bottomY = (PAD_T + plotH).toFixed(1);
//     const startX = xOf(0).toFixed(1);
//     const endX = xOf(data.length - 1).toFixed(1);
//     return `${path} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
//   };

//   const yLabels = [0, 0.5, 1].map((pct) => ({
//     value: minVal + pct * range,
//     y: yOf(minVal + pct * range),
//   }));

//   const lastIdx = data.length - 1;

//   return (
//     <View style={styles.container}>
//       <Svg width={CHART_W} height={CHART_H}>
//         <Defs>
//           <LinearGradient id="fillOpt" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0%" stopColor="#4CDFE8" stopOpacity="0.25" />
//             <Stop offset="100%" stopColor="#7947F7" stopOpacity="0" />
//           </LinearGradient>
//           <LinearGradient id="fillBase" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.15" />
//             <Stop offset="100%" stopColor="#7947F7" stopOpacity="0" />
//           </LinearGradient>
//         </Defs>

//         {/* Grid Lines */}
//         {yLabels.map((l, i) => (
//           <Line
//             key={i}
//             x1={PAD_L} y1={l.y} x2={CHART_W - PAD_R} y2={l.y}
//             stroke="#F0F0F0"
//             strokeWidth={1}
//           />
//         ))}

//         {/* Fills */}
//         <Path d={buildSmoothFill('optimistic')} fill="url(#fillOpt)" />
//         <Path d={buildSmoothFill('base')} fill="url(#fillBase)" />

//         {/* Lines */}
//         <Path d={buildSmoothPath('optimistic')} fill="none" stroke="#00E5C0" strokeWidth={3} strokeLinecap="round" />
//         <Path d={buildSmoothPath('base')} fill="none" stroke="#4A9EFF" strokeWidth={3} strokeLinecap="round" />
//         <Path d={buildSmoothPath('conservative')} fill="none" stroke="#6B839A" strokeWidth={2} strokeDasharray="4,4" strokeLinecap="round" />

//         {/* End Markers (Dots) */}
//         <Circle cx={xOf(lastIdx)} cy={yOf(data[lastIdx].optimistic)} r={4} fill="#00E5C0" stroke="#FFF" strokeWidth={1} />
//         <Circle cx={xOf(lastIdx)} cy={yOf(data[lastIdx].base)} r={4} fill="#4A9EFF" stroke="#FFF" strokeWidth={1} />
//         <Circle cx={xOf(lastIdx)} cy={yOf(data[lastIdx].conservative)} r={3} fill="#6B839A" stroke="#FFF" strokeWidth={1} />

//         {/* Y Axis Labels */}
//         {yLabels.map((l, i) => (
//           <SvgText key={i} x={PAD_L - 8} y={l.y + 4} textAnchor="end" fill="#AAAAAA" fontSize={9} fontWeight="600">
//             {formatCurrency(l.value)}
//           </SvgText>
//         ))}

//         {/* X Axis Labels */}
//         <SvgText x={xOf(0)} y={PAD_T + plotH + 18} textAnchor="start" fill="#999" fontSize={10} fontWeight="700">
//           HOY
//         </SvgText>
//         <SvgText x={xOf(lastIdx)} y={PAD_T + plotH + 18} textAnchor="end" fill="#999" fontSize={10} fontWeight="700">
//           AÑO {data[lastIdx].year}
//         </SvgText>
//       </Svg>
//         <View style={{
//             flexDirection:"row"
//           }}>
//       {MONTHS.map((s)=>{
//         return(
//           <View style={{
//             flexDirection:"row"
//           }}>
//           <Text>{s}</Text>
//           </View>
//         )
//       })}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { marginTop: 10, alignItems: 'center' },
// });

// src/compoent/GrowthChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Line,
  Circle,
} from 'react-native-svg';
import { formatCurrency } from '../engine/calculator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_W = SCREEN_WIDTH - 64;
const CHART_H = 180;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 30;

type ChartItem = {
  year: number;
  month?: number;
  optimistic: number;
  base: number;
  conservative: number;
};

type Props = {
  data: ChartItem[];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GrowthChart({ data }: Props) {
  if (!data || data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.optimistic));
  const minVal = 0;
  const range = maxVal - minVal || 1;
  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;

  const xOf = (i: number) => {
    const val = PAD_L + (i / Math.max(1, data.length - 1)) * plotW;
    return isNaN(val) ? PAD_L : val;
  };

  const yOf = (v: number) => {
    const pct = range > 0 ? (v - minVal) / range : 0;
    const val = PAD_T + (1 - Math.min(1, Math.max(0, pct))) * plotH;
    return isNaN(val) ? PAD_T + plotH : val;
  };

  const buildSmoothPath = (key: keyof ChartItem) => {
    if (data.length < 2) return '';

    let path = `M ${xOf(0).toFixed(1)} ${yOf(Number(data[0][key])).toFixed(1)}`;

    for (let i = 0; i < data.length - 1; i++) {
      const x1 = xOf(i);
      const y1 = yOf(Number(data[i][key]));
      const x2 = xOf(i + 1);
      const y2 = yOf(Number(data[i + 1][key]));

      const cp1x = x1 + (x2 - x1) / 2;
      const cp1y = y1;
      const cp2x = x1 + (x2 - x1) / 2;
      const cp2y = y2;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }

    return path;
  };

  const buildSmoothFill = (key: keyof ChartItem) => {
    const path = buildSmoothPath(key);
    if (!path) return '';

    const bottomY = (PAD_T + plotH).toFixed(1);
    const startX = xOf(0).toFixed(1);
    const endX = xOf(data.length - 1).toFixed(1);

    return `${path} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  const yLabels = [0, 0.5, 1].map((pct) => ({
    value: minVal + pct * range,
    y: yOf(minVal + pct * range),
  }));

  const lastIdx = data.length - 1;

  return (
    <View style={styles.container}>
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          <LinearGradient id="fillOpt" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#4CDFE8" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#7947F7" stopOpacity="0" />
          </LinearGradient>

          <LinearGradient id="fillBase" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#7947F7" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid Lines */}
        {yLabels.map((l, i) => (
          <Line
            key={`grid-${i}`}
            x1={PAD_L}
            y1={l.y}
            x2={CHART_W - PAD_R}
            y2={l.y}
            stroke="#F0F0F0"
            strokeWidth={1}
          />
        ))}

        {/* Fill Areas */}
        <Path d={buildSmoothFill('optimistic')} fill="url(#fillOpt)" />
        <Path d={buildSmoothFill('base')} fill="url(#fillBase)" />

        {/* Lines */}
        <Path
          d={buildSmoothPath('optimistic')}
          fill="none"
          stroke="#00E5C0"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d={buildSmoothPath('base')}
          fill="none"
          stroke="#4A9EFF"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d={buildSmoothPath('conservative')}
          fill="none"
          stroke="#6B839A"
          strokeWidth={2}
          strokeDasharray="4,4"
          strokeLinecap="round"
        />

        {/* End Dots */}
        <Circle
          cx={xOf(lastIdx)}
          cy={yOf(data[lastIdx].optimistic)}
          r={4}
          fill="#00E5C0"
          stroke="#FFF"
          strokeWidth={1}
        />
        <Circle
          cx={xOf(lastIdx)}
          cy={yOf(data[lastIdx].base)}
          r={4}
          fill="#4A9EFF"
          stroke="#FFF"
          strokeWidth={1}
        />
        <Circle
          cx={xOf(lastIdx)}
          cy={yOf(data[lastIdx].conservative)}
          r={3}
          fill="#6B839A"
          stroke="#FFF"
          strokeWidth={1}
        />

        {/* Y Axis Labels */}
        {yLabels.map((l, i) => (
          <SvgText
            key={`ylabel-${i}`}
            x={PAD_L - 8}
            y={l.y + 4}
            textAnchor="end"
            fill="#AAAAAA"
            fontSize={9}
            fontWeight="600"
          >
            {formatCurrency(l.value)}
          </SvgText>
        ))}

        {/* X Axis Start / End */}
        <SvgText
          x={xOf(0)}
          y={PAD_T + plotH + 18}
          textAnchor="start"
          fill="#999"
          fontSize={10}
          fontWeight="700"
        >
          TODAY
        </SvgText>

        <SvgText
          x={xOf(lastIdx)}
          y={PAD_T + plotH + 18}
          textAnchor="end"
          fill="#999"
          fontSize={10}
          fontWeight="700"
        >
          YEAR {data[lastIdx].year}
        </SvgText>
      </Svg>

      {/* Months Row */}
      <View style={styles.monthRow}>
        {MONTHS.map((item, index) => (
          <View key={index} style={styles.monthItem}>
            <Text style={styles.monthText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  monthRow: {
    width: CHART_W - PAD_L - PAD_R,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: PAD_L - 10,
    paddingRight: PAD_R,
  },
  monthItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 9,
    color: '#999',
    fontWeight: '600',
  },
});