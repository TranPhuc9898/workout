import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsProvider } from './src/SettingsContext';
import IntroScreen from './src/screens/IntroScreen';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import WorkoutDetailScreen from './src/screens/workout-detail-screen';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
            // Keep the splash screen visible while we fetch resources
            await SplashScreen.preventAutoHideAsync();
            // Pre-load fonts, make any API calls you need to do here
        } catch (e) {
            console.warn(e);
        } finally {
            // Tell the application to render
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
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Intro">
                    <Stack.Screen name="Intro" component={IntroScreen} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="Workout" component={WorkoutScreen} />
                    <Stack.Screen name="Progress" component={ProgressScreen} />
                    <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
}
