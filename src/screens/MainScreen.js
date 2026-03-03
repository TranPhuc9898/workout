import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AnimatedBubble from '../components/AnimatedBubble';
import ScreenHeader from '../components/screen-header';
import { useTheme } from '../hooks/use-theme';


const arrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
);


const MainScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const logoScale = useRef(new Animated.Value(1)).current;
    const route = useRoute();

    const exerciseName = route.params?.exerciseName || null;
    const exerciseGif = route.params?.exerciseGif || null;
    const exerciseMuscle = route.params?.exerciseMuscle || null;

    const startQuote = { text: "tap to start", audio: "" };
    const [inputText, setInputText] = useState(exerciseName || 'My Workout');
    const navigation = useNavigation();

    const defaultSetsOption = 3;
    const defaultRepsOption = 15;
    const defaultBreakOption = 15;

    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(logoScale, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
            }),
        Animated.timing(logoScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            }),
        ]).start(() => startContinuousAnimation());
    };

    const startContinuousAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1.05,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        if (!exerciseGif) {
            startAnimation();
        }
    }, []);

    const handleStartWorkout = () => {
        navigation.navigate('Workout', {
            workoutName: inputText,
            sets: selectedSets,
            reps: selectedReps,
            breakTime: selectedBreak,
            exerciseGif: exerciseGif,
            exerciseMuscle: exerciseMuscle,
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

                    <TouchableOpacity onPress={() => handleStartWorkout()} activeOpacity={0.8}>
                        {exerciseGif ? (
                            <View style={styles.gifRing}>
                                <Image
                                    source={{ uri: exerciseGif }}
                                    style={styles.gifImage}
                                    resizeMode="contain"
                                />
                            </View>
                        ) : (
                            <Animated.Image
                                source={require('../../assets/logo.png')}
                                style={[styles.logo, { transform: [{ scale: logoScale }] }]}
                            />
                        )}
                    </TouchableOpacity>

                    <Text style={styles.defaultSetupText}>Default setup for workout</Text>

                    <View style={styles.row}>
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

                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('Progress')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Library</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
      );
};

const createStyles = (theme) => StyleSheet.create({
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
    gifRing: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 5,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.backgroundTertiary,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    gifImage: {
        width: 260,
        height: 260,
        borderRadius: 130,
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
    exploreButton: {
        marginTop: 4,
        marginBottom: 8,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    exploreButtonText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        fontSize: 16,
    },
});

export default MainScreen;
