import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/use-theme';

const BottomIndicatorBar = ({ color }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(), []);
  const barColor = color || theme.colors.border;
  return <View style={[styles.indicator, { backgroundColor: barColor }]} />;
};

const createStyles = () => StyleSheet.create({
  indicator: {
    width: 120,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
});

export default BottomIndicatorBar;
