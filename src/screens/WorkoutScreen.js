import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { SettingsContext } from '../SettingsContext';
import AnimatedBubble from '../components/AnimatedBubble';
import CircularProgressBar from '../components/CircularProgressBar';
import HorizontalProgressBar from '../components/HorizontalProgressBar';
import BottomSheet from '../components/BottomSheet';
import BottomIndicatorBar from '../components/BottomIndicatorBar';
import theme from '../theme';

const WorkoutScreen = ({ route }) => {
    const { workoutName, sets, reps, breakTime } = route.params || {};
    const { selectedTrainer, selectedTime, selectedPlaySoundsOption, selectedDelay } = useContext(SettingsContext);

    const trainerId = selectedTrainer || "1";
    const timeBetweenRepsInSec = parseInt(selectedTime) || 2;
    const playSounds = (selectedPlaySoundsOption === 'yes');
    const delayInSec = parseInt(selectedDelay) || 5;

    const finalQuotes = [
        { text: "Great job, you crushed it today!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "That was an awesome workout, well done!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "You pushed yourself hard, I'm proud of you!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "Excellent work, you gave it your all!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "You really showed up and put in the effort!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "You're getting stronger every day, keep it up!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "Fantastic session, your dedication is paying off!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "You should feel really proud of what you accomplished!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "You've earned that rest, great work today!", audio: "great_job_" + trainerId + ".mp3" },
        { text: "Another workout in the books, amazing job!", audio: "great_job_" + trainerId + ".mp3" },
    ];

    const startQuote = { text: "Give me everything you got!", audio: "give_me_everything_" + trainerId + ".mp3" };
    const quarterQuote = { text: "Great job! Keep pushing!", audio: "great_job_keep_pushing_" + trainerId + ".mp3" };
    const halfQuote = { text: "Halfway through, this is where the real progress happens!!", audio: "halfway_through_" + trainerId + ".mp3" };
    const threeQuarterQuote = { text: "Almost done! Your future self will thank you later", audio: "almost_done_" + trainerId + ".mp3" };

    // Workout timing constants
    const totalWorkoutTimeInSec = sets * reps * timeBetweenRepsInSec + ((sets - 1) * breakTime);
    const setDuration = reps * timeBetweenRepsInSec;
    const cycleDuration = setDuration + breakTime;

    // Single source of truth: elapsed seconds (counts UP from 0)
    const [elapsed, setElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const navigation = useNavigation();
    const [randomFinalQuote, setRandomFinalQuote] = useState('');
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const intervalRef = useRef(null);
    const isComplete = elapsed >= totalWorkoutTimeInSec;

    // Derive all workout state from elapsed time
    const timeRemaining = totalWorkoutTimeInSec - elapsed;
    const progress = totalWorkoutTimeInSec > 0 ? elapsed / totalWorkoutTimeInSec : 0;

    // Derive phase state from elapsed time
    let completedRepsInSet = 0;
    let isInBreak = false;
    let currentSet = 1;
    let breakTimeRemaining = 0;
    let ringProgress = 0; // 0-1 phase-specific (rep or break)

    if (isComplete) {
        completedRepsInSet = reps;
        currentSet = sets;
        ringProgress = 1;
    } else {
        const cycleIndex = Math.min(Math.floor(elapsed / cycleDuration), sets - 1);
        const timeInCycle = elapsed - cycleIndex * cycleDuration;
        currentSet = cycleIndex + 1;

        if (timeInCycle < setDuration) {
            // REP PHASE - ring fills smoothly based on time (not discrete rep steps)
            completedRepsInSet = Math.floor(timeInCycle / timeBetweenRepsInSec);
            ringProgress = timeInCycle / setDuration;
        } else {
            // BREAK PHASE - ring fills over break duration
            completedRepsInSet = reps;
            isInBreak = true;
            const breakElapsed = timeInCycle - setDuration;
            breakTimeRemaining = Math.max(breakTime - breakElapsed, 0);
            ringProgress = breakElapsed / breakTime;
        }
    }

    // Keep screen awake during workout
    useEffect(() => {
        activateKeepAwakeAsync();
        return () => deactivateKeepAwake();
    }, []);

    // Random final quote
    useEffect(() => {
        getRandomFinalQuote();
        const interval = setInterval(getRandomFinalQuote, 1000000);
        return () => clearInterval(interval);
    }, []);

    const getRandomFinalQuote = () => {
        const quote = finalQuotes[Math.floor(Math.random() * finalQuotes.length)];
        setRandomFinalQuote(quote);
    };

    // Single interval driving the entire workout
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

    // Workout completion
    useEffect(() => {
        if (isComplete && totalWorkoutTimeInSec > 0) {
            setShowBottomSheet(true);
        }
    }, [isComplete]);

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

    const handleNextExercise = () => {
        setShowBottomSheet(false);
        setTimeout(() => {
            navigation.navigate('Main');
        }, 300);
    };

    const handleViewHistory = () => {
        setShowBottomSheet(false);
        setTimeout(() => {
            navigation.navigate('Progress');
        }, 300);
    };

    const totalCalories = Math.round(sets * reps * 0.5);

    // Trainer appears at 25%, 50%, 75% milestones (for 3 seconds each)
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
            <View style={styles.container}>

            <View style={styles.bubbleContainer}>
                {elapsed <= delayInSec &&
                    <AnimatedBubble quote={startQuote} duration={2000} playSound={playSounds}/>}
                {isComplete && totalWorkoutTimeInSec > 0 &&
                    <AnimatedBubble quote={randomFinalQuote} playSound={playSounds}/>}
                {elapsed >= q1 && elapsed < q1 + 3 &&
                    <AnimatedBubble quote={quarterQuote} duration={2000} playSound={playSounds}/>}
                {elapsed >= q2 && elapsed < q2 + 3 &&
                    <AnimatedBubble quote={halfQuote} duration={3000} playSound={playSounds}/>}
                {elapsed >= q3 && elapsed < q3 + 3 &&
                    <AnimatedBubble quote={threeQuarterQuote} duration={3000} playSound={playSounds}/>}
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
                />
            </View>

            <View style={styles.workoutDetailsContainer}>
                <Text style={styles.h2}>{workoutName}</Text>
                <Text style={styles.h1}>{formatTime(timeRemaining)}</Text>
            </View>

            <View style={styles.horizontalProgressBarContainer}>
                <HorizontalProgressBar progress={progress} durationInSec={totalWorkoutTimeInSec} showTimeLabels={true}/>
            </View>

            {/* Cancel & Pause/Resume buttons */}
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
                        />
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
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
    iconsContainer: {
        position: 'absolute',
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        zIndex: 1,
    },
    progressBarContainer: {
        top: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 60
    },
    notificationsIcon: {
        width: 24,
        height: 24,
    },
    progressBar: {
        width: 240,
        height: 240,
        marginBottom: 20,
    },
    bubbleContainer: {
        position: 'relative',
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    repsCount: {
        fontSize: 34,
        fontFamily: theme.fonts.bold,
        margin: 10,
        color: theme.colors.primary,
    },
    workoutDetailsContainer: {
        position: 'relative',
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    h1: {
        fontSize: 34,
        fontFamily: theme.fonts.bold,
        margin: 10,
        marginBottom: 20,
        color: '#81809E',
    },
    h2: {
        fontSize: 26,
        fontFamily: theme.fonts.bold,
        margin: 10,
    },
    horizontalProgressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        gap: 9,
        marginBottom: 30,
    },
    cancelBtn: {
        backgroundColor: '#272641',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtnTxt: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
    },
    pauseBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    pauseBtnTxt: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
});

export default WorkoutScreen;
