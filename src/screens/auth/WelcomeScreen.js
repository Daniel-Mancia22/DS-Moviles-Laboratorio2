import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                console.log('Token encontrado, redirigiendo a Profile...');
                navigation.replace('Profile');
            }
        } catch (error) {
            console.error('Error verificando token:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/Logoo.png')}
                        style={styles.logo}
                        resizeMode="cover"
                    />
                </View>
                <Text style={styles.title}>DM - bMusic</Text>
                <Text style={styles.subtitle}>¡Bienvenidos!</Text>
                <Text style={styles.version}>v1.0.2</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
        backgroundColor: '#ffffff',
    },

    header: {
        alignItems: 'center',
        marginTop: 50,
    },

    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f0f9f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 4,
        borderColor: '#24b946',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#24b946',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },

    subtitle: {
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: '600',
    },

    version: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },

    buttonsContainer: {
        width: '80%',
        marginBottom: 50,
    },

    button: {
        backgroundColor: '#24b946',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    loginButton: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#24b946',
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    loginButtonText: {
        color: '#24b946',
        fontSize: 18,
        fontWeight: 'bold',
    },
});