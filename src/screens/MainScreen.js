import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
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
    const route = useRoute();

    // Exercise data passed from workout detail screen
    const exerciseName = route.params?.exerciseName || null;
    const exerciseGif = route.params?.exerciseGif || null;

    const startQuote = { text: "tap to start", audio: "" };
    const [inputText, setInputText] = useState(exerciseName || 'My Workout');
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
            sets: selectedSets,
            reps: selectedReps,
            breakTime: selectedBreak,
            exerciseGif: exerciseGif,
        });
    };

    const setOptions = arrayRange(1, 10, 1);
    const repOptions = arrayRange(5, 30, 1);
    const breakOptions = arrayRange(10, 180, 1);

    const [selectedSets, setSelectedSets] = useState(defaultSetsOption);
    const [selectedReps, setSelectedReps] = useState(defaultRepsOption);
    const [selectedBreak, setSelectedBreak] = useState(defaultBreakOption);

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
                        {exerciseGif ? (
                            <Animated.Image
                                source={{ uri: exerciseGif }}
                                style={[styles.logo, { transform: [{ scale: logoScale }], borderRadius: 140 }]}
                                resizeMode="contain"
                            />
                        ) : (
                            <Animated.Image
                                source={require('../../assets/logo.png')}
                                style={[styles.logo, { transform: [{ scale: logoScale }] }]}
                            />
                        )}
                    </TouchableOpacity>

                    <Text style={styles.defaultSetupText}>Default setup for workout</Text>

                    <StatusBar style="auto" />

                    <View style={styles.row}>
                        {/* Set Picker */}
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Set</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedSets}
                                    onValueChange={(value) => { Keyboard.dismiss(); setSelectedSets(value); }}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {setOptions.map((val) => (
                                        <Picker.Item key={val} label={String(val).padStart(2, '0')} value={val} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Rep Picker */}
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Rep</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedReps}
                                    onValueChange={(value) => { Keyboard.dismiss(); setSelectedReps(value); }}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {repOptions.map((val) => (
                                        <Picker.Item key={val} label={String(val)} value={val} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Break Picker */}
                        <View style={styles.columnContainer}>
                            <Text style={styles.column}>Break(s)</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedBreak}
                                    onValueChange={(value) => { Keyboard.dismiss(); setSelectedBreak(value); }}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {breakOptions.map((val) => (
                                        <Picker.Item key={val} label={String(val)} value={val} />
                                    ))}
                                </Picker>
                            </View>
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
    pickerWrapper: {
        height: 120,
        overflow: 'hidden',
    },
    picker: {
        width: 110,
        height: 120,
    },
    pickerItem: {
        fontFamily: theme.fonts.semiBold,
        fontSize: 22,
        color: theme.colors.primary,
        height: 120,
    },
});

export default MainScreen;
