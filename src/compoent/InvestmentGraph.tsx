import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";
import font from "../theme/font";

const { width } = Dimensions.get("window");

type Props = {
    portfolioData: number[];
    capitalData: number[];
    years: number;
};

const InvestmentGraph = ({ portfolioData, capitalData, years }: Props) => {

    const chartWidth = width - 60;
    const chartHeight = 220;

    const PAD_LEFT = 50;
    const PAD_RIGHT = 20;
    const PAD_TOP = 20;
    const PAD_BOTTOM = 35;

    const plotWidth = chartWidth - PAD_LEFT - PAD_RIGHT;
    const plotHeight = chartHeight - PAD_TOP - PAD_BOTTOM;

    const maxValue = Math.max(...portfolioData, ...capitalData, 1);

    const getX = (index: number, total: number) => {
        return PAD_LEFT + (index / (total - 1)) * plotWidth;
    };

    const getY = (value: number) => {
        return PAD_TOP + plotHeight - (value / maxValue) * plotHeight;
    };

    const buildSmoothPath = (data: number[]) => {

        if (data.length < 2) return "";

        let path = `M ${getX(0, data.length)} ${getY(data[0])}`;

        for (let i = 0; i < data.length - 1; i++) {

            const x1 = getX(i, data.length);
            const y1 = getY(data[i]);

            const x2 = getX(i + 1, data.length);
            const y2 = getY(data[i + 1]);

            const midX = (x1 + x2) / 2;

            path += ` C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        }

        return path;
    };

    const ySteps = 5;

    const yLabels = Array.from({ length: ySteps }, (_, i) => {
        return (maxValue / (ySteps - 1)) * i;
    });

    return (
        <View style={styles.card}>
            <Text style={{
                alignItems: "flex-start",


                right: 50,
                fontSize: 16,
                marginTop: 5,
                marginBottom: 3,
                color: "black",
                fontFamily: font.PoppinsSemiBold
            }}>Proyección de crecimiento</Text>
            <Svg width={chartWidth} height={chartHeight}>

                {/* Horizontal dashed grid */}
                {yLabels.map((value, i) => {

                    const y = getY(value);

                    return (
                        <React.Fragment key={i}>
                            <Line
                                x1={PAD_LEFT}
                                x2={chartWidth - PAD_RIGHT}
                                y1={y}
                                y2={y}
                                stroke="#D1D5DB"
                                strokeWidth={1}
                                strokeDasharray="4,4"
                            />

                            <SvgText
                                x={10}
                                y={y + 4}
                                fontSize="10"
                                fill="#9CA3AF"
                            >
                                {value >= 1000
                                    ? `${(value / 1000).toFixed(1)}k`
                                    : value}
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {/* X axis labels */}
                {[0, 2, 4, 6, 8, years].map((year, i) => {

                    const x = PAD_LEFT + (i / 5) * plotWidth;

                    return (
                        <SvgText
                            key={i}
                            x={x}
                            y={chartHeight - 10}

                            textAnchor="middle"
                            fontSize="10"
                            fill="#9CA3AF"
                        >
                            Y{Math.round(year)}
                        </SvgText>
                    );
                })}

                {/* CAPITAL LINE */}
                <Path
                    d={buildSmoothPath(capitalData)}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="6,4"
                />

                {/* PORTFOLIO LINE */}
                <Path
                    d={buildSmoothPath(portfolioData)}
                    stroke="#22C55E"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="6,4"
                />

            </Svg>

            {/* Legend */}
            <View style={styles.legendRow}>

                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: "#2563EB" }]} />
                    <Text style={styles.legendText}>Portfolio</Text>
                </View>

                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
                    <Text style={styles.legendText}>Capital</Text>
                </View>

            </View>

        </View>
    );
};

export default InvestmentGraph;

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#F7F8F8",
        borderRadius: 18,
        padding: 12,
        marginTop: 15,
        alignItems: "center",
    },

    legendRow: {
        flexDirection: "row",
        marginTop: 8,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        marginRight: 6,
    },

    legendText: {
        fontSize: 11,
        color: "#374151",
    },

});