import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import font from '../theme/font';
import i18n from '../i18n';

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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  const buildPath = (pts: any[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  const buildArea = (path: string, pts: any[]) =>
    `${path} L ${pts[pts.length - 1].x} ${PAD_TOP + plotHeight}
     L ${pts[0].x} ${PAD_TOP + plotHeight} Z`;

  const pessPath = buildPath(pessimisticPoints);
  const neutralPath = buildPath(neutralPoints);
  const optPath = buildPath(optimisticPoints);

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
          stroke="#8B5CF6"
          strokeWidth={3}
          fill="none"
          opacity={1}
        />

        <Path
          d={pessPath}
          stroke="#EF4444"
          strokeWidth={2}
          fill="none"
          opacity={0.8}
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
        {pessimisticPoints.map((p, i) => {
          const total = pessimisticPoints.length;

          // Logic for monthly data: Show 'Start' and Year ends (Y1, Y2, etc.)
          // If the labels are too crowded, filter them further
          const isStart = i === 0;
          const isYearEnd = p.label?.startsWith('Y');
          const isLast = i === total - 1;

          if (!isStart && !isYearEnd && !isLast) return null;

          // If too many years, only show every few years
          if (isYearEnd) {
            const yearNum = parseInt(p.label?.substring(1) || '0');
            const totalYears = Math.ceil(total / 12);
            const yearFreq = totalYears > 10 ? 5 : totalYears > 5 ? 2 : 1;
            if (yearNum % yearFreq !== 0 && !isLast) return null;
          }

          return (
            <SvgText
              key={i}
              x={p.x}
              y={CHART_HEIGHT - 6}
              fontSize="10"
              fontWeight="600"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {p.label}
            </SvgText>
          );
        })}

      </Svg>

      {/* LEGEND */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>{i18n.t('results.conservative')}</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>{i18n.t('results.base')}</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={styles.legendText}>{i18n.t('results.optimistic')}</Text>
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
    fontFamily: font.PoppinsMedium,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
});

export default GrowthChart;