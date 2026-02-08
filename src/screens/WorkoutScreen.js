import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
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
    const { selectedTrainer, selectedTime, selectedPlaySoundsOption } = useContext(SettingsContext);

    const trainerId = selectedTrainer;
    const timeBetweenRepsInSec = parseInt(selectedTime);
    const playSounds = (selectedPlaySoundsOption === 'yes');

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

    let completedRepsInSet = 0;
    let isInBreak = false;

    if (isComplete) {
        completedRepsInSet = reps;
    } else {
        const cycleIndex = Math.min(Math.floor(elapsed / cycleDuration), sets - 1);
        const timeInCycle = elapsed - cycleIndex * cycleDuration;

        if (timeInCycle < setDuration) {
            completedRepsInSet = Math.floor(timeInCycle / timeBetweenRepsInSec);
        } else {
            completedRepsInSet = reps;
            isInBreak = true;
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
            navigation.replace('Workout', { workoutName, sets, reps, breakTime });
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
                {elapsed <= 3 &&
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
                    progress={progress}
                    completedRepsInSet={completedRepsInSet}
                    totalReps={reps}
                    isInBreak={isInBreak}
                    timer={timeRemaining}
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

            <BottomIndicatorBar />
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
    },
    h2: {
        fontSize: 26,
        fontFamily: theme.fonts.bold,
        margin: 10,
    },
    horizontalProgressBarContainer: {
        top: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 140
    },
    buttonRow: {
        position: 'absolute',
        bottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
    cancelBtn: {
        marginTop: 20,
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 16,
        width: "47%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    cancelBtnTxt: {
        color: theme.colors.primary,
        textTransform: 'none',
        fontFamily: theme.fonts.bold,
        fontSize: 20,
    },
    pauseBtn: {
        marginTop: 20,
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 16,
        width: "47%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    pauseBtnTxt: {
        color: theme.colors.white,
        textTransform: 'none',
        fontFamily: theme.fonts.bold,
        fontSize: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
});

export default WorkoutScreen;
