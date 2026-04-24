import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";
import { useRoute } from "@react-navigation/native";

import CustomHeader from "../../compoent/CustomHeader";
import imageIndex from "../../assets/imageIndex";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 70;
const CHART_HEIGHT = 220;
const LEFT_PADDING = 36;
const RIGHT_PADDING = 12;
const TOP_PADDING = 16;
const BOTTOM_PADDING = 28;

type FinancialDataType = {
  capital?: number;
  monthly?: number;
  frequency?: "monthly" | "weekly" | "annual" | "yearly";
  horizon?: number;
  returnRate?: string | number;
  gainPct?: number;
  growth?: number;
  invested?: number;
  fv?: number;
};

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getPeriodsPerYear = (frequency?: string) => {
  switch (frequency) {
    case "weekly":
      return 52;
    case "annual":
    case "yearly":
      return 1;
    case "monthly":
    default:
      return 12;
  }
};

const getContributionLabel = (frequency?: string) => {
  switch (frequency) {
    case "weekly":
      return "Weekly Contribution";
    case "annual":
    case "yearly":
      return "Contribución anual";
    case "monthly":
    default:
      return "Contribución mensual";
  }
};

const calculateFutureValue = ({
  capital,
  contribution,
  annualRate,
  years,
  frequency,
}: {
  capital: number;
  contribution: number;
  annualRate: number;
  years: number;
  frequency: string;
}) => {
  const periodsPerYear = getPeriodsPerYear(frequency);
  const totalPeriods = years * periodsPerYear;
  const periodicRate = annualRate / 100 / periodsPerYear;

  let value = capital;

  for (let i = 0; i < totalPeriods; i++) {
    value = value * (1 + periodicRate) + contribution;
  }

  return value;
};

const SCENARIO_OFFSETS = {
  pesimista: -2,
  neutral: 0,
  optimista: 3,
};

const generateChartData = ({
  capital,
  contribution,
  annualRate,
  years,
  frequency,
}: {
  capital: number;
  contribution: number;
  annualRate: number;
  years: number;
  frequency: string;
}) => {
  const data: { year: number; value: number }[] = [];

  for (let year = 0; year <= years; year++) {
    const value = calculateFutureValue({
      capital,
      contribution,
      annualRate,
      years: year,
      frequency,
    });

    data.push({ year, value });
  }

  return data;
};

const generateScenarioData = ({
  capital,
  contribution,
  baseRate,
  years,
  frequency,
}: {
  capital: number;
  contribution: number;
  baseRate: number;
  years: number;
  frequency: string;
}) => {
  const build = (offset: number) =>
    generateChartData({
      capital,
      contribution,
      annualRate: Math.max(0, baseRate + offset),
      years,
      frequency,
    });

  return {
    pesimista: build(SCENARIO_OFFSETS.pesimista),
    neutral: build(SCENARIO_OFFSETS.neutral),
    optimista: build(SCENARIO_OFFSETS.optimista),
  };
};

