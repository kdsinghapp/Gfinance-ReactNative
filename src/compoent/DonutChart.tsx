// src/compoent/DonutChart.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import imageIndex from '../assets/imageIndex';

type Props = {
  equity: number;
  fixed: number;
  cash: number;
  crypto?: number;
  size?: number;
  totalValue?: string;
  title?: string;
};

const COLORS = {
  track: '#EEF3EE',
  equity: '#00C81A',
  fixed: '#4A9EFF',
  cash: '#F5B942',
  crypto: '#8B5CF6',
};

const GAP_SIZE = 8; // visual gap between arcs

export default function DonutChart({
  equity,
  fixed,
  cash,
  crypto = 0,
  size = 220,
  totalValue = '',
  title = 'Portfolio Value',
}: Props) {
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = useMemo(() => {
    const rawValues = [
      { key: 'equity', value: Number(equity || 0), color: COLORS.equity },
      { key: 'fixed', value: Number(fixed || 0), color: COLORS.fixed },
      { key: 'cash', value: Number(cash || 0), color: COLORS.cash },
      { key: 'crypto', value: Number(crypto || 0), color: COLORS.crypto },
    ].filter(item => item.value > 0);

    const total = rawValues.reduce((sum, item) => sum + item.value, 0);

    if (!total) return [];

    let accumulated = 0;

    return rawValues.map(item => {
      const fraction = item.value / total;
      const rawLength = fraction * circumference;
      const visibleLength = Math.max(rawLength - GAP_SIZE, 0);

      const segment = {
        ...item,
        fraction,
        strokeDasharray: `${visibleLength} ${circumference}`,
        strokeDashoffset: -accumulated,
      };

      accumulated += rawLength;
      return segment;
    });
  }, [equity, fixed, cash, crypto, circumference]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background Ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={COLORS.track}
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map(segment => (
            <Circle
              key={segment.key}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              rotation={-90}
              origin={`${center}, ${center}`}
            />
          ))}
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
           <Image source={imageIndex.G}
                    style={{
                      width: 130,
                      height: 45,
                      bottom:10
          
                    }}
                    resizeMode='contain'
                  />
          {/* <Text style={styles.title}>{title}</Text> */}
          <Text style={styles.value} numberOfLines={1}>
            {totalValue}
          </Text>
        </View>
      </View>

     
    </View>
  );
}

type LegendItemProps = {
  color: string;
  label: string;
  value: number;
};

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '62%',
  },
  title: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '800',
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 18,
    width: '100%',
    paddingHorizontal: 12,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
});