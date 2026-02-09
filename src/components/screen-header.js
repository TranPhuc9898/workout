import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';

/**
 * Shared header component for consistent top bar across all screens.
 * - showBack: show chevron-back button (default false)
 * - title: optional title text
 * - showMenu: show 3-dot menu icon (default true), navigates to Settings
 */
const ScreenHeader = ({ showBack = false, title = '', showMenu = true, onBack }) => {
  const navigation = useNavigation();

  const handleBack = onBack || (() => navigation.goBack());

  return (
    <View style={styles.header}>
      {/* Left: back button or spacer */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      {/* Center: title */}
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      {/* Right: 3-dot menu or spacer */}
      {showMenu ? (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
          <Image source={require('../../assets/icon/More.png')} style={styles.menuIcon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSpacer: {
    width: 36,
    height: 36,
  },
  menuIcon: {
    width: 28,
    height: 28,
    tintColor: theme.colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginLeft: 4,
  },
  titleSpacer: {
    flex: 1,
  },
});

export default ScreenHeader;
