import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const MENU_ITEMS = [
  { key: 'buddy', icon: 'people-outline', label: 'Workout Buddy', screen: 'WorkoutBuddy' },
  { key: 'notifications', icon: 'notifications-outline', label: 'Notifications', screen: null },
  { key: 'sound', icon: 'volume-medium-outline', label: 'Sound & Voice', screen: null },
  { key: 'terms', icon: 'document-text-outline', label: 'Terms of Use', screen: 'TermsOfUse' },
  { key: 'privacy', icon: 'shield-checkmark-outline', label: 'Privacy Policy', screen: null },
  { key: 'about', icon: 'information-circle-outline', label: 'About', screen: null },
];

const GearSettingsScreen = ({ navigation }) => {
  const handlePress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: ← back only */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
            onPress={() => handlePress(item)}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
          </TouchableOpacity>
        ))}

        {/* App version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  versionText: {
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 40,
  },
});

export default GearSettingsScreen;
