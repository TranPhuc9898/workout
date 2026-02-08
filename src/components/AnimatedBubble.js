import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import theme from '../theme';

const AnimatedBubble = ({ quote, duration = 0, delay = 100, playSound = false }) => {
    const bubbleScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const soundRef = useRef(null);

    useEffect(() => {
        const loadAndPlaySound = async () => {
            if (playSound && quote.audio) {
                try {
                    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                    const { sound } = await Audio.Sound.createAsync(quote.audio);
                    soundRef.current = sound;
                    await sound.playAsync();
                } catch (error) {
                    console.log('Failed to load/play sound', error);
                }
            }
        };

        loadAndPlaySound();

    const showBubble = () => {
        const animations = [
            Animated.delay(delay),
            // Scale up the bubble
            Animated.timing(bubbleScale, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            // Scale down the bubble
            Animated.timing(bubbleScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            // Fade in the text
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ];

        if (duration > 0) {
            animations.push(
                Animated.delay(duration - 500),
                // Scale down the bubble
                Animated.timing(bubbleScale, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                })
            );
        }

        Animated.sequence(animations).start();
    };

    // Show the bubble
    showBubble();

    return () => {
        if (soundRef.current) {
            soundRef.current.unloadAsync();
        }
    };
    }, [duration, delay, playSound, quote.audio]);

    return (
        <Animated.View style={[styles.bubble, { transform: [{ scale: bubbleScale }] }]}>
            <Animated.Text style={[styles.bubbleText, { opacity: textOpacity }]}>{quote.text}</Animated.Text>
            <View style={styles.bubbleTriangle}></View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bubble: {
        backgroundColor: theme.colors.backgroundTertiary, // #EEEEEE gray background
        paddingVertical: 20,
        paddingHorizontal: 48,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    bubbleTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 16,
        borderRightWidth: 16,
        borderTopWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: theme.colors.backgroundTertiary, // #EEEEEE to match bubble
        position: 'absolute',
        bottom: -19,
        left: 28,
    },
    bubbleText: {
        color: theme.colors.primary,
        textTransform: 'none',
        fontFamily: theme.fonts.bold,
        fontSize: 24,
        textAlign: 'center',
    },
});

export default AnimatedBubble;