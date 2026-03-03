import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useTheme } from '../hooks/use-theme';

const STORAGE_KEY = 'hasSeenBuddyInvite';

const BuddyInviteScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [buddyName, setBuddyName] = useState('');

  const dismiss = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    navigation.replace('Main');
  };

  const handleSendInvite = async () => {
    await dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={dismiss} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LottieView
            source={require('../../assets/animations/trophy.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>

        <Text style={styles.title}>Don't train alone.</Text>

        <Text style={styles.description}>
          People are 65% more likely to stick to workouts with a buddy.{'\n'}
          If you skip a workout, we'll let your buddy know.
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bullet}>•  Get reminded when you miss</Text>
          <Text style={styles.bullet}>•  Celebrate streaks together</Text>
          <Text style={styles.bullet}>•  Stay consistent longer</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Who's your hype partner?"
          placeholderTextColor={theme.colors.textMuted}
          value={buddyName}
          onChangeText={setBuddyName}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.laterBtn} onPress={dismiss}>
          <Text style={styles.laterBtnText}>Later</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendInvite}>
          <Text style={styles.sendBtnText}>Send the hype invite 🎉</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  lottie: {
    width: 120,
    height: 120,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 30,
    gap: 6,
  },
  bullet: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  laterBtn: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  laterBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  sendBtn: {
    flex: 1.5,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sendBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.white,
  },
});

export default BuddyInviteScreen;
