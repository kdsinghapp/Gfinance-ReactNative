  // // src/compoent/GrowthChart.tsx
  // import React from 'react';
  // import { View, StyleSheet, Dimensions } from 'react-native';
  // import Svg, {
  //   Path,
  //   Text as SvgText,
  //   Line,
  // } from 'react-native-svg';
  // import { formatCurrency } from '../engine/calculator';

  // const { width: SCREEN_WIDTH } = Dimensions.get('window');
  // const CHART_W = SCREEN_WIDTH - 64;
  // const CHART_H = 220;
  // const PAD_L = 55;
  // const PAD_R = 20;
  // const PAD_T = 20;
  // const PAD_B = 40;

  // type ChartItem = {
  //   year: number;
  //   label?: string;
  //   optimistic: number;
  //   base: number;
  //   conservative: number;
  // };

  // type Props = {
  //   data: ChartItem[];
  //   allocation: {
  //     equities: number;
  //     fixedIncome: number;
  //     cash: number;
  //     crypto: number;
  //   };
  // };

  // const ASSET_COLORS = {
  //   equities: '#3B82F6',
  //   fixedIncome: '#22C55E',
  //   cash: '#F59E0B',
  //   crypto: '#8B5CF6',
  // };

  // const GrowthChart: React.FC<Props> = ({ data, allocation }) => {
  //   if (!data || data.length < 2) return null;

  //   // Use base scenario for the stacked chart visualization
  //   const maxVal = Math.max(...data.map((d) => d.base));
  //   const minVal = 0;
  //   const range = maxVal - minVal || 1;
  //   const plotW = CHART_W - PAD_L - PAD_R;
  //   const plotH = CHART_H - PAD_T - PAD_B;

  //   const xOf = (i: number) => {
  //     const val = PAD_L + (i / Math.max(1, data.length - 1)) * plotW;
  //     return isNaN(val) ? PAD_L : val;
  //   };

  //   const yOf = (v: number) => {
  //     const pct = range > 0 ? (v - minVal) / range : 0;
  //     const val = PAD_T + (1 - Math.min(1, Math.max(0, pct))) * plotH;
  //     return isNaN(val) ? PAD_T + plotH : val;
  //   };

  //   // Build stacked paths
  //   // Assets are stacked: Cash -> Fixed Income -> Equities -> Crypto
  //   const getStackedValue = (val: number, assetIndex: number) => {
  //     const stack = ['cash', 'fixedIncome', 'equities', 'crypto'];
  //     let sum = 0;
  //     for (let i = 0; i <= assetIndex; i++) {
  //       const key = stack[i] as keyof typeof allocation;
  //       sum += val * (allocation[key] ?? 0);
  //     }
  //     return sum;
  //   };

  //   const buildAreaPath = (assetIndex: number) => {
  //     // Top line of the area
  //     let path = `M ${xOf(0).toFixed(1)} ${yOf(getStackedValue(data[0].base, assetIndex)).toFixed(1)}`;
  //     for (let i = 1; i < data.length; i++) {
  //       path += ` L ${xOf(i).toFixed(1)} ${yOf(getStackedValue(data[i].base, assetIndex)).toFixed(1)}`;
  //     }

  //     // Bottom line of the area (top of previous asset, or bottom of chart)
  //     if (assetIndex === 0) {
  //       const bottomY = (PAD_T + plotH).toFixed(1);
  //       path += ` L ${xOf(data.length - 1).toFixed(1)} ${bottomY} L ${xOf(0).toFixed(1)} ${bottomY} Z`;
  //     } else {
  //       for (let i = data.length - 1; i >= 0; i--) {
  //         path += ` L ${xOf(i).toFixed(1)} ${yOf(getStackedValue(data[i].base, assetIndex - 1)).toFixed(1)}`;
  //       }
  //       path += ' Z';
  //     }
  //     return path;
  //   };

  //   const yLabels = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
  //     value: minVal + pct * range,
  //     y: yOf(minVal + pct * range),
  //   }));

  //   const lastIdx = data.length - 1;

  //   return (
  //     <View style={styles.container}>
  //       <Svg width={CHART_W} height={CHART_H}>
  //         {/* Grid Lines */}
  //         {yLabels.map((l, i) => (
  //           <Line
  //             key={`grid-${i}`}
  //             x1={PAD_L} y1={l.y} x2={CHART_W - PAD_R} y2={l.y}
  //             stroke="#F1F5F9"
  //             strokeWidth={1}
  //           />
  //         ))}

  //         {/* Stacked Areas */}
  //         <Path d={buildAreaPath(3)} fill={ASSET_COLORS.crypto} opacity={0.8} />
  //         <Path d={buildAreaPath(2)} fill={ASSET_COLORS.equities} opacity={0.8} />
  //         <Path d={buildAreaPath(1)} fill={ASSET_COLORS.fixedIncome} opacity={0.8} />
  //         <Path d={buildAreaPath(0)} fill={ASSET_COLORS.cash} opacity={0.8} />

  //         {/* Y Axis Labels */}
  //         {yLabels.map((l, i) => (
  //           <SvgText
  //             key={`ylabel-${i}`}
  //             x={PAD_L - 8}
  //             y={l.y + 4}
  //             textAnchor="end"
  //             fill="#94A3B8"
  //             fontSize={9}
  //             fontWeight="600"
  //           >
  //             {formatCurrency(l.value)}
  //           </SvgText>
  //         ))}

  //         {/* X Axis Start / End */}
  //         <SvgText
  //           x={xOf(0)}
  //           y={PAD_T + plotH + 25}
  //           textAnchor="start"
  //           fill="#64748B"
  //           fontSize={10}
  //           fontWeight="700"
  //         >
  //           HOY
  //         </SvgText>
  //         <SvgText
  //           x={xOf(lastIdx)}
  //           y={PAD_T + plotH + 25}
  //           textAnchor="end"
  //           fill="#64748B"
  //           fontSize={10}
  //           fontWeight="700"
  //         >
  //           AÑO
  //           {/* {data[lastIdx].year} */}
  //         </SvgText>
  //       </Svg>
  //     </View>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     marginTop: 10,
  //     alignItems: 'center',
  //   },
  // });

  // export default GrowthChart;


  // src/compoent/GrowthChart.tsx

  import React, { useMemo } from 'react';
  import { View, StyleSheet, Dimensions } from 'react-native';
  import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Path,
    Line,
    Text as SvgText,
  } from 'react-native-svg';

  const { width } = Dimensions.get('window');

  const CHART_WIDTH = width - 32;
  const CHART_HEIGHT = 240;

  const PAD_LEFT = 42;
  const PAD_RIGHT = 16;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 38;

  type ChartItem = {
    label?: string;
    value?: number;
    base?: number;
  };

  type Props = {
    data?: ChartItem[];
  };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const safeNumber = (value: any, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const formatYLabel = (value: number) => {
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return `${Math.round(value)}`;
  };

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  const GrowthChart: React.FC<Props> = ({ data = [] }) => {
    const chartData = useMemo(() => {
      return data
        .map((item, index) => {
          const rawValue =
            item?.value !== undefined
              ? item.value
              : item?.base !== undefined
              ? item.base
              : 0;

          return {
            label: item?.label || MONTHS[index] || `P${index + 1}`,
            value: safeNumber(rawValue, 0),
          };
        })
        .filter((item) => Number.isFinite(item.value));
    }, [data]);

    if (chartData.length < 2) {
      return null;
    }

    const values = chartData.map((item) => item.value);

    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);

    if (!Number.isFinite(minValue)) minValue = 0;
    if (!Number.isFinite(maxValue)) maxValue = 100;

    // prevent flat/infinite calculations
    if (minValue === maxValue) {
      minValue = minValue - 1;
      maxValue = maxValue + 1;
    }

    // add top/bottom padding in graph scale
    const padding = (maxValue - minValue) * 0.15;
    minValue = Math.max(0, minValue - padding);
    maxValue = maxValue + padding;

    const range = maxValue - minValue || 1;

    const plotWidth = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
    const plotHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

    const x = (index: number) => {
      if (chartData.length <= 1) return PAD_LEFT;
      return PAD_LEFT + (index / (chartData.length - 1)) * plotWidth;
    };

    const y = (value: number) => {
      const normalized = (value - minValue) / range;
      const safeNormalized = clamp(normalized, 0, 1);
      return PAD_TOP + (1 - safeNormalized) * plotHeight;
    };

    const points = chartData.map((item, index) => ({
      x: x(index),
      y: y(item.value),
      label: item.label,
      value: item.value,
    }));

    const buildSmoothPath = () => {
      if (points.length < 2) return '';

      let d = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const cpX = (current.x + next.x) / 2;

        d += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
      }

      return d;
    };

    const linePath = buildSmoothPath();

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_TOP + plotHeight} L ${points[0].x} ${PAD_TOP + plotHeight} Z`;

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const value = minValue + (i / (tickCount - 1)) * range;
      return {
        value,
        y: y(value),
      };
    });
  
  

    return (
      <View style={styles.container}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4CDFE80D" />
              <Stop offset="100%" stopColor="#7947F7" />
            </LinearGradient>

            <LinearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#8B7CFF" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#8B7CFF" stopOpacity="0.03" />
            </LinearGradient>
          </Defs>

          {yTicks.map((tick, index) => (
            <Line
              key={`grid-${index}`}
              x1={PAD_LEFT}
              y1={tick.y}
              x2={CHART_WIDTH - PAD_RIGHT}
              y2={tick.y}
              stroke="#D8DEE8"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}

          <Path d={areaPath} fill="url(#fillGradient)" />

          <Path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {yTicks.map((tick, index) => (
            <SvgText
              key={`ylabel-${index}`}
              x={PAD_LEFT - 8}
              y={tick.y + 4}
              fill="#96A0B5"
              fontSize="11"
              textAnchor="end"
            >
              {formatYLabel(tick.value)}
            </SvgText>
          ))}

          {points.map((point, index) => (
            <SvgText
              key={`xlabel-${index}`}
              x={point.x}
              y={CHART_HEIGHT - 10}
              fill="#A9A9A9"
              fontSize="10"
              textAnchor="middle"
            >
              {point.label}
            </SvgText>
          ))}
        </Svg>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      backgroundColor: '#FFFFFF',
    },
  });

  export default GrowthChart;