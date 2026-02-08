import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';

const BottomIndicatorBar = ({ color }) => {
  const barColor = color || theme.colors.border;
  return <View style={[styles.indicator, { backgroundColor: barColor }]} />;
};

const styles = StyleSheet.create({
  indicator: {
    width: 120,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
});

export default BottomIndicatorBar;
