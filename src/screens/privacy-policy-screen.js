import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'The Workout App stores all data locally on your device, including workout history, preferences, and buddy information. We do not collect, transmit, or store any personal data on external servers.',
  },
  {
    title: '2. How We Use Your Data',
    body: 'Your workout data is used solely to provide app features: tracking progress, counting reps, and displaying exercise history. No data is shared with advertisers or third parties.',
  },
  {
    title: '3. Data Storage & Security',
    body: 'All data is stored locally using AsyncStorage on your device. Your data is protected by your device\'s built-in security (passcode, Face ID, Touch ID). We recommend keeping your device software up to date.',
  },
  {
    title: '4. Third-Party Services',
    body: 'The app may use exercise data from ExerciseDB for demonstration purposes. No personal information is sent to these services.',
  },
  {
    title: '5. Children\'s Privacy',
    body: 'The app is not intended for children under 16. We do not knowingly collect data from minors.',
  },
  {
    title: '6. Your Rights',
    body: 'Since all data is stored locally, you have full control. You can delete all app data at any time by uninstalling the app or clearing app storage in your device settings.',
  },
  {
    title: '7. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be reflected in the app with an updated date.',
  },
];

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  lastUpdated: {
    fontFamily: theme.fonts.regular, fontSize: 13,
    color: theme.colors.textMuted, marginBottom: 24,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: theme.fonts.bold, fontSize: 15,
    color: theme.colors.textPrimary, marginBottom: 6,
  },
  sectionBody: {
    fontFamily: theme.fonts.regular, fontSize: 14,
    color: theme.colors.textMuted, lineHeight: 21,
  },
});

export default PrivacyPolicyScreen;
