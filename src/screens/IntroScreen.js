import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedBubble from '../components/AnimatedBubble';
import ScreenHeader from '../components/screen-header';
import { SettingsContext } from '../SettingsContext';
import theme from '../theme';

const IntroScreen = ({ navigation }) => {
  const { selectedTrainer } = useContext(SettingsContext);

  const trainerImage = selectedTrainer === "1"
    ? require('../../assets/trainer-alan.png')
    : require('../../assets/trainer-lina.png');

  const trainerName = selectedTrainer === "1" ? "Alan" : "Lina";

  const quote = {
    text: `Hey, I am ${trainerName}, your trainer, now let's get to work!`,
    audio: "" // no audio on intro
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader />
      <View style={styles.container}>
        {/* Speech bubble above avatar */}
        <View style={styles.bubbleContainer}>
          <AnimatedBubble quote={quote} delay={300} />
        </View>

        {/* Avatar with border */}
        <View style={styles.avatarBorder}>
          <Image source={trainerImage} style={styles.trainerImage} />
        </View>

        {/* Trainer name label */}
        <Text style={styles.trainerLabel}>{trainerName.toUpperCase()}</Text>

        {/* Start button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: -30,
    zIndex: 5,
  },
  avatarBorder: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.white,
    borderWidth: 8,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  trainerImage: {
    width: 224,
    height: 224,
    borderRadius: 112,
  },
  trainerLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 20,
  },
});

export default IntroScreen;
