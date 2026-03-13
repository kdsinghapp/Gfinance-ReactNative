// import React, { useMemo } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
// import { useRoute } from "@react-navigation/native";

// import CustomHeader from "../../compoent/CustomHeader";
// import imageIndex from "../../assets/imageIndex";

// const { width } = Dimensions.get("window");
// const CHART_WIDTH = width - 70;
// const CHART_HEIGHT = 220;
// const LEFT_PADDING = 36;
// const RIGHT_PADDING = 12;
// const TOP_PADDING = 16;
// const BOTTOM_PADDING = 28;

// type FinancialDataType = {
//   capital?: number;
//   monthly?: number;
//   frequency?: "monthly" | "weekly" | "annual" | "yearly";
//   horizon?: number;
//   returnRate?: string | number;
//   gainPct?: number;
//   growth?: number;
//   invested?: number;
//   fv?: number;
// };

// const formatCurrency = (value: number = 0) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "EUR",
//     maximumFractionDigits: 0,
//   }).format(value);
// };

// const getPeriodsPerYear = (frequency?: string) => {
//   switch (frequency) {
//     case "weekly":
//       return 52;
//     case "annual":
//     case "yearly":
//       return 1;
//     case "monthly":
//     default:
//       return 12;
//   }
// };

// const getContributionLabel = (frequency?: string) => {
//   switch (frequency) {
//     case "weekly":
//       return "Weekly Contribution";
//     case "annual":
//     case "yearly":
//       return "Contribución anual";
//     case "monthly":
//     default:
//       return "Contribución mensual";
//   }
// };

// const calculateFutureValue = ({
//   capital,
//   contribution,
//   annualRate,
//   years,
//   frequency,
// }: {
//   capital: number;
//   contribution: number;
//   annualRate: number;
//   years: number;
//   frequency: string;
// }) => {
//   const periodsPerYear = getPeriodsPerYear(frequency);
//   const totalPeriods = years * periodsPerYear;
//   const periodicRate = annualRate / 100 / periodsPerYear;

//   let value = capital;

//   for (let i = 0; i < totalPeriods; i++) {
//     value = value * (1 + periodicRate) + contribution;
//   }

//   return value;
// };

// const generateChartData = ({
//   capital,
//   contribution,
//   annualRate,
//   years,
//   frequency,
// }: {
//   capital: number;
//   contribution: number;
//   annualRate: number;
//   years: number;
//   frequency: string;
// }) => {
//   const data = [];

//   for (let year = 0; year <= years; year++) {
//     const value = calculateFutureValue({
//       capital,
//       contribution,
//       annualRate,
//       years: year,
//       frequency,
//     });

//     data.push({
//       year,
//       value,
//     });
//   }

//   return data;
// };

// const createLinePath = (
//   data: { year: number; value: number }[],
//   maxValue: number,
//   totalYears: number
// ) => {
//   if (!data.length) return "";

//   const usableWidth = CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING;
//   const usableHeight = CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING;

//   return data
//     .map((item, index) => {
//       const x =
//         LEFT_PADDING + (item.year / totalYears) * usableWidth;

//       const y =
//         TOP_PADDING +
//         usableHeight -
//         (item.value / maxValue) * usableHeight;

//       return `${index === 0 ? "M" : "L"} ${x} ${y}`;
//     })
//     .join(" ");
// };

// const FinanShare = () => {
//   const route = useRoute<any>();
//   const { financialData = {} } = route?.params || {};

//   const data: FinancialDataType = {
//     capital: Number(financialData?.capital ?? 0),
//     monthly: Number(financialData?.monthly ?? 0),
//     frequency: financialData?.frequency ?? "monthly",
//     horizon: Number(financialData?.horizon ?? 0),
//     returnRate: Number(financialData?.returnRate ?? 0),
//     gainPct: Number(financialData?.gainPct ?? 0),
//     growth: Number(financialData?.growth ?? 0),
//     invested: Number(financialData?.invested ?? 0),
//     fv: Number(financialData?.fv ?? 0),
//   };

