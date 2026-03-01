import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import theme from '../theme';

const BottomSheet = ({totalReps, calories, onClose, onNextExercise, onViewHistory, workoutName }) => {
    const [name, setName] = useState(workoutName || '');

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/animations/trophy.json')}
                autoPlay
                loop={false}
                style={styles.lottieIcon}
            />
            <Text style={styles.text}>Great job! Workout completed</Text>

            {/* Name your workout */}
            <Text style={styles.nameLabel}>Name your workout</Text>
            <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Front chest - dumbells"
                placeholderTextColor={theme.colors.textMuted}
            />
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
    lottieIcon: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    text: {
        fontFamily: theme.fonts.bold,
        fontSize: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    nameLabel: {
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        color: theme.colors.textPrimary,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 6,
    },
    nameInput: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
        color: theme.colors.textPrimary,
        width: '80%',
        marginBottom: 4,
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
        width: '80%',
        marginTop: 20,
        gap: 10,
    },
    nextButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    nextButtonText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 16,
        textAlign: 'center',
    },
    historyButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    historyButtonText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default BottomSheet;
