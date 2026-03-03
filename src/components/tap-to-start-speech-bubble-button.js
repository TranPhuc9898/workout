import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/use-theme';

/**
 * TapToStartSpeechBubbleButton - A button styled as a speech bubble
 * with gray background and triangle pointer on the left side pointing down
 */
const TapToStartSpeechBubbleButton = ({ onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.text}>tap to start</Text>
          <View style={styles.triangle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    backgroundColor: theme.colors.backgroundTertiary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.backgroundTertiary,
    position: 'absolute',
    bottom: -13,
    left: 20,
  },
  text: {
    color: theme.colors.primary,
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    textTransform: 'lowercase',
  },
});

export default TapToStartSpeechBubbleButton;
