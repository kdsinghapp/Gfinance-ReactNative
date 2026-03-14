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
import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
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
  const data = [];

  for (let year = 0; year <= years; year++) {
    const value = calculateFutureValue({
      capital,
      contribution,
      annualRate,
      years: year,
      frequency,
    });

    data.push({
      year,
      value,
    });
  }

  return data;
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

  const chartData = useMemo(() => {
    return generateChartData({
      capital: data.capital || 0,
      contribution: data.monthly || 0,
      annualRate: Number(data.returnRate || 0),
      years: data.horizon || 1,
      frequency: data.frequency || "monthly",
    });
  }, [data]);

  const maxValue = useMemo(() => {
    const maxChart = Math.max(...chartData.map((item) => item.value), data.fv || 0, 1);
    return maxChart * 1.15;
  }, [chartData, data.fv]);

  const chartPath = useMemo(() => {
    return createLinePath(chartData, maxValue, data.horizon || 1);
  }, [chartData, maxValue, data.horizon]);

  const lastPoint = chartData[chartData.length - 1];

  const lastPointX =
    LEFT_PADDING +
    ((lastPoint?.year || 0) / (data.horizon || 1)) *
    (CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING);

  const lastPointY =
    TOP_PADDING +
    (CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) -
    (((lastPoint?.value || 0) / maxValue) *
      (CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING));

  const yLabels = Array.from({ length: 5 }).map((_, i) => {
    return Math.round(maxValue - (maxValue / 4) * i);
  });

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi escenario de inversión</Text>
        <Text style={styles.subtitle}>Simulada con QFinance</Text>

        {/* Main Value Card */}
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>
            Valor estimado en {data.horizon} Años
          </Text>
          <Text style={styles.value}>{formatCurrency(data.fv || 0)}</Text>
          {/* <Text style={styles.growthText}>
            +{formatCurrency(data.growth || 0)} ({(data.gainPct || 0).toFixed(1)}%)
          </Text> */}
        </View>

        {/* Graph Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Crecimiento proyectado de la cartera</Text>

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
                  stroke={i === 4 ? "#D8DDE7" : "#EEF1F5"}
                  strokeWidth="1"
                />
              );
            })}

            {/* Y axis labels */}
            {yLabels.map((label, i) => {
              const y =
                TOP_PADDING +
                ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i +
                4;

              return (
                <SvgText
                  key={`ylabel-${i}`}
                  x={2}
                  y={y}
                  fontSize="10"
                  fill="#7A7F8A"
                >
                  {label}
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

            {/* Main line */}
            <Path
              d={chartPath}
              stroke="#7B61FF"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Last point */}
            <Circle
              cx={lastPointX}
              cy={lastPointY}
              r="5"
              fill="#7B61FF"
            />
          </Svg>

          <View style={styles.legendBox}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>
              {Number(data.returnRate || 0)}% Rendimiento anual
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Optimistic} style={styles.icon} />
              <Text style={styles.infoLabel}>Investor Type</Text>
            </View>
            <Text style={styles.infoValue}>Dynamic</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Conservative} style={styles.icon} />
              <Text style={styles.infoLabel}>Tasa de interés</Text>
            </View>
            <Text style={styles.infoValue}>{data.returnRate}%</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Base} style={styles.icon} />
              <Text style={styles.infoLabel}>Período de inversión</Text>
            </View>
            <Text style={styles.infoValue}>{data.horizon} Years</Text>
          </View>

          {/* <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Base} style={styles.icon} />
              <Text style={styles.infoLabel}>
                {getContributionLabel(data.frequency)}
              </Text>
            </View>
            <Text style={styles.infoValue}>{formatCurrency(data.monthly || 0)}</Text>
          </View> */}

          {/* <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Base} style={styles.icon} />
              <Text style={styles.infoLabel}>Capital inicial</Text>
            </View>
            <Text style={styles.infoValue}>{formatCurrency(data.capital || 0)}</Text>
          </View> */}

          {/* <View style={[styles.infoRow, { marginBottom: 0 }]}>
            <View style={styles.infoLeft}>
              <Image source={imageIndex.Base} style={styles.icon} />
              <Text style={styles.infoLabel}>Total Invested</Text>
            </View>
            <Text style={styles.infoValue}>{formatCurrency(data.invested || 0)}</Text>
          </View> */}
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
    marginBottom: 20,
  },

  valueCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  valueLabel: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 8,
  },

  value: {
    fontSize: 30,
    fontWeight: "800",
    color: "#101828",
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

  legendBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#7B61FF",
    marginRight: 8,
  },

  legendText: {
    fontSize: 13,
    color: "#667085",
    fontWeight: "500",
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