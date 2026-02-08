# Phase 01: IntroScreen

## Design (01.png)
- Alan/Lina avatar centered
- Bubble: "Hey, I am Alan, your trainer, now let's get to work!"
- "Start" button → go to MainScreen
- Clean, minimal

## Current Code
❌ NO IntroScreen exists
- App.js starts with MainScreen directly

## Changes Needed

### 1. Create `src/screens/IntroScreen.js`
```javascript
import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedBubble from '../components/AnimatedBubble';
import { SettingsContext } from '../SettingsContext';

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
      <View style={styles.container}>
        <AnimatedBubble quote={quote} delay={300} />
        
        <Image source={trainerImage} style={styles.trainerImage} />
        
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 40,
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: "#7C4DFF",
    padding: 16,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontFamily: 'Overpass-Bold',
    fontSize: 20,
  },
});

export default IntroScreen;
```

### 2. Update `App.js`
Change initial route to IntroScreen:
```javascript
// Add import
import IntroScreen from './src/screens/IntroScreen';

// Update Stack.Navigator
<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Intro">
  <Stack.Screen name="Intro" component={IntroScreen} />
  <Stack.Screen name="Main" component={MainScreen} />
  <Stack.Screen name="Settings" component={SettingsScreen} />
  <Stack.Screen name="Workout" component={WorkoutScreen} />
</Stack.Navigator>
```

## Success Criteria
- [x] IntroScreen shows on app launch
- [x] Correct trainer image (Alan/Lina) based on settings
- [x] Speech bubble appears with correct text
- [x] "Start" button navigates to MainScreen
- [x] Matches 01.png design exactly

**Effort:** 30 min
