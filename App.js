import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import PlayListDetailScreen from './src/screens/PlayListDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                setUserToken(token);
                console.log('Token encontrado:', token ? 'Sí' : 'No');
            } catch (error) {
                console.error('Error al verificar token:', error);
                setUserToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#24b946" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {userToken ? (
                    // Flujo principal - Para usuarios autenticados
                    <>
                        <Stack.Screen name="Profile">
                            {props => <ProfileScreen {...props} onLogout={() => setUserToken(null)} />}
                        </Stack.Screen>
                        <Stack.Screen name="PlayListDetail" component={PlayListDetailScreen} />
                        <Stack.Screen name="SongDetail" component={SongDetailScreen} />
                    </>
                ) : (
                    // Flujo de auth - Para usuarios no autenticados
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login">
                            {props => <LoginScreen {...props} onLogin={setUserToken} />}
                        </Stack.Screen>
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}