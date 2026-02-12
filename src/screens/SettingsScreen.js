import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsContext } from '../SettingsContext';
import ScreenHeader from '../components/screen-header';

const ClickableItem = ({ imageSource, name, isSelected, onPress }) => {
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
    const { selectedTrainer, setSelectedTrainer, selectedTime, setSelectedTime,
            selectedPlaySoundsOption, selectedDelay, saveSettings } = useContext(SettingsContext);
    const [localSelectedTrainer, setLocalSelectedTrainer] = useState(selectedTrainer);
    const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);

    const handleSave = () => {
        setSelectedTrainer(localSelectedTrainer);
        setSelectedTime(localSelectedTime);
        // Keep existing values for settings not shown in UI
        saveSettings(localSelectedTrainer, localSelectedTime, selectedPlaySoundsOption, selectedDelay);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader showBack title="Settings" showSettings={false} showNotification={false} onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <View style={styles.mainContent}>
                    {/* Section 1: Choose Trainer */}
                    <Text style={styles.title}>Choose your Personal Trainer</Text>
                    <View style={styles.trainerRow}>
                        <ClickableItem
                            imageSource={require('../../assets/trainer-alan.png')}
                            name="ALAN"
                            isSelected={localSelectedTrainer === "1"}
                            onPress={() => setLocalSelectedTrainer("1")}
                        />
                        <ClickableItem
                            imageSource={require('../../assets/trainer-lina.png')}
                            name="LINA"
                            isSelected={localSelectedTrainer === "2"}
                            onPress={() => setLocalSelectedTrainer("2")}
                        />
                    </View>

                    {/* Section 2: Rep speed */}
                    <Text style={styles.title}>
                        Depend on your speed, we give you option to choose how fast we count (between each rep)
                    </Text>
                    <View style={styles.timeOptionsContainer}>
                        {['2s', '3s', '4s', '5s'].map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setLocalSelectedTime(time)}
                                style={[
                                    styles.timeOption,
                                    localSelectedTime === time && styles.selectedTimeOption,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.timeOptionText,
                                        localSelectedTime === time && styles.selectedTimeOptionText,
                                    ]}
                                >
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Bottom buttons */}
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        color: "#81809E",
        fontFamily: 'Overpass',
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
        borderColor: "#7C4DFF",
    },
    trainerText: {
        marginTop: 10,
        fontFamily: 'Overpass',
        fontSize: 14,
        color: '#81809E',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    selectedTrainerText: {
        color: "#7C4DFF",
    },
    timeOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    timeOption: {
        width: 60,
        height: 40,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#CDCDE0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTimeOption: {
        borderColor: "#7C4DFF",
    },
    timeOptionText: {
        color: '#81809E',
        fontFamily: 'Overpass',
        fontSize: 15,
    },
    selectedTimeOptionText: {
        color: "#7C4DFF",
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
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#7C4DFF",
    },
    cancelBtnTxt: {
        color: "#7C4DFF",
        fontFamily: 'Overpass-Bold',
        fontSize: 20,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: "#7C4DFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#7C4DFF",
    },
    saveBtnTxt: {
        color: "white",
        fontFamily: 'Overpass-Bold',
        fontSize: 20,
    },
});

export default SettingsScreen;
