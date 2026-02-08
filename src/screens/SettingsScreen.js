import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsContext } from '../SettingsContext';

const ClickableItem = ({ imageSource, name, isSelected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.trainersContainer, isSelected && styles.selectedTrainer]}>
            <View style={[styles.imageContainer, isSelected && styles.selectedImageContainer]}>
                <Image source={imageSource} style={styles.image} />
            </View>
            <Text style={[styles.trainerText, isSelected && styles.selectedTrainerText]}>{name}</Text>
        </TouchableOpacity>
    );
};

const SettingsScreen = ({ navigation }) => {
    const { selectedTrainer, setSelectedTrainer, selectedTime, setSelectedTime,
            selectedPlaySoundsOption, setSelectedPlaySoundsOption,
            selectedDelay, setSelectedDelay, saveSettings } = useContext(SettingsContext);
    const [localSelectedTrainer, setLocalSelectedTrainer] = useState(selectedTrainer);
    const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);
    const [localSelectedPlaySoundsOption, setLocalSelectedPlaySoundsOption] = useState(selectedPlaySoundsOption);
    const [localSelectedDelay, setLocalSelectedDelay] = useState(selectedDelay);

    const handlePress = (trainerId) => {
        setLocalSelectedTrainer(trainerId);
    };

    const handleTimePress = (time) => {
        setLocalSelectedTime(time);
    };

    const handlePlaySoundsOptionPress = (playSounds) => {
            setLocalSelectedPlaySoundsOption(playSounds);
        };

    const handleDelayPress = (delay) => {
            setLocalSelectedDelay(delay);
        };

    const handleSave = () => {
        setSelectedTrainer(localSelectedTrainer);
        setSelectedTime(localSelectedTime);
        setSelectedPlaySoundsOption(localSelectedPlaySoundsOption);
        setSelectedDelay(localSelectedDelay);
        saveSettings(localSelectedTrainer, localSelectedTime, localSelectedPlaySoundsOption, localSelectedDelay);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.iconsContainer}>
                    <View style={styles.backContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/arrow-back.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.settingsText}>Settings</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log('Notifications icon clicked')}>
                        <Image source={require('../../assets/notifications-icon.png')} style={styles.notificationsIcon} />
                    </TouchableOpacity>
                </View>
            <Text style={styles.title}>Enable Personal Trainer's speech</Text>
            <View style={styles.soundOptionsContainer}>
                {['yes', 'no'].map((playSounds) => (
                    <TouchableOpacity
                        key={playSounds}
                        onPress={() => handlePlaySoundsOptionPress(playSounds)}
                        style={[
                            styles.soundOption,
                            localSelectedPlaySoundsOption === playSounds && styles.selectedTimeOption,
                        ]}
                    >
                        <Text
                            style={[
                                styles.timeOptionText,
                                localSelectedPlaySoundsOption === playSounds && styles.selectedTimeOptionText,
                            ]}
                        >
                            {playSounds}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.title}>Choose your Personal Trainer's voice</Text>
            <View style={styles.trainerRow}>
                <ClickableItem imageSource={require('../../assets/trainer-alan.png')} name="ALAN"
                    isSelected={localSelectedTrainer === "1"}
                    onPress={() => handlePress("1")} />
                <ClickableItem imageSource={require('../../assets/trainer-lina.png')} name="LINA"
                    isSelected={localSelectedTrainer === "2"}
                    onPress={() => handlePress("2")} />
            </View>
            <View style={styles.divider} />
            <Text style={styles.title}>How long do you need before we start counting?</Text>
            <View style={styles.delayOptionsContainer}>
                {['2s', '3s', '4s', '5s'].map((delay) => (
                    <TouchableOpacity
                        key={delay}
                        onPress={() => handleDelayPress(delay)}
                        style={[
                            styles.timeOption,
                            localSelectedDelay === delay && styles.selectedTimeOption,
                        ]}
                    >
                        <Text
                            style={[
                                styles.timeOptionText,
                                localSelectedDelay === delay && styles.selectedTimeOptionText,
                            ]}
                        >
                            {delay}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.title}>Depending on your speed, you can choose how fast we count between each rep</Text>
                        <View style={styles.timeOptionsContainer}>
                            {['2s', '3s', '4s', '5s'].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    onPress={() => handleTimePress(time)}
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
        justifyContent: 'center',
    },
    iconsContainer: {
        position: 'absolute',
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        zIndex: 1,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    settingsText: {
        fontFamily: 'Overpass-Bold',
        fontSize: 20,
        color: '#7C4DFF',
        marginLeft: 20,
    },
    notificationsIcon: {
        width: 24,
        height: 24,
    },
    title: {
        color: "#81809E",
        fontFamily: 'Overpass',
        fontSize: 16,
        marginTop: 20,
        width: '80%',
        textAlign: 'center',
    },
    soundOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
        marginBottom: 15,
    },
    soundOption: {
        width: "48%",
        height: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#81809E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    trainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
        marginBottom: 15,
    },
    trainersContainer: {
        alignItems: 'center',
        width: '46%',
    },
    imageContainer: {
        borderRadius: 75,
        overflow: 'hidden',
        width: 150,
        height: 150,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    divider: {
        marginTop: 5,
        height: 1,
        width: '80%',
        backgroundColor: '#F1F1F2',
      },
    trainerText: {
        marginTop: 10,
        fontFamily: 'Overpass',
        fontSize: 16,
        color: '#81809E',
    },
    selectedTrainer: {
    // Additional styling for selected item
    },
    selectedImageContainer: {
        borderColor: "#7C4DFF",
    },
    selectedtrainerText: {
        color: "#7C4DFF",
    },
    delayOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
        marginBottom: 15,
    },
    timeOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
        marginBottom: 110,
    },
    timeOption: {
        width: "22%",
        height: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#81809E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTimeOption: {
        borderColor: "#7C4DFF",
    },
    timeOptionText: {
        color: '#81809E',
        fontFamily: 'Overpass',
        fontSize: 16,
    },
    selectedTimeOptionText: {
        color: "#7C4DFF",
    },
    buttonRow: {
        position: 'absolute',
        bottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Ensures buttons take full width of their container
        marginTop: 20,
    },
    cancelBtn: {
        marginTop:20,
        backgroundColor:"white",
        padding: 16,
        borderRadius: 16,
        width: "47%",
        alignItems: "center",
        borderWidth: 1, // Add border width
        borderColor: "#7C4DFF", // Add border color
    },
    cancelBtnTxt: {
        color:"#7C4DFF",
        textTransform: 'none',
        fontFamily: 'Overpass-Bold',
        fontSize: 20,
    },
    saveBtn: {
        marginTop:20,
        backgroundColor:"#7C4DFF",
        padding: 16,
        borderRadius: 16,
        width: "47%",
        alignItems: "center",
        borderWidth: 1, // Add border width
        borderColor: "#7C4DFF", // Add border color
    },
    saveBtnTxt: {
        color:"white",
        textTransform: 'none',
        fontFamily: 'Overpass-Bold',
        fontSize: 20,
    },
});

export default SettingsScreen;
