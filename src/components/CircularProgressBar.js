import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated, StyleSheet, Easing } from 'react-native';
import { Circle, Svg } from "react-native-svg";
import theme from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Circular progress ring with 2 modes:
 * - Rep phase (purple): ring fills per rep, center = "05/13"
 * - Break phase (mint): ring fills over break time, center = "12s"
 * - Trainer image: quick fade out when disappearing
 */
const CircularProgressBar = ({
    ringProgress,       // 0-1 phase-specific progress (rep or break)
    completedRepsInSet,
    totalReps,
    isInBreak,
    breakTimeRemaining, // seconds left in break
    currentSet,
    totalSets,
    showTrainerImage = false,
    trainerId = "1",
}) => {
    const [showFadingImage, setShowFadingImage] = useState(false);
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const prevShowTrainerRef = useRef(showTrainerImage);

    const radius = 42;
    const circumference = radius * Math.PI * 2;
    const strokeWidth = 15;

    // Animated value for smooth ring fill
    const animProgress = useRef(new Animated.Value(0)).current;
    const circleRef = useRef();

    // Ring color based on phase
    const ringColor = isInBreak ? theme.colors.breakAccent : theme.colors.primary;

    // Trainer image: quick fade out when disappearing
    useEffect(() => {
        if (showTrainerImage) {
            setShowFadingImage(true);
            imageOpacity.setValue(1);
        } else if (prevShowTrainerRef.current) {
            prevShowTrainerRef.current = false;
            Animated.timing(imageOpacity, {
                toValue: 0,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                setShowFadingImage(false);
                imageOpacity.setValue(1);
            });
        }
        prevShowTrainerRef.current = showTrainerImage;
    }, [showTrainerImage]);

    // Smoothly animate to new progress value
    useEffect(() => {
        Animated.timing(animProgress, {
            toValue: ringProgress,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [ringProgress]);

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

    // Center text: rep mode = "05/13", break mode = "12s"
    const centerText = isInBreak
        ? `${breakTimeRemaining}s`
        : `${String(completedRepsInSet).padStart(2, '0')}/${totalReps}`;

    // Sub label: set info or break indicator
    const subLabel = isInBreak
        ? `Break`
        : `Set ${currentSet}/${totalSets}`;

    // Text color matches ring color
    const textColor = isInBreak ? theme.colors.breakAccent : theme.colors.primary;

    const shouldShowTrainer = showTrainerImage || showFadingImage;

    return (
        <View style={styles.container}>
            {shouldShowTrainer && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        { width: 230, height: 230, borderRadius: 120, zIndex: 0 },
                        { opacity: imageOpacity },
                    ]}
                >
                    <Image
                        source={trainerId === "1"
                            ? require('../../assets/trainer-alan.png')
                            : require('../../assets/trainer-lina.png')
                        }
                        style={{ width: '100%', height: '100%', borderRadius: 120 }}
                        resizeMode="cover"
                    />
                </Animated.View>
            )}

            <Svg height="240" width="240" viewBox="0 0 100 100">
                {/* Background ring */}
                <Circle
                    cx="50" cy="50" r={radius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress ring - color changes per phase */}
                <AnimatedCircle
                    ref={circleRef}
                    cx="50" cy="50" r={radius}
                    stroke={ringColor}
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

            {/* Center text - rep count or break countdown */}
            {!showTrainerImage && (
                <View style={[StyleSheet.absoluteFill, styles.centerContainer]}>
                    <Text style={[styles.centerText, { color: textColor }]}>
                        {centerText}
                    </Text>
                    <Text style={[styles.subLabel, { color: textColor }]}>
                        {subLabel}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        fontSize: 34,
        fontFamily: theme.fonts.bold,
        textAlign: 'center',
    },
    subLabel: {
        fontSize: 14,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
        marginTop: 2,
        opacity: 0.7,
    },
});

export default CircularProgressBar;
