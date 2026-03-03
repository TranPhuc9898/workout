import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsProvider, SettingsContext } from './src/SettingsContext';
import { getTheme } from './src/theme';
import IntroScreen from './src/screens/IntroScreen';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GearSettingsScreen from './src/screens/gear-settings-screen';
import WorkoutBuddyScreen from './src/screens/workout-buddy-screen';
import TermsOfUseScreen from './src/screens/terms-of-use-screen';
import PrivacyPolicyScreen from './src/screens/privacy-policy-screen';
import AboutScreen from './src/screens/about-screen';
import BuddyInviteScreen from './src/screens/buddy-invite-screen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import WorkoutDetailScreen from './src/screens/workout-detail-screen';
import SavedWorkoutDetailScreen from './src/screens/saved-workout-detail-screen';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

// Inner component that has access to SettingsContext
const AppNavigator = () => {
    const { isDarkMode, settingsLoaded } = useContext(SettingsContext);

    if (!settingsLoaded) return null;
    const theme = getTheme(isDarkMode);

    const navTheme = {
        dark: isDarkMode,
        colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.backgroundSecondary,
            text: theme.colors.textPrimary,
            border: theme.colors.border,
            notification: theme.colors.primary,
        },
    };

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer theme={navTheme}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Intro">
                    <Stack.Screen name="Intro" component={IntroScreen} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="GearSettings" component={GearSettingsScreen} />
                    <Stack.Screen name="WorkoutBuddy" component={WorkoutBuddyScreen} />
                    <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                    <Stack.Screen name="About" component={AboutScreen} />
                    <Stack.Screen name="BuddyInvite" component={BuddyInviteScreen} />
                    <Stack.Screen name="Workout" component={WorkoutScreen} />
                    <Stack.Screen name="Progress" component={ProgressScreen} />
                    <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
                    <Stack.Screen name="SavedWorkoutDetail" component={SavedWorkoutDetailScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    let [fontsLoaded] = useFonts({
    'Overpass': require('./assets/fonts/static/Overpass-Regular.ttf'),
    'Overpass-Bold': require('./assets/fonts/static/Overpass-Bold.ttf'),
    'Overpass-Semi': require('./assets/fonts/static/Overpass-SemiBold.ttf'),
    });

    useEffect(() => {
        async function prepare() {
        try {
            await SplashScreen.preventAutoHideAsync();
        } catch (e) {
            console.warn(e);
        } finally {
            setAppIsReady(true);
        }
    }

    prepare();
    }, []);

    useEffect(() => {
        if (appIsReady && fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady, fontsLoaded]);

    if (!appIsReady || !fontsLoaded) {
        return null;
    }

    return (
        <SettingsProvider>
            <AppNavigator />
        </SettingsProvider>
    );
}