//   const chartData = useMemo(() => {
//     return generateChartData({
//       capital: data.capital || 0,
//       contribution: data.monthly || 0,
//       annualRate: Number(data.returnRate || 0),
//       years: data.horizon || 1,
//       frequency: data.frequency || "monthly",
//     });
//   }, [data]);

//   const maxValue = useMemo(() => {
//     const maxChart = Math.max(...chartData.map((item) => item.value), data.fv || 0, 1);
//     return maxChart * 1.15;
//   }, [chartData, data.fv]);

//   const chartPath = useMemo(() => {
//     return createLinePath(chartData, maxValue, data.horizon || 1);
//   }, [chartData, maxValue, data.horizon]);

//   const lastPoint = chartData[chartData.length - 1];

//   const lastPointX =
//     LEFT_PADDING +
//     ((lastPoint?.year || 0) / (data.horizon || 1)) *
//       (CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING);

//   const lastPointY =
//     TOP_PADDING +
//     (CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) -
//     (((lastPoint?.value || 0) / maxValue) *
//       (CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING));

//   const yLabels = Array.from({ length: 5 }).map((_, i) => {
//     return Math.round(maxValue - (maxValue / 4) * i);
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <CustomHeader />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Text style={styles.title}>Mi escenario de inversión</Text>
//         <Text style={styles.subtitle}>Simulada con QFinance</Text>

//         {/* Main Value Card */}
//         <View style={styles.valueCard}>
//           <Text style={styles.valueLabel}>
//            Valor estimado en {data.horizon} Años
//           </Text>
//           <Text style={styles.value}>{formatCurrency(data.fv || 0)}</Text>
//           <Text style={styles.growthText}>
//             +{formatCurrency(data.growth || 0)} ({(data.gainPct || 0).toFixed(1)}%)
//           </Text>
//         </View>

//         {/* Graph Card */}
//         <View style={styles.chartCard}>
//           <Text style={styles.chartTitle}>Crecimiento proyectado de la cartera</Text>

//           <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
//             {/* Grid lines */}
//             {Array.from({ length: 5 }).map((_, i) => {
//               const y =
//                 TOP_PADDING +
//                 ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i;

//               return (
//                 <Line
//                   key={`grid-${i}`}
//                   x1={LEFT_PADDING}
//                   y1={y}
//                   x2={CHART_WIDTH - RIGHT_PADDING}
//                   y2={y}
//                   stroke={i === 4 ? "#D8DDE7" : "#EEF1F5"}
//                   strokeWidth="1"
//                 />
//               );
//             })}

//             {/* Y axis labels */}
//             {yLabels.map((label, i) => {
//               const y =
//                 TOP_PADDING +
//                 ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i +
//                 4;

//               return (
//                 <SvgText
//                   key={`ylabel-${i}`}
//                   x={2}
//                   y={y}
//                   fontSize="10"
//                   fill="#7A7F8A"
//                 >
//                   {label}
//                 </SvgText>
//               );
//             })}

//             {/* X labels */}
//             {Array.from({ length: (data.horizon || 1) + 1 }).map((_, i) => {
//               const x =
//                 LEFT_PADDING +
//                 (i / (data.horizon || 1)) *
//                   (CHART_WIDTH - LEFT_PADDING - RIGHT_PADDING);

//               return (
//                 <SvgText
//                   key={`xlabel-${i}`}
//                   x={x - 4}
//                   y={CHART_HEIGHT - 8}
//                   fontSize="10"
//                   fill="#7A7F8A"
//                 >
//                   {i}
//                 </SvgText>
//               );
//             })}

//             {/* Main line */}
//             <Path
//               d={chartPath}
//               stroke="rgb(197, 190, 232)"
//               strokeWidth="4"
//               fill="none"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />

//             {/* Last point */}
//             <Circle
//               cx={lastPointX}
//               cy={lastPointY}
//               r="5"
//               fill="#7B61FF"
//             />
//           </Svg>

//           <View style={styles.legendBox}>
//             <View style={styles.legendDot} />
//             <Text style={styles.legendText}>
//               {Number(data.returnRate || 0)}% Rendimiento anual
//             </Text>
//           </View>
//         </View>

