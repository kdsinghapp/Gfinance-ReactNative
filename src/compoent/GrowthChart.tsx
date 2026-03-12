// src/compoent/GrowthChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText, Line } from 'react-native-svg';
import { formatCurrency } from '../engine/calculator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_W = SCREEN_WIDTH - 64; 
const CHART_H = 160;
const PAD_L = 50;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 25;

type Props = {
  data: any[];
};

export default function GrowthChart({ data }: Props) {
  if (!data || data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.optimistic));
  const minVal = 0;
  const range = maxVal - minVal || 1;
  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;

  const xOf = (i: number) => {
    const val = PAD_L + (i / (Math.max(1, data.length - 1))) * plotW;
    return isNaN(val) ? PAD_L : val;
  };
  const yOf = (v: number) => {
    const pct = range > 0 ? (v - minVal) / range : 0;
    const val = PAD_T + (1 - Math.min(1, Math.max(0, pct))) * plotH;
    return isNaN(val) ? PAD_T + plotH : val;
  };

  const buildPath = (key: string) =>
    data.map((d, i) => {
      const x = xOf(i).toFixed(1);
      const y = yOf(d[key]).toFixed(1);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

  const buildFill = (key: string) => {
    const path = buildPath(key);
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

  return (
    <View style={styles.container}>
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          <LinearGradient id="fillOpt" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00E5C0" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#00E5C0" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {yLabels.map((l, i) => (
          <Line
            key={i}
            x1={PAD_L} y1={l.y} x2={CHART_W - PAD_R} y2={l.y}
            stroke="#EEE"
            strokeDasharray="4,4"
          />
        ))}

        <Path d={buildFill('optimistic')} fill="url(#fillOpt)" />
        <Path d={buildPath('optimistic')} fill="none" stroke="#00E5C0" strokeWidth={2} />
        <Path d={buildPath('base')} fill="none" stroke="#4A9EFF" strokeWidth={2} strokeDasharray="5,3" />
        <Path d={buildPath('conservative')} fill="none" stroke="#6B839A" strokeWidth={1.5} strokeDasharray="2,4" />

        {yLabels.map((l, i) => (
          <SvgText key={i} x={PAD_L - 6} y={l.y + 4} textAnchor="end" fill="#999" fontSize={8}>
            {formatCurrency(l.value)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
});
