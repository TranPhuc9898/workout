import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import theme from '../theme';

const BottomSheet = ({totalReps, calories, onClose, onNextExercise, onViewHistory }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/thumbs_up.png')} style={styles.icon} />
            <Text style={styles.text}>Great job! Workout completed</Text>
            <View style={styles.statsContainer}>
                <View style={styles.statsContainerItem}>
                    <Text style={styles.stats}>{totalReps}</Text>
                    <Text style={styles.statsType}>Total Reps</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.statsContainerItem}>
                    <Text style={styles.stats}>{calories}</Text>
                    <Text style={styles.statsType}>Calories Burnt*</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={onNextExercise}
                >
                    <Text style={styles.nextButtonText}>Next Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={onViewHistory}
                >
                    <Text style={styles.historyButtonText}>Your History ➜</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    icon: {
        width: 128,
        height: 128,
        marginBottom: 20,
    },
    text: {
        fontFamily: theme.fonts.bold,
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    statsContainer: {
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
        marginBottom: 20,
        width: "80%",
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsContainerItem: {
        alignItems: 'center',
        width: "50%",
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: theme.colors.border,
    },
    stats: {
        fontFamily: theme.fonts.bold,
        fontSize: 26,
        marginBottom: 5,
        textAlign: 'center',
    },
    statsType: {
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.textMuted,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
    nextButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 16,
        width: "48%",
        alignItems: "center",
    },
    nextButtonText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 18,
    },
    historyButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 16,
        width: "48%",
        alignItems: "center",
    },
    historyButtonText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 18,
    },
});

export default BottomSheet;
