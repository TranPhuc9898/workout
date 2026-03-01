import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By downloading or using the Workout App, you agree to be bound by these Terms of Use. If you do not agree, please do not use the app.',
  },
  {
    title: '2. Use of the App',
    body: 'The app is intended for personal, non-commercial fitness tracking. You must be at least 16 years old to use this app. You are responsible for maintaining the confidentiality of your account.',
  },
  {
    title: '3. Health Disclaimer',
    body: 'The app provides general fitness guidance and is not a substitute for professional medical advice. Consult your physician before starting any exercise program. We are not liable for any injuries sustained during workouts.',
  },
  {
    title: '4. User Content',
    body: 'Any data you enter (workout names, buddy info) is stored locally on your device. We do not collect or share your personal workout data with third parties.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All content, designs, and trademarks within the app are owned by Workout App. You may not copy, modify, or distribute any part of the app without written permission.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'The app is provided "as is" without warranties. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app.',
  },
  {
    title: '7. Changes to Terms',
    body: 'We reserve the right to update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.',
  },
];

const TermsOfUseScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last updated: March 2026</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  sectionBody: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 21,
  },
});

export default TermsOfUseScreen;