//         {/* Info Card */}
//         <View style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Optimistic} style={styles.icon} />
//               <Text style={styles.infoLabel}>Tipo de inversor</Text>
//             </View>
//             <Text style={styles.infoValue}>Dinámica</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Conservative} style={styles.icon} />
//               <Text style={styles.infoLabel}>Dinámica</Text>
//             </View>
//             <Text style={styles.infoValue}>{data.returnRate}%</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Base} style={styles.icon} />
//               <Text style={styles.infoLabel}>Investment Period</Text>
//             </View>
//             <Text style={styles.infoValue}>{data.horizon} Years</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Base} style={styles.icon} />
//               <Text style={styles.infoLabel}>
//                 {getContributionLabel(data.frequency)}
//               </Text>
//             </View>
//             <Text style={styles.infoValue}>{formatCurrency(data.monthly || 0)}</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Base} style={styles.icon} />
//               <Text style={styles.infoLabel}>Capital inicial</Text>
//             </View>
//             <Text style={styles.infoValue}>{formatCurrency(data.capital || 0)}</Text>
//           </View>

//           <View style={[styles.infoRow, { marginBottom: 0 }]}>
//             <View style={styles.infoLeft}>
//               <Image source={imageIndex.Base} style={styles.icon} />
//               <Text style={styles.infoLabel}>Total Invested</Text>
//             </View>
//             <Text style={styles.infoValue}>{formatCurrency(data.invested || 0)}</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.shareButton}>
//           <Text style={styles.shareText}>Compartir mi plan</Text>
//         </TouchableOpacity>

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default FinanShare;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F7FB",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "800",
//     alignSelf: "center",
//     marginTop: 10,
//     color: "#101828",
//   },

//   subtitle: {
//     alignSelf: "center",
//     color: "#8B93A1",
//     marginTop: 4,
//     marginBottom: 20,
//   },

//   valueCard: {
//     backgroundColor: "#fff",
//     marginHorizontal: 20,
//     borderRadius: 18,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   valueLabel: {
//     fontSize: 14,
//     color: "#667085",
//     marginBottom: 8,
//   },

//   value: {
//     fontSize: 30,
//     fontWeight: "800",
//     color: "#101828",
//   },

//   growthText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#12B76A",
//   },

//   chartCard: {
//     backgroundColor: "#fff",
//     marginHorizontal: 20,
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 20,
//   },

//   chartTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#101828",
//     marginBottom: 10,
//   },

//   legendBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },

//   legendDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 10,
//     backgroundColor: "#7B61FF",
//     marginRight: 8,
//   },

//   legendText: {
//     fontSize: 13,
//     color: "#667085",
//     fontWeight: "500",
//   },

//   infoCard: {
//     backgroundColor: "#fff",
//     marginHorizontal: 20,
//     borderRadius: 18,
//     padding: 18,
//     marginBottom: 20,
//   },

//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 14,
//   },

//   infoLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     marginRight: 10,
//   },

//   icon: {
//     width: 36,
//     height: 36,
//     marginRight: 10,
//     resizeMode: "contain",
//   },

//   infoLabel: {
//     fontSize: 14,
//     color: "#667085",
//   },

//   infoValue: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#101828",
//   },

