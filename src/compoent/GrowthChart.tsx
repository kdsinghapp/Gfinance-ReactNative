import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CHART_WIDTH = width - 32;
const CHART_HEIGHT = 240;

const PAD_LEFT = 42;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 38;

type ChartItem = {
  label?: string;
  pessimistic: number;
  neutral: number;
  optimistic: number;
};

type Props = {
  data?: ChartItem[];
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const safeNumber = (value: any, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const formatYLabel = (value: number) => {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return `${Math.round(value)}`;
};

const addOffsetIfEqual = (p: number, n: number, o: number) => {
  if (p === n && n === o) {
    return [p - 1, n, o + 1];
  }
  return [p, n, o];
};

const GrowthChart: React.FC<Props> = ({ data = [] }) => {

  const chartData = useMemo(() => {
    return data.map((item, index) => {
      let p = safeNumber(item.pessimistic);
      let n = safeNumber(item.neutral);
      let o = safeNumber(item.optimistic);

      if (index > 0) {
        [p, n, o] = addOffsetIfEqual(p, n, o);
      }

      return {
        label: item?.label || MONTHS[index] || `P${index + 1}`,
        pessimistic: p,
        neutral: n,
        optimistic: o,
      };
    });
  }, [data]);

  if (chartData.length < 2) return null;

  const values = chartData.flatMap(item => [
    item.pessimistic,
    item.neutral,
    item.optimistic
  ]);

  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);

  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  }

  const padding = (maxValue - minValue) * 0.15;
  minValue = Math.max(0, minValue - padding);
  maxValue = maxValue + padding;

  const range = maxValue - minValue || 1;

  const plotWidth = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const x = (index: number) =>
    PAD_LEFT + (index / (chartData.length - 1)) * plotWidth;

  const y = (value: number) => {
    const normalized = (value - minValue) / range;
    return PAD_TOP + (1 - clamp(normalized, 0, 1)) * plotHeight;
  };

  const buildPoints = (key: 'pessimistic' | 'neutral' | 'optimistic') =>
    chartData.map((item, index) => ({
      x: x(index),
      y: y(item[key]),
      label: item.label
    }));

  const pessimisticPoints = buildPoints('pessimistic');
  const neutralPoints = buildPoints('neutral');
  const optimisticPoints = buildPoints('optimistic');

  const buildSmoothPath = (pts: any[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const cpX = (current.x + next.x) / 2;

      d += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }

    return d;
  };

  const buildArea = (path: string, pts: any[]) =>
    `${path} L ${pts[pts.length - 1].x} ${PAD_TOP + plotHeight}
     L ${pts[0].x} ${PAD_TOP + plotHeight} Z`;

  const pessPath = buildSmoothPath(pessimisticPoints);
  const neutralPath = buildSmoothPath(neutralPoints);
  const optPath = buildSmoothPath(optimisticPoints);

  const pessArea = buildArea(pessPath, pessimisticPoints);
  const neutralArea = buildArea(neutralPath, neutralPoints);
  const optArea = buildArea(optPath, optimisticPoints);

  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = minValue + (i / (tickCount - 1)) * range;
    return { value, y: y(value) };
  });

  return (
    <View style={styles.container}>

      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>

        {/* GRID */}
        {yTicks.map((tick, index) => (
          <Line
            key={index}
            x1={PAD_LEFT}
            y1={tick.y}
            x2={CHART_WIDTH - PAD_RIGHT}
            y2={tick.y}
            stroke="#E5E7EB"
            strokeDasharray="4 4"
          />
        ))}

        {/* AREAS */}
{/* <Path d={optArea} fill="#F59E0B" opacity={0.1} />
<Path d={pessArea} fill="#3B82F6" opacity={0.2} />
<Path d={neutralArea} fill="#22C55E" opacity={0.1} /> */}

        {/* LINES */}
        <Path
          d={optPath}
          stroke="#F59E0B"
          strokeWidth={3}
          fill="none"
          opacity={0.9}
        />

        <Path
          d={pessPath}
          stroke="#3B82F6"
          strokeWidth={2}
          fill="none"
          strokeDasharray="6 4"
          opacity={0.7}
        />

        <Path
          d={neutralPath}
          stroke="#22C55E"
          strokeWidth={4}
          fill="none"
          opacity={1}
        />

        {/* Y LABELS */}
        {yTicks.map((tick, index) => (
          <SvgText
            key={index}
            x={PAD_LEFT - 8}
            y={tick.y + 4}
            fontSize="11"
            fill="#6B7280"
            textAnchor="end"
          >
            {formatYLabel(tick.value)}
          </SvgText>
        ))}

        {/* X LABELS */}
        {pessimisticPoints.map((p, i) => (
          <SvgText
            key={i}
            x={p.x}
            y={CHART_HEIGHT - 10}
            fontSize="10"
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {p.label}
          </SvgText>
        ))}

      </Svg>

      {/* LEGEND */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Pesimista</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>Neutral</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Optimista</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  legendContainer: {
    flexDirection: 'row',
    marginTop: 14,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },

  legendText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
});

export default GrowthChart;