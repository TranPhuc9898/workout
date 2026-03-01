import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>Simon's Gym</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Text style={styles.description}>
          Your AI-powered personal fitness companion. Track workouts, count reps with voice guidance, and stay motivated with your virtual trainer.
        </Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Simon's Gym Team</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>support@simonsgym.app</Text>
        </View>

        <Text style={styles.copyright}>© 2026 Simon's Gym. All rights reserved.</Text>
      </View>
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
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
  },
  logo: { width: 100, height: 100, marginBottom: 16 },
  appName: {
    fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.primary, marginBottom: 4,
  },
  version: {
    fontFamily: theme.fonts.regular, fontSize: 14,
    color: theme.colors.textMuted, marginBottom: 24,
  },
  description: {
    fontFamily: theme.fonts.regular, fontSize: 15,
    color: theme.colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: 32,
  },
  infoBlock: { alignItems: 'center', marginBottom: 16 },
  infoLabel: {
    fontFamily: theme.fonts.regular, fontSize: 12,
    color: theme.colors.textMuted, marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.textPrimary,
  },
  copyright: {
    fontFamily: theme.fonts.regular, fontSize: 12,
    color: theme.colors.textMuted, marginTop: 40,
  },
});

export default AboutScreen;
