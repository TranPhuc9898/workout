import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPlaySoundsOption, setSelectedPlaySoundsOption] = useState(null);
    const [selectedDelay, setSelectedDelay] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(null);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedItem = await AsyncStorage.getItem('selectedTrainer');
                const savedTime = await AsyncStorage.getItem('selectedTime');
                const savedPlaySoundsOption = await AsyncStorage.getItem('selectedPlaySoundsOption');
                const savedDelay = await AsyncStorage.getItem('selectedDelay');
                const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
                setSelectedTrainer(savedItem || "1"); // Default to "1"
                // Migrate old values (2s/3s/4s) → new pace values
                const validPaces = ['5s', '10s', '20s'];
                const migratedTime = validPaces.includes(savedTime) ? savedTime : '5s';
                setSelectedTime(migratedTime); // Default to Light (5s)
                setSelectedPlaySoundsOption(savedPlaySoundsOption || "yes"); //defaults to true
                setSelectedDelay(savedDelay || "5s"); // Default to "5s"
                setIsDarkMode(savedDarkMode === 'true');
                setSettingsLoaded(true);
            } catch (error) {
                console.error('Failed to load settings', error);
                setSettingsLoaded(true);
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

    // Persist dark mode separately — only after initial load
    useEffect(() => {
        if (settingsLoaded && isDarkMode !== null) {
            AsyncStorage.setItem('isDarkMode', String(isDarkMode));
        }
    }, [isDarkMode, settingsLoaded]);

    return (
        <SettingsContext.Provider value={{
            selectedTrainer, setSelectedTrainer,
            selectedTime, setSelectedTime,
            saveSettings,
            selectedPlaySoundsOption, setSelectedPlaySoundsOption,
            selectedDelay, setSelectedDelay,
            isDarkMode: isDarkMode ?? false, setIsDarkMode,
            settingsLoaded,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export { SettingsContext, SettingsProvider };