//   shareButton: {
//     backgroundColor: "#34C759",
//     marginHorizontal: 20,
//     borderRadius: 30,
//     paddingVertical: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   shareText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "700",
//   },
// });
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
import { useRoute } from "@react-navigation/native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { Share as RNShare } from "react-native";

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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const formatCurrency = (value: number = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const getPeriodsPerYear = (frequency?: string) => {
  switch (frequency) {
    case "weekly":
      return 52;
    case "annual":
    case "yearly":
      return 1;
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
  const result = [];
  for (let year = 0; year <= years; year++) {
    result.push({
      year,
      value: calculateFutureValue({
        capital,
        contribution,
        annualRate,
        years: year,
        frequency,
      }),
    });
  }
  return result;
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
      const x = LEFT_PADDING + (item.year / totalYears) * usableWidth;
      const y =
        TOP_PADDING + usableHeight - (item.value / maxValue) * usableHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

// ─────────────────────────────────────────────
// PDF Chart SVG string generator
// ─────────────────────────────────────────────

const generateChartSVG = (data: FinancialDataType): string => {
  const chartData = generateChartData({
    capital: data.capital || 0,
    contribution: data.monthly || 0,
    annualRate: Number(data.returnRate || 0),
    years: data.horizon || 1,
    frequency: data.frequency || "monthly",
  });

  const W = 500,
    H = 180;
  const padL = 44,
    padR = 10,
    padT = 12,
    padB = 24;
  const maxVal =
    Math.max(...chartData.map((d) => d.value)) * 1.15 || 1;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const horizon = data.horizon || 1;

  const points = chartData.map((d) => ({
    x: padL + (d.year / horizon) * plotW,
    y: padT + plotH - (d.value / maxVal) * plotH,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const lastPt = points[points.length - 1];

  const gridLines = [0, 1, 2, 3, 4]
    .map((i) => {
      const gy = padT + (plotH / 4) * i;
      const labelVal = Math.round(maxVal * (1 - i / 4));
      const labelStr =
        labelVal >= 1000
          ? `€${Math.round(labelVal / 1000)}k`
          : `€${labelVal}`;
      return `
        <line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}"
          stroke="${i === 0 ? "#D8DDE7" : "#EEF1F5"}" stroke-width="0.8"/>
        <text x="2" y="${gy + 4}" font-size="9" fill="#667085">${labelStr}</text>`;
    })
    .join("");

  const xLabels = Array.from({ length: horizon + 1 }, (_, i) => {
    const gx = padL + (i / horizon) * plotW;
    return `<text x="${gx.toFixed(1)}" y="${H - 5}" font-size="9" fill="#667085" text-anchor="middle">${i}</text>`;
  }).join("");

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="100%" style="display:block;">
      <rect width="${W}" height="${H}" fill="#F4F7FB" rx="8"/>
      ${gridLines}
      ${xLabels}
      <path d="${pathD}" stroke="#C5BEE8" stroke-width="3" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="6" fill="#7B61FF"/>
    </svg>`;
};

// ─────────────────────────────────────────────
// PDF HTML builder
// ─────────────────────────────────────────────

const buildPDFHTML = (data: FinancialDataType): string => {
  const infoRows = [
    ["Tipo de inversor", "Dinámica"],
    ["Rendimiento anual", `${data.returnRate}%`],
    ["Período de inversión", `${data.horizon} años`],
    [getContributionLabel(data.frequency), formatCurrency(data.monthly || 0)],
    ["Capital inicial", formatCurrency(data.capital || 0)],
    ["Total invertido", formatCurrency(data.invested || 0)],
  ]
    .map(
      ([label, value]) => `
      <div class="info-row">
        <div class="info-label"><span class="dot"></span>${label}</div>
        <div class="info-value">${value}</div>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system,Helvetica,sans-serif; }
    body { background:#F4F7FB; padding:24px; }

    .header {
      background:linear-gradient(135deg,#7B61FF,#9B86FF);
      border-radius:18px;
      padding:32px 24px 28px;
      text-align:center;
      margin-bottom:20px;
    }
    .header .brand { color:#D4CEFF; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
    .header h1  { color:#fff; font-size:24px; font-weight:800; margin-bottom:4px; }
    .header p   { color:#D4CEFF; font-size:13px; }

    .card {
      background:#fff;
      border-radius:16px;
      padding:22px;
      margin-bottom:16px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);
    }

    .value-card { text-align:center; }
    .value-label { color:#667085; font-size:13px; margin-bottom:8px; }
    .value { font-size:36px; font-weight:800; color:#101828; }
    .growth { color:#12B76A; font-size:14px; font-weight:700; margin-top:8px; }

    .chart-title { font-size:15px; font-weight:700; color:#101828; margin-bottom:14px; }
    .chart-wrap  { width:100%; }
    .legend      { display:flex; align-items:center; margin-top:12px; gap:8px; }
    .legend-dot  { width:10px; height:10px; border-radius:50%; background:#7B61FF; flex-shrink:0; }
    .legend-text { color:#667085; font-size:12px; }

    .info-row {
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:12px 0;
      border-bottom:1px solid #EEF1F5;
    }
    .info-row:last-child { border-bottom:none; }
    .info-label { color:#667085; font-size:13px; display:flex; align-items:center; gap:8px; }
    .dot { width:8px; height:8px; border-radius:50%; background:#7B61FF; display:inline-block; flex-shrink:0; }
    .info-value { font-size:13px; font-weight:700; color:#101828; }

    .share-banner {
      background:#34C759;
      border-radius:30px;
      padding:16px;
      text-align:center;
      color:#fff;
      font-weight:700;
      font-size:15px;
      margin-bottom:16px;
    }

    .footer { text-align:center; color:#8B93A1; font-size:10px; line-height:1.5; }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">QFinance</div>
    <h1>Mi Escenario de Inversión</h1>
    <p>Simulada con QFinance</p>
  </div>

  <div class="card value-card">
    <div class="value-label">Valor estimado en ${data.horizon} Años</div>
    <div class="value">${formatCurrency(data.fv || 0)}</div>
    <div class="growth">
      +${formatCurrency(data.growth || 0)}&nbsp;&nbsp;(${(data.gainPct || 0).toFixed(1)}%)
    </div>
  </div>

  <div class="card">
    <div class="chart-title">Crecimiento proyectado de la cartera</div>
    <div class="chart-wrap">${generateChartSVG(data)}</div>
    <div class="legend">
      <div class="legend-dot"></div>
      <span class="legend-text">${data.returnRate}% Rendimiento anual</span>
    </div>
  </div>

  <div class="card">
    ${infoRows}
  </div>

  <div class="share-banner">Compartir mi plan &nbsp;→</div>

  <div class="footer">
    Este documento es solo informativo.<br/>
    Los rendimientos pasados no garantizan resultados futuros. © QFinance
  </div>

</body>
</html>`;
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const FinanShare = () => {
  const route = useRoute<any>();
  const { financialData = {} } = route?.params || {};
  const [isSharing, setIsSharing] = useState(false);

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

  // ── Chart state ──
  const chartData = useMemo(
    () =>
      generateChartData({
        capital: data.capital || 0,
        contribution: data.monthly || 0,
        annualRate: Number(data.returnRate || 0),
        years: data.horizon || 1,
        frequency: data.frequency || "monthly",
      }),
    [data]
  );

  const maxValue = useMemo(() => {
    const max = Math.max(
      ...chartData.map((item) => item.value),
      data.fv || 0,
      1
    );
    return max * 1.15;
  }, [chartData, data.fv]);

  const chartPath = useMemo(
    () => createLinePath(chartData, maxValue, data.horizon || 1),
    [chartData, maxValue, data.horizon]
  );

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

  const yLabels = Array.from({ length: 5 }).map((_, i) =>
    Math.round(maxValue - (maxValue / 4) * i)
  );

  // ── PDF Share ──
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const html = buildPDFHTML(data);

      console.log("Step 1: Generating PDF...");

      const pdf = await RNHTMLtoPDF.convert({
        html,
        fileName: `QFinance_Plan`,
        directory: "Documents",
        width: 595,
        height: 842,
      });

      console.log("PDF result:", JSON.stringify(pdf));

      if (!pdf?.filePath) {
        Alert.alert("Error", "PDF path is empty. Check console logs.");
        return;
      }

      const filePath = pdf.filePath;
      console.log("Step 2: Sharing file at:", filePath);

      // Built-in React Native Share — most reliable, no extra libs needed
      const result = await RNShare.share(
        {
          title: "Mi Plan de Inversión – QFinance",
          message:
            Platform.OS === "android"
              ? `Mi escenario de inversión simulado con QFinance\n${filePath}`
              : "Mi escenario de inversión simulado con QFinance",
          url: filePath, // iOS uses this for file attachment
        },
        {
          dialogTitle: "Compartir mi plan",
          subject: "Mi Plan de Inversión – QFinance",
        }
      );

      console.log("Share result:", result);
    } catch (err: any) {
      console.error("Full error:", JSON.stringify(err));
      Alert.alert(
        "Debug Info",
        `Error: ${err?.message ?? JSON.stringify(err)}`
      );
    } finally {
      setIsSharing(false);
    }
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi escenario de inversión</Text>
        <Text style={styles.subtitle}>Simulada con QFinance</Text>

        {/* ── Value Card ── */}
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>
            Valor estimado en {data.horizon} Años
          </Text>
          <Text style={styles.value}>{formatCurrency(data.fv || 0)}</Text>
          <Text style={styles.growthText}>
            +{formatCurrency(data.growth || 0)} ({(data.gainPct || 0).toFixed(1)}%)
          </Text>
        </View>

        {/* ── Chart Card ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Crecimiento proyectado de la cartera
          </Text>

          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
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

            {yLabels.map((label, i) => {
              const y =
                TOP_PADDING +
                ((CHART_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / 4) * i +
                4;
              return (
                <SvgText key={`ylabel-${i}`} x={2} y={y} fontSize="10" fill="#7A7F8A">
                  {label}
                </SvgText>
              );
            })}

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

            <Path
              d={chartPath}
              stroke="rgb(197, 190, 232)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx={lastPointX} cy={lastPointY} r="5" fill="#7B61FF" />
          </Svg>

          <View style={styles.legendBox}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>
              {Number(data.returnRate || 0)}% Rendimiento anual
            </Text>
          </View>
        </View>

        {/* ── Info Card ── */}
        <View style={styles.infoCard}>
          {[
            { icon: imageIndex.Optimistic, label: "Tipo de inversor",  value: "Dinámica" },
            { icon: imageIndex.Conservative, label: "Dinámica",        value: `${data.returnRate}%` },
            { icon: imageIndex.Base, label: "Investment Period",        value: `${data.horizon} Years` },
            { icon: imageIndex.Base, label: getContributionLabel(data.frequency), value: formatCurrency(data.monthly || 0) },
            { icon: imageIndex.Base, label: "Capital inicial",          value: formatCurrency(data.capital || 0) },
            { icon: imageIndex.Base, label: "Total Invested",           value: formatCurrency(data.invested || 0) },
          ].map((row, idx, arr) => (
            <View
              key={idx}
              style={[styles.infoRow, idx === arr.length - 1 && { marginBottom: 0 }]}
            >
              <View style={styles.infoLeft}>
                <Image source={row.icon} style={styles.icon} />
                <Text style={styles.infoLabel}>{row.label}</Text>
              </View>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Share Button ── */}
        <TouchableOpacity
          style={[styles.shareButton, isSharing && { opacity: 0.7 }]}
          onPress={handleShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.shareText}>Compartir mi plan</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinanShare;

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#F4F7FB" },
  title:       { fontSize: 22, fontWeight: "800", alignSelf: "center", marginTop: 10, color: "#101828" },
  subtitle:    { alignSelf: "center", color: "#8B93A1", marginTop: 4, marginBottom: 20 },

  valueCard: {
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 18,
    paddingVertical: 24, paddingHorizontal: 20, alignItems: "center", marginBottom: 20,
  },
  valueLabel:  { fontSize: 14, color: "#667085", marginBottom: 8 },
  value:       { fontSize: 30, fontWeight: "800", color: "#101828" },
  growthText:  { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#12B76A" },

  chartCard: {
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 18,
    padding: 16, marginBottom: 20,
  },
  chartTitle:  { fontSize: 16, fontWeight: "700", color: "#101828", marginBottom: 10 },
  legendBox:   { flexDirection: "row", alignItems: "center", marginTop: 10 },
  legendDot:   { width: 10, height: 10, borderRadius: 10, backgroundColor: "#7B61FF", marginRight: 8 },
  legendText:  { fontSize: 13, color: "#667085", fontWeight: "500" },

  infoCard: {
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 18,
    padding: 18, marginBottom: 20,
  },
  infoRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  infoLeft:    { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  icon:        { width: 36, height: 36, marginRight: 10, resizeMode: "contain" },
  infoLabel:   { fontSize: 14, color: "#667085" },
  infoValue:   { fontSize: 14, fontWeight: "700", color: "#101828" },

  shareButton: {
    backgroundColor: "#34C759", marginHorizontal: 20, borderRadius: 30,
    paddingVertical: 16, justifyContent: "center", alignItems: "center",
  },
  shareText:   { color: "#fff", fontSize: 15, fontWeight: "700" },
});