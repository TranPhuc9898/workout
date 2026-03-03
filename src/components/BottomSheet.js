import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { Save, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../hooks/use-theme';
import { updateWorkoutName } from '../data/workout-history-storage';

const BottomSheet = ({totalReps, calories, onClose, onNextExercise, onViewHistory, workoutName, workoutTimestamp }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [name, setName] = useState(workoutName || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        const saveName = name.trim() || workoutName || 'Workout';
        const success = await updateWorkoutName(workoutTimestamp, saveName);
        if (success) {
            setIsSaved(true);
            Alert.alert('Saved!', 'Workout name has been saved.');
        } else {
            Alert.alert('Error', 'Could not save workout name. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoiding}
        >
            <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.container}>
                    <LottieView
                        source={require('../../assets/animations/trophy.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottieIcon}
                    />
                    <Text style={styles.text}>Great job! Workout completed</Text>

                    <Text style={styles.nameLabel}>Name your workout</Text>
                    <View style={styles.nameRow}>
                        <TextInput
                            style={styles.nameInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="Front chest - dumbells"
                            placeholderTextColor={theme.colors.textMuted}
                            editable={!isSaved}
                        />
                        <TouchableOpacity
                            style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
                            onPress={handleSave}
                            disabled={isSaved}
                        >
                            {isSaved
                                ? <CheckCircle size={18} color={theme.colors.white} />
                                : <Save size={18} color={theme.colors.white} />
                            }
                            <Text style={styles.saveButtonText}>
                                {isSaved ? 'SAVED' : 'SAVE'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
            </ScrollView>
        </KeyboardAvoidingView>
        );
    };

const createStyles = (theme) => StyleSheet.create({
    keyboardAvoiding: {
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
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
        color: theme.colors.textPrimary,
    },
    nameLabel: {
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        color: theme.colors.textPrimary,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 6,
    },
    nameRow: {
        flexDirection: 'row',
        width: '80%',
        gap: 8,
        alignItems: 'center',
        marginBottom: 4,
    },
    nameInput: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
        color: theme.colors.textPrimary,
        flex: 1,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    saveButtonSaved: {
        backgroundColor: theme.colors.textMuted,
    },
    saveButtonText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
    },
    statsContainer: {
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
        marginBottom: 20,
        width: "80%",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsContainerItem: {
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
        color: theme.colors.textPrimary,
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
