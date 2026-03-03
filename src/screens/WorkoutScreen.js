import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveCompletedWorkout } from '../data/workout-history-storage';
import { SettingsContext } from '../SettingsContext';
import AnimatedBubble from '../components/AnimatedBubble';
import CircularProgressBar from '../components/CircularProgressBar';
import BottomSheet from '../components/BottomSheet';
import BottomIndicatorBar from '../components/BottomIndicatorBar';
import ScreenHeader from '../components/screen-header';
import { MILESTONE_SOUNDS } from '../data/sound-registry';
import useWorkoutAudio from '../hooks/use-workout-audio';
import { useTheme } from '../hooks/use-theme';

const WorkoutScreen = ({ route }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { workoutName, sets, reps, breakTime, exerciseGif, exerciseMuscle } = route.params || {};
    const { selectedTrainer, selectedTime, selectedPlaySoundsOption, selectedDelay } = useContext(SettingsContext);

    const trainerId = selectedTrainer || "1";
    const timeBetweenRepsInSec = parseInt(selectedTime) || 2;
    const playSounds = (selectedPlaySoundsOption === 'yes');
    const delayInSec = parseInt(selectedDelay) || 5;

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const startQuoteRef = useRef({ text: "Give me everything you got!", audio: pickRandom(MILESTONE_SOUNDS.start) });
    const quarterQuoteRef = useRef({ text: "Great job! Keep pushing!", audio: pickRandom(MILESTONE_SOUNDS.quarter) });
    const halfQuoteRef = useRef({ text: "Halfway through, this is where the real progress happens!!", audio: pickRandom(MILESTONE_SOUNDS.half) });
    const threeQuarterQuoteRef = useRef({ text: "Almost done! Your future self will thank you later", audio: pickRandom(MILESTONE_SOUNDS.threeQuarter) });

    const finalQuotes = [
        { text: "Great job, you crushed it today!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "That was an awesome workout, well done!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "You pushed yourself hard, I'm proud of you!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "Excellent work, you gave it your all!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "You really showed up and put in the effort!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "You're getting stronger every day, keep it up!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "Fantastic session, your dedication is paying off!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "You should feel really proud of what you accomplished!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "You've earned that rest, great work today!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
        { text: "Another workout in the books, amazing job!", audio: pickRandom(MILESTONE_SOUNDS.complete) },
    ];

    const totalWorkoutTimeInSec = sets * reps * timeBetweenRepsInSec + ((sets - 1) * breakTime);
    const setDuration = reps * timeBetweenRepsInSec;
    const cycleDuration = setDuration + breakTime;

    const [elapsed, setElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const navigation = useNavigation();
    const [randomFinalQuote, setRandomFinalQuote] = useState('');
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [savedTimestamp, setSavedTimestamp] = useState(null);
    const intervalRef = useRef(null);
    const isComplete = elapsed >= totalWorkoutTimeInSec;

    let completedRepsInSet = 0;
    let isInBreak = false;
    let currentSet = 1;
    let breakTimeRemaining = 0;
    let ringProgress = 0;
    let repCountdown = timeBetweenRepsInSec;

    if (isComplete) {
        completedRepsInSet = reps;
        currentSet = sets;
        ringProgress = 1;
        repCountdown = 0;
    } else {
        const cycleIndex = Math.min(Math.floor(elapsed / cycleDuration), sets - 1);
        const timeInCycle = elapsed - cycleIndex * cycleDuration;
        currentSet = cycleIndex + 1;

        if (timeInCycle < setDuration) {
            completedRepsInSet = Math.floor(timeInCycle / timeBetweenRepsInSec);
            ringProgress = timeInCycle / setDuration;
            const timeInCurrentRep = timeInCycle % timeBetweenRepsInSec;
            repCountdown = timeBetweenRepsInSec - timeInCurrentRep;
        } else {
            completedRepsInSet = reps;
            isInBreak = true;
            const breakElapsed = timeInCycle - setDuration;
            breakTimeRemaining = Math.max(breakTime - breakElapsed, 0);
            ringProgress = breakElapsed / breakTime;
            repCountdown = 0;
        }
    }

    useEffect(() => {
        activateKeepAwakeAsync();
        return () => deactivateKeepAwake();
    }, []);

    useEffect(() => {
        getRandomFinalQuote();
        const interval = setInterval(getRandomFinalQuote, 1000000);
        return () => clearInterval(interval);
    }, []);

    const getRandomFinalQuote = () => {
        const quote = finalQuotes[Math.floor(Math.random() * finalQuotes.length)];
        setRandomFinalQuote(quote);
    };

    useEffect(() => {
        if (!isPaused && !isComplete) {
            intervalRef.current = setInterval(() => {
                setElapsed(prev => Math.min(prev + 1, totalWorkoutTimeInSec));
            }, 1000);
            return () => clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, isComplete]);

    useEffect(() => {
        if (isComplete && totalWorkoutTimeInSec > 0) {
            const totalCalories = Math.round(sets * reps * 0.5);
            saveCompletedWorkout(workoutName, exerciseMuscle, sets * reps, totalCalories).then(ts => {
                setSavedTimestamp(ts);
                setShowBottomSheet(true);
            });
        }
    }, [isComplete]);

    useWorkoutAudio({
        playSounds,
        reps,
        timeBetweenRepsInSec,
        completedRepsInSet,
        currentSet,
        isInBreak,
        isPaused,
        isComplete,
        elapsed,
    });

    const handlePauseResume = () => {
        setIsPaused(prev => !prev);
    };

    const handleCancel = () => {
        deactivateKeepAwake();
        navigation.goBack();
    };

    const handleCloseBottomSheet = () => {
        setShowBottomSheet(false);
        navigation.navigate('Main');
    };

    const handleNextExercise = async () => {
        setShowBottomSheet(false);
        const hasSeen = await AsyncStorage.getItem('hasSeenBuddyInvite');
        setTimeout(() => {
            if (hasSeen === 'true') {
                navigation.navigate('Main');
            } else {
                navigation.replace('BuddyInvite');
            }
        }, 300);
    };

    const handleViewHistory = () => {
        setShowBottomSheet(false);
        setTimeout(() => {
            navigation.navigate('Progress');
        }, 300);
    };

    const totalCalories = Math.round(sets * reps * 0.5);

    const q1 = Math.floor(totalWorkoutTimeInSec * 0.25);
    const q2 = Math.floor(totalWorkoutTimeInSec * 0.5);
    const q3 = Math.floor(totalWorkoutTimeInSec * 0.75);
    const showTrainerAtMilestone = (
        (elapsed >= q1 && elapsed < q1 + 3) ||
        (elapsed >= q2 && elapsed < q2 + 3) ||
        (elapsed >= q3 && elapsed < q3 + 3)
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader showBack={false} showSettings={true} showNotification={true} />
            <View style={styles.container}>

            <View style={styles.bubbleContainer}>
                {elapsed <= delayInSec &&
                    <AnimatedBubble quote={startQuoteRef.current} duration={2000} playSound={playSounds}/>}
                {isComplete && totalWorkoutTimeInSec > 0 &&
                    <AnimatedBubble quote={randomFinalQuote} playSound={playSounds}/>}
                {elapsed >= q1 && elapsed < q1 + 3 &&
                    <AnimatedBubble quote={quarterQuoteRef.current} duration={2000} playSound={playSounds}/>}
                {elapsed >= q2 && elapsed < q2 + 3 &&
                    <AnimatedBubble quote={halfQuoteRef.current} duration={3000} playSound={playSounds}/>}
                {elapsed >= q3 && elapsed < q3 + 3 &&
                    <AnimatedBubble quote={threeQuarterQuoteRef.current} duration={3000} playSound={playSounds}/>}
            </View>

            <View style={styles.progressBarContainer}>
                <CircularProgressBar
                    ringProgress={ringProgress}
                    completedRepsInSet={completedRepsInSet}
                    totalReps={reps}
                    isInBreak={isInBreak}
                    breakTimeRemaining={breakTimeRemaining}
                    currentSet={currentSet}
                    totalSets={sets}
                    showTrainerImage={showTrainerAtMilestone}
                    trainerId={trainerId}
                    exerciseGif={exerciseGif || null}
                />
            </View>

            <View style={styles.repSetContainer}>
                <Text style={styles.repSetText}>
                    Set <Text style={styles.repSetBold}>{currentSet}</Text> - Rep{' '}
                    <Text style={styles.repSetBold}>
                        {completedRepsInSet}/{reps}
                    </Text>
                </Text>
                <Text style={styles.paceText}>⚡ {isInBreak || isComplete ? `${timeBetweenRepsInSec}s` : `${repCountdown}s`}</Text>
            </View>

            {!isComplete && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={styles.cancelBtnTxt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pauseBtn} onPress={handlePauseResume}>
                        <Text style={styles.pauseBtnTxt}>{isPaused ? 'Resume' : 'Pause'}</Text>
                    </TouchableOpacity>
                </View>
            )}
                <Modal transparent visible={showBottomSheet}>
                    <View style={styles.overlay}>
                        <BottomSheet
                            totalReps={sets * reps}
                            calories={totalCalories}
                            onClose={handleCloseBottomSheet}
                            onNextExercise={handleNextExercise}
                            onViewHistory={handleViewHistory}
                            workoutName={workoutName}
                            workoutTimestamp={savedTimestamp}
                        />
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme) => StyleSheet.create({
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
    progressBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    bubbleContainer: {
        position: 'absolute',
        top: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    repsCount: {
        fontSize: 34,
        fontFamily: theme.fonts.bold,
        margin: 10,
        color: theme.colors.primary,
    },
    repSetContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    repSetText: {
        fontSize: 18,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textMuted,
    },
    repSetBold: {
        fontSize: 22,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
    },
    paceText: {
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
        marginTop: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        gap: 9,
        marginBottom: 30,
    },
    cancelBtn: {
        backgroundColor: theme.colors.background,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtnTxt: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        fontSize: 15,
    },
    pauseBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    pauseBtnTxt: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 15,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
});

export default WorkoutScreen;
