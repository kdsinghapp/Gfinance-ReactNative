import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SIZE = 180;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const progress = 0.75; // 75%

const DonutChart = () => {

  const strokeDashoffset =
    CIRCUMFERENCE - CIRCUMFERENCE * progress;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>

        {/* background ring */}
        <Circle
          stroke="#A7F3D0"
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
        />

        {/* progress ring */}
        <Circle
          stroke="#10B981"
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={SIZE / 2}
          originY={SIZE / 2}
        />
      </Svg>

      <View style={styles.centerText}>
        <Text style={styles.title}>Portfolio total</Text>
        <Text style={styles.amount}>$907</Text>
      </View>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
  },
  title: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
  },
});