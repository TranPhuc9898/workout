import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, Image, Animated, StyleSheet, Easing } from 'react-native';
import { Circle, Svg } from "react-native-svg";
import { useTheme } from '../hooks/use-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Circular progress ring with 2 modes:
 * - Rep phase (purple): ring fills per rep, center = "05/13"
 * - Break phase (mint): ring fills over break time, center = "12s"
 * - Trainer image: quick fade out when disappearing
 */
const CircularProgressBar = ({
    ringProgress,
    completedRepsInSet,
    totalReps,
    isInBreak,
    breakTimeRemaining,
    currentSet,
    totalSets,
    showTrainerImage = false,
    trainerId = "1",
    exerciseGif = null,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [showFadingImage, setShowFadingImage] = useState(false);
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const prevShowTrainerRef = useRef(showTrainerImage);

    const radius = 42;
    const circumference = radius * Math.PI * 2;
    const strokeWidth = 15;

    const animProgress = useRef(new Animated.Value(0)).current;
    const circleRef = useRef();

    // Ring color based on phase
    const ringColor = isInBreak ? theme.colors.breakAccent : theme.colors.primary;

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

    useEffect(() => {
        Animated.timing(animProgress, {
            toValue: ringProgress,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [ringProgress]);

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

    const markerDots = [
        { angle: -90 }, { angle: 0 }, { angle: 90 }, { angle: 180 }
    ].map(({ angle }) => {
        const radians = (angle * Math.PI) / 180;
        return {
            x: 50 + radius * Math.cos(radians),
            y: 50 + radius * Math.sin(radians),
        };
    });

    const centerText = isInBreak
        ? `${breakTimeRemaining}s`
        : `${String(completedRepsInSet).padStart(2, '0')}/${totalReps}`;

    const textColor = isInBreak ? theme.colors.breakAccent : theme.colors.primary;
    const shouldShowTrainer = showTrainerImage || showFadingImage;
    const trainerSource = trainerId === "1"
        ? require('../../assets/trainer-alan.png')
        : require('../../assets/trainer-lina.png');

    const ringSize = 340;
    const imageSize = exerciseGif ? 260 : 230;
    const imageRadius = imageSize / 2;

    return (
        <View style={styles.container}>
            {exerciseGif && (
                <View
                    style={{
                        position: 'absolute',
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageRadius,
                        backgroundColor: theme.colors.backgroundTertiary,
                        overflow: 'hidden',
                        zIndex: 0,
                    }}
                >
                    <Image
                        source={{ uri: exerciseGif }}
                        style={{ width: imageSize, height: imageSize }}
                        resizeMode="contain"
                    />
                </View>
            )}

            {shouldShowTrainer && !exerciseGif && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            width: imageSize,
                            height: imageSize,
                            borderRadius: imageRadius,
                            overflow: 'hidden',
                            zIndex: 1,
                        },
                        { opacity: imageOpacity },
                    ]}
                >
                    <Image
                        source={trainerSource}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </Animated.View>
            )}

            <Svg height={ringSize} width={ringSize} viewBox="0 0 100 100">
                <Circle
                    cx="50" cy="50" r={radius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
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
                {markerDots.map((dot, index) => (
                    <Circle
                        key={`marker-${index}`}
                        cx={dot.x} cy={dot.y} r="4"
                        fill="white" stroke="none"
                    />
                ))}
            </Svg>

            {!showTrainerImage && !exerciseGif && (
                <View style={[StyleSheet.absoluteFill, styles.centerContainer]}>
                    <Text style={[styles.centerText, { color: textColor }]}>
                        {centerText}
                    </Text>
                </View>
            )}
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
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
