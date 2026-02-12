import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar, StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WheelPicker from 'react-native-wheely';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AnimatedBubble from '../components/AnimatedBubble';
import ScreenHeader from '../components/screen-header';
import theme from '../theme';


const arrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
);


const MainScreen = () => {

    const logoScale = useRef(new Animated.Value(1)).current;
    const tickSoundRef = useRef(null);

    // Preload tick sound for picker scroll feedback
    useEffect(() => {
        const loadTickSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/tick.wav')
                );
                tickSoundRef.current = sound;
            } catch (e) {
                // Silently fail - haptic still works without sound
            }
        };
        loadTickSound();
        return () => {
            if (tickSoundRef.current) {
                tickSoundRef.current.unloadAsync();
            }
        };
    }, []);

    // Play tick sound + haptic on picker scroll
    const playTickFeedback = useCallback(async () => {
        Haptics.selectionAsync();
        try {
            if (tickSoundRef.current) {
                await tickSoundRef.current.replayAsync();
            }
        } catch (e) {
            // Ignore playback errors
        }
    }, []);

    const startQuote = { text: "tap to start", audio: "" };
    const [inputText, setInputText] = useState('My Workout');
    const navigation = useNavigation();

    const minSetsOption = 1;
    const minRepsOption = 5;
    const minBreakOption = 10;

    const defaultSetsOption = 3;
    const defaultRepsOption = 15;
    const defaultBreakOption = 15;

    // Function to trigger the animation
    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(logoScale, {
            toValue: 1.3, // Scale up to 1.5 times the original size
            duration: 200, // Animation duration in milliseconds
            useNativeDriver: true, // Enable native driver
            }),
        Animated.timing(logoScale, {
            toValue: 1, // Scale back to the original size
            duration: 400,
            useNativeDriver: true,
            }),
        ]).start(() => startContinuousAnimation()); // Start continuous animation after initial animation ends
    };

    // Function to start the continuous animation
    const startContinuousAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1.05, // Scale up to 1.2 times the original size
                    duration: 1200, // Animation duration in milliseconds
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 1, // Scale back to the original size
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    // Trigger the animation when the component mounts
    useEffect(() => {
        startAnimation();
    }, []); // Empty dependency array ensures this effect runs only once

    const handleStartWorkout = () => {
        navigation.navigate('Workout', {
                                        workoutName: inputText,
                                        sets: selectedSetsIndex + minSetsOption,
                                        reps: selectedRepsIndex + minRepsOption,
                                        breakTime: selectedBreaksIndex + minBreakOption,});
    };

    const setOptions = arrayRange(1, 10, 1);
    const repOptions = arrayRange(5, 30, 1);
    const breakOptions = arrayRange(10, 180, 1);

    const [selectedSetsIndex, setSelectedSetsIndex] = useState(defaultSetsOption - minSetsOption);
    const [selectedRepsIndex, setSelectedRepsIndex] = useState(defaultRepsOption - minRepsOption);
    const [selectedBreaksIndex, setSelectedBreaksIndex] = useState(defaultBreakOption - minBreakOption);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScreenHeader />
                <View style={styles.container}>
                    <View style={styles.bubbleContainer}>
                        <AnimatedBubble quote={startQuote} delay={600}/>
                    </View>

                    <TouchableOpacity onPress={() => handleStartWorkout()}>
                        <Animated.Image
                            source={require('../../assets/logo.png')}
                            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
                        />
                    </TouchableOpacity>

                    <Text style={styles.defaultSetupText}>Default setup for workout</Text>

                    <StatusBar style="auto" />

                    <View style={styles.row}>
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Set</Text>
                            <WheelPicker
                                selectedIndex={selectedSetsIndex}
                                options={setOptions}
                                onChange={(index) => { playTickFeedback(); Keyboard.dismiss(); setSelectedSetsIndex(index); }}
                                selectedIndicatorStyle={styles.wheelPickerSelectedIndicator}
                                itemTextStyle={styles.wheelPickerItemText}
                                itemHeight={35}
                                visibleRest={1}
                            />
                        </View>
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Rep</Text>
                            <WheelPicker
                                selectedIndex={selectedRepsIndex}
                                options={repOptions}
                                onChange={(index) => { playTickFeedback(); Keyboard.dismiss(); setSelectedRepsIndex(index); }}
                                selectedIndicatorStyle={styles.wheelPickerSelectedIndicator}
                                itemTextStyle={styles.wheelPickerItemText}
                                itemHeight={35}
                                visibleRest={1}
                            />
                        </View>
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Break(s)</Text>
                            <WheelPicker
                                selectedIndex={selectedBreaksIndex}
                                options={breakOptions}
                                onChange={(index) => { playTickFeedback(); Keyboard.dismiss(); setSelectedBreaksIndex(index); }}
                                selectedIndicatorStyle={styles.wheelPickerSelectedIndicator}
                                itemTextStyle={styles.wheelPickerItemText}
                                itemHeight={35}
                                visibleRest={1}
                            />
                        </View>
                    </View>

                    <StatusBar style="auto" />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubbleContainer: {
        position: 'relative',
        width: '100%',
        height: 116,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 280,
        height: 280,
        marginBottom: 30,
    },
    defaultSetupText: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        fontSize: 13,
        marginTop: 5,
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    columnContainer: {
        alignItems: 'center',
        width: "30%",
    },
    column: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        fontFamily: theme.fonts.regular,
        marginBottom: 5,
        textAlign: "center",
    },
    wheelPickerSelectedIndicator: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        width: '100%',
        textAlign: "center",
    },
    wheelPickerItemText: {
        fontFamily: theme.fonts.semiBold,
        fontSize: 24,
        color: theme.colors.primary,
        width: '100%',
        textAlign: "center",
    },
});

export default MainScreen;
