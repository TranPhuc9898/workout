import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet, Easing } from 'react-native';
import { Circle, Svg } from "react-native-svg";
import theme from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Driven by progress prop, with smooth animation between ticks
const CircularProgressBar = ({ progress, completedRepsInSet, totalReps, isInBreak, timer, showTrainerImage = false, trainerId = "1" }) => {
    const radius = 42;
    const circumference = radius * Math.PI * 2;
    const strokeWidth = 15;

    // Animated value for smooth ring fill
    const animProgress = useRef(new Animated.Value(0)).current;
    const circleRef = useRef();

    // Smoothly animate to new progress value over ~1 second
    useEffect(() => {
        Animated.timing(animProgress, {
            toValue: progress,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    // Update circle strokeDashoffset via native props for performance
    useEffect(() => {
        const listener = animProgress.addListener(({ value }) => {
            if (circleRef.current) {
                const clamped = Math.min(Math.max(value, 0), 1);
                const offset = circumference - (circumference * clamped);
                circleRef.current.setNativeProps({ strokeDashoffset: offset });
            }
        });
        return () => animProgress.removeListener(listener);
    }, []);

    // Static marker dots at 12h, 3h, 6h, 9h positions
    const markerDots = [
        { angle: -90 },  // Top
        { angle: 0 },    // Right
        { angle: 90 },   // Bottom
        { angle: 180 }   // Left
    ].map(({ angle }) => {
        const radians = (angle * Math.PI) / 180;
        return {
            x: 50 + radius * Math.cos(radians),
            y: 50 + radius * Math.sin(radians),
        };
    });

    return (
        <View style={styles.trainerImage}>
            {showTrainerImage && (
                <Image
                    source={trainerId === "1"
                        ? require('../../assets/trainer-alan.png')
                        : require('../../assets/trainer-lina.png')
                    }
                    style={[StyleSheet.absoluteFill, { width: 230, height: 230, borderRadius: 120, zIndex: 0 }]}
                    resizeMode="cover"
                />
            )}

            <Svg height="240" width="240" viewBox="0 0 100 100">
                {/* Background ring */}
                <Circle
                    cx="50" cy="50" r={radius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress ring - animated smoothly */}
                <AnimatedCircle
                    ref={circleRef}
                    cx="50" cy="50" r={radius}
                    stroke={theme.colors.primary}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
                {/* Marker dots */}
                {markerDots.map((dot, index) => (
                    <Circle
                        key={`marker-${index}`}
                        cx={dot.x} cy={dot.y} r="4"
                        fill="white" stroke="none"
                    />
                ))}
            </Svg>

            {/* Rep counter text */}
            {!showTrainerImage && timer > 0 && (
                <View style={[StyleSheet.absoluteFill, styles.repCountsContainer]}>
                    <Text style={styles.repCounts}>
                        {completedRepsInSet}/{totalReps}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    trainerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    repCountsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    repCounts: {
        fontSize: 34,
        fontFamily: theme.fonts.bold,
        textAlign: 'center',
        color: theme.colors.primary,
    },
});

export default CircularProgressBar;
