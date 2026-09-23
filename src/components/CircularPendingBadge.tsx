import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 72;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;

interface CircularPendingBadgeProps {
  displayValue: string;
  label: string;
  color: string;
}

export function CircularPendingBadge({ displayValue, label, color }: CircularPendingBadgeProps) {
  const circumference = 2 * Math.PI * RADIUS;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#E5E2DE"
            strokeWidth={STROKE}
          />
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
        </Svg>
        <View style={styles.center}>
          <Text style={styles.value} numberOfLines={1}>
            {displayValue}
          </Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  chart: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  label: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
    marginTop: 4,
  },
});