const createLinePath = (
  data: { year: number; value: number }[],
  maxValue: number,
  totalYears: number
) => {
  if (!data.length) return "";

  const usableWidth = CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING;
  const usableHeight = CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING;

  return data
    .map((item, index) => {
      const x =
        LEFT_PADDING + (item.year / totalYears) * usableWidth;

      const y =
        TOP_PADDING +
        usableHeight -
        (item.value / maxValue) * usableHeight;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const FinanShare = () => {
  const route = useRoute<any>();
  const { financialData = {} } = route?.params || {};

  const data: FinancialDataType = {
    capital: Number(financialData?.capital ?? 0),
    monthly: Number(financialData?.monthly ?? 0),
    frequency: financialData?.frequency ?? "monthly",
    horizon: Number(financialData?.horizon ?? 0),
    returnRate: Number(financialData?.returnRate ?? 0),
    gainPct: Number(financialData?.gainPct ?? 0),
    growth: Number(financialData?.growth ?? 0),
    invested: Number(financialData?.invested ?? 0),
    fv: Number(financialData?.fv ?? 0),
  };

  const scenarios = useMemo(() => {
    return generateScenarioData({
      capital: data.capital || 0,
      contribution: data.monthly || 0,
      baseRate: Number(data.returnRate || 0),
      years: data.horizon || 1,
      frequency: data.frequency || "monthly",
    });
  }, [data]);

  const scenarioFV = useMemo(() => ({
    pesimista: scenarios.pesimista[scenarios.pesimista.length - 1]?.value || 0,
    neutral: scenarios.neutral[scenarios.neutral.length - 1]?.value || 0,
    optimista: scenarios.optimista[scenarios.optimista.length - 1]?.value || 0,
  }), [scenarios]);

  const maxValue = useMemo(() => {
    const allValues = [
      ...scenarios.pesimista.map((d) => d.value),
      ...scenarios.neutral.map((d) => d.value),
      ...scenarios.optimista.map((d) => d.value),
      data.fv || 0,
    ];
    return Math.max(...allValues, 1) * 1.15;
  }, [scenarios, data.fv]);

  const chartPaths = useMemo(() => ({
    pesimista: createLinePath(scenarios.pesimista, maxValue, data.horizon || 1),
    neutral: createLinePath(scenarios.neutral, maxValue, data.horizon || 1),
    optimista: createLinePath(scenarios.optimista, maxValue, data.horizon || 1),
  }), [scenarios, maxValue, data.horizon]);

  const yLabels = Array.from({ length: 5 }).map((_, i) => {
    return Math.round(maxValue - (maxValue / 4) * i);
  });

  const SCENARIO_COLORS = {
    pesimista: '#4A9EFF',
    neutral: '#22C55E',
    optimista: '#F97316',
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi escenario de inversión</Text>
        <Text style={styles.subtitle}>Simulada con QFinance</Text>

        {/* Scenario title */}
        <Text style={styles.scenarioSectionTitle}>Valor futuro según escenarios</Text>

        {/* Scenario boxes */}
        <View style={styles.scenarioRow}>
          <View style={[styles.scenarioBox, { borderTopColor: SCENARIO_COLORS.pesimista }]}>
            <Text style={styles.scenarioLabel}>Pesimista</Text>
            <Text style={[styles.scenarioValue, { color: SCENARIO_COLORS.pesimista }]}>
              {formatCurrency(scenarioFV.pesimista)}
            </Text>
            <Text style={styles.scenarioRate}>{Math.max(0, Number(data.returnRate || 0) + SCENARIO_OFFSETS.pesimista)}% anual</Text>
          </View>
          <View style={[styles.scenarioBox, { borderTopColor: SCENARIO_COLORS.neutral }]}>
            <Text style={styles.scenarioLabel}>Neutral</Text>
            <Text style={[styles.scenarioValue, { color: SCENARIO_COLORS.neutral }]}>
              {formatCurrency(scenarioFV.neutral)}
            </Text>
            <Text style={styles.scenarioRate}>{Number(data.returnRate || 0)}% anual</Text>
          </View>
          <View style={[styles.scenarioBox, { borderTopColor: SCENARIO_COLORS.optimista }]}>
            <Text style={styles.scenarioLabel}>Optimista</Text>
            <Text style={[styles.scenarioValue, { color: SCENARIO_COLORS.optimista }]}>
              {formatCurrency(scenarioFV.optimista)}
            </Text>
            <Text style={styles.scenarioRate}>{Number(data.returnRate || 0) + SCENARIO_OFFSETS.optimista}% anual</Text>
          </View>
        </View>

        {/* Graph Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Proyección de crecimiento</Text>

          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y =
                TOP_PADDING +
                ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i;
              return (
                <Line
                  key={`grid-${i}`}
                  x1={LEFT_PADDING}
                  y1={y}
                  x2={CHART_WIDTH - RIGHT_PADDING}
                  y2={y}
                  stroke={i === 4 ? '#D8DDE7' : '#EEF1F5'}
                  strokeWidth="1"
                />
              );
            })}

            {/* Y axis labels */}
            {yLabels.map((label, i) => {
              const y =
                TOP_PADDING +
                ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i + 4;
              return (
                <SvgText key={`ylabel-${i}`} x={2} y={y} fontSize="10" fill="#7A7F8A">
                  {label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
                </SvgText>
              );
            })}

            {/* X labels */}
            {Array.from({ length: (data.horizon || 1) + 1 }).map((_, i) => {
              const x =
                LEFT_PADDING +
                (i / (data.horizon || 1)) *
                (CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING);
              return (
                <SvgText
                  key={`xlabel-${i}`}
                  x={x - 4}
                  y={CHART_HEIGHT - 8}
                  fontSize="10"
                  fill="#7A7F8A"
                >
                  {i}
                </SvgText>
              );
            })}

            {/* Pesimista line */}
            <Path
              d={chartPaths.pesimista}
              stroke={SCENARIO_COLORS.pesimista}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />

            {/* Neutral line */}
            <Path
              d={chartPaths.neutral}
              stroke={SCENARIO_COLORS.neutral}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Optimista line */}
            <Path
              d={chartPaths.optimista}
              stroke={SCENARIO_COLORS.optimista}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          </Svg>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendBox}>
              <View style={[styles.legendDot, { backgroundColor: SCENARIO_COLORS.pesimista }]} />
              <Text style={styles.legendText}>Pesimista</Text>
            </View>
            <View style={styles.legendBox}>
              <View style={[styles.legendDot, { backgroundColor: SCENARIO_COLORS.neutral }]} />
              <Text style={styles.legendText}>Neutral</Text>
            </View>
            <View style={styles.legendBox}>
              <View style={[styles.legendDot, { backgroundColor: SCENARIO_COLORS.optimista }]} />
              <Text style={styles.legendText}>Optimista</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>Tasa de interés</Text>
            </View>
            <Text style={styles.infoValue}>{data.returnRate}%</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoLabel}>Período de inversión</Text>
            </View>
            <Text style={styles.infoValue}>{data.horizon} años</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>Compartir mi plan</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinanShare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    alignSelf: "center",
    marginTop: 10,
    color: "#101828",
  },

  subtitle: {
    alignSelf: "center",
    color: "#8B93A1",
    marginTop: 4,
    marginBottom: 14,
  },

  scenarioSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },

  scenarioRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },

  scenarioBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  scenarioLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#667085",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  scenarioValue: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },

  scenarioRate: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  growthText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#12B76A",
  },

  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 10,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
  },

  legendBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
    resizeMode: "contain",
  },

  infoLabel: {
    fontSize: 14,
    color: "#667085",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
  },

  shareButton: {
    backgroundColor: "#34C759",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  shareText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});