// src/compoent/DonutChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  equity: number;
  fixed: number;
  cash: number;
  size?: number;
};

const COLORS = {
  equity: '#00E5C0',
  fixed: '#4A9EFF',
  cash: '#F0C040',
  border: '#1A2840',
};

export default function DonutChart({ equity, fixed, cash, size = 130 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const strokeWidth = size * 0.12;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: equity, color: COLORS.equity },
    { value: fixed, color: COLORS.fixed },
    { value: cash, color: COLORS.cash },
  ];

  let cumulativePct = 0;
  const offset = circumference * 0.25;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, idx) => {
          const dash = (seg.value / 100) * circumference;
          const gap = circumference - dash;
          const dashOffset = -(cumulativePct / 100) * circumference + offset;
          cumulativePct += seg.value;
          return (
            <Circle
              key={idx}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={styles.centerPct}>{equity}%</Text>
        <Text style={styles.centerLabel}>Stocks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  centerPct: { fontSize: 20, fontWeight: '900', color: '#111' },
  centerLabel: { fontSize: 9, color: '#666', fontWeight: '600' },
});
