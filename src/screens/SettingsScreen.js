import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SettingsContext } from '../SettingsContext';
import { useTheme } from '../hooks/use-theme';

const ClickableItem = ({ imageSource, name, isSelected, onPress, theme }) => {
    const styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <TouchableOpacity onPress={onPress} style={styles.trainersContainer}>
            <View style={[styles.imageContainer, isSelected && styles.selectedImageContainer]}>
                <Image source={imageSource} style={styles.image} />
            </View>
            <Text style={[styles.trainerText, isSelected && styles.selectedTrainerText]}>{name}</Text>
        </TouchableOpacity>
    );
};

const SettingsScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { selectedTrainer, setSelectedTrainer, selectedTime, setSelectedTime,
            selectedPlaySoundsOption, selectedDelay, saveSettings } = useContext(SettingsContext);
    const [localSelectedTrainer, setLocalSelectedTrainer] = useState(selectedTrainer);
    const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);

    const handleSave = () => {
        setSelectedTrainer(localSelectedTrainer);
        setSelectedTime(localSelectedTime);
        saveSettings(localSelectedTrainer, localSelectedTime, selectedPlaySoundsOption, selectedDelay);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('GearSettings')} style={styles.headerBtn}>
                    <Ionicons name="settings-outline" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Choose your Personal Trainer</Text>
                    <View style={styles.trainerRow}>
                        <ClickableItem
                            imageSource={require('../../assets/trainer-alan.png')}
                            name="ALAN"
                            isSelected={localSelectedTrainer === "1"}
                            onPress={() => setLocalSelectedTrainer("1")}
                            theme={theme}
                        />
                        <ClickableItem
                            imageSource={require('../../assets/trainer-lina.png')}
                            name="LINA"
                            isSelected={localSelectedTrainer === "2"}
                            onPress={() => setLocalSelectedTrainer("2")}
                            theme={theme}
                        />
                    </View>

                    <Text style={styles.title}>Choose your workout pace</Text>
                    <View style={styles.timeOptionsContainer}>
                        {[
                            { label: 'Light', value: '5s' },
                            { label: 'Normal', value: '10s' },
                            { label: 'Heavy', value: '20s' },
                        ].map((pace) => (
                            <TouchableOpacity
                                key={pace.value}
                                onPress={() => setLocalSelectedTime(pace.value)}
                                style={[
                                    styles.timeOption,
                                    localSelectedTime === pace.value && styles.selectedTimeOption,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.timeOptionText,
                                        localSelectedTime === pace.value && styles.selectedTimeOptionText,
                                    ]}
                                >
                                    {pace.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                        <Text style={styles.cancelBtnTxt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                        <Text style={styles.saveBtnTxt}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center',
        lineHeight: 24,
    },
    trainerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 40,
    },
    trainersContainer: {
        alignItems: 'center',
    },
    imageContainer: {
        borderRadius: 75,
        overflow: 'hidden',
        width: 120,
        height: 120,
        borderWidth: 2.5,
        borderColor: 'transparent',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    selectedImageContainer: {
        borderColor: theme.colors.primary,
    },
    trainerText: {
        marginTop: 10,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        color: theme.colors.textSecondary,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    selectedTrainerText: {
        color: theme.colors.primary,
    },
    timeOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    timeOption: {
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTimeOption: {
        borderColor: theme.colors.primary,
    },
    timeOptionText: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
    },
    selectedTimeOptionText: {
        color: theme.colors.primary,
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingBottom: 40,
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    cancelBtnTxt: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        fontSize: 20,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    saveBtnTxt: {
        color: theme.colors.white,
        fontFamily: theme.fonts.bold,
        fontSize: 20,
    },
});

export default SettingsScreen;
