import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPlaySoundsOption, setSelectedPlaySoundsOption] = useState(null);
    const [selectedDelay, setSelectedDelay] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedItem = await AsyncStorage.getItem('selectedTrainer');
                const savedTime = await AsyncStorage.getItem('selectedTime');
                const savedPlaySoundsOption = await AsyncStorage.getItem('selectedPlaySoundsOption');
                const savedDelay = await AsyncStorage.getItem('selectedDelay');
                setSelectedTrainer(savedItem || "1"); // Default to "1"
                setSelectedTime(savedTime || "2s"); // Default to "2s"
                setSelectedPlaySoundsOption(savedPlaySoundsOption || "yes"); //defaults to true
                setSelectedDelay(savedDelay || "5s"); // Default to "5s"
            } catch (error) {
                console.error('Failed to load settings', error);
            }
        };

        loadSettings();
    }, []);

    const saveSettings = async (trainer, time, playSoundsOption, delay) => {
        try {
            await AsyncStorage.setItem('selectedTrainer', trainer);
            await AsyncStorage.setItem('selectedTime', time);
            await AsyncStorage.setItem('selectedPlaySoundsOption', playSoundsOption);
            await AsyncStorage.setItem('selectedDelay', delay);
        } catch (error) {
            console.error('Failed to save settings', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ selectedTrainer, setSelectedTrainer, selectedTime, setSelectedTime, saveSettings, selectedPlaySoundsOption, setSelectedPlaySoundsOption, selectedDelay, setSelectedDelay }}>
            {children}
        </SettingsContext.Provider>
    );
};

export { SettingsContext, SettingsProvider };