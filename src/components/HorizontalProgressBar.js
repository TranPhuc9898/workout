import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Text } from 'react-native';
import theme from '../theme';

const formatDuration = (durationInSec) => {
    const hours = Math.floor(durationInSec / 3600);
    const minutes = Math.floor((durationInSec % 3600) / 60);
    const seconds = durationInSec % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Driven by progress prop, with smooth animation between ticks
const HorizontalProgressBar = ({ progress = 0, durationInSec, showTimeLabels = true }) => {
    const animProgress = useRef(new Animated.Value(0)).current;

    // Smoothly animate to new progress value over ~1 second
    useEffect(() => {
        Animated.timing(animProgress, {
            toValue: progress * 100,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: animProgress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            left: animProgress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['-1%', '99%'],
                            }),
                        },
                    ]}
                />
            </View>
            {showTimeLabels && (
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>0:00</Text>
                    <Text style={styles.timeText}>{formatDuration(durationInSec)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        width: '80%',
        height: 5,
        backgroundColor: theme.colors.progressGray,
        borderRadius: 10,
        marginBottom: 4,
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
    },
    circle: {
        position: 'absolute',
        top: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
    },
    timeContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    timeText: {
        color: theme.colors.textDark,
        fontSize: 13,
        fontFamily: theme.fonts.regular,
    },
});

export default HorizontalProgressBar;
