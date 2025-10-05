import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation, onLogin }) {
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Función para alternar visibilidad de contraseña
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const login = async () => {
        // Validaciones
        if (!correo || !contrasenia) {
            Alert.alert('Error', 'Debe llenar todos los campos');
            return;
        }

        if (!correo.includes('@')) {
            Alert.alert('Error', 'Por favor ingresa un email válido(@)');
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                'https://dsm-moviles.onrender.com/users/login',
                {
                    email: correo,
                    password: contrasenia
                }
            );

            // Guardamos el token en AsyncStorage
            await AsyncStorage.setItem('userToken', response.data.token);

            console.log('Login exitoso:', response.data);

            if (onLogin) {
                onLogin(response.data.token);
            }

        } catch (error) {
            console.error('Error:', error.response?.data || error.message);

            let errorMessage = 'Error al iniciar sesión';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>DM - bMusic</Text>
                <Text style={styles.title}>Iniciar Sesión</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    placeholder="Correo electrónico"
                    style={styles.input}
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Campo de contraseña con ícono*/}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Contraseña"
                        style={styles.inputWithIcon}
                        value={contrasenia}
                        onChangeText={setContrasenia}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.iconInsideInput}
                        onPress={toggleShowPassword}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={login}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                    <Text style={styles.linkText}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100,
    },

    header: {
        alignItems: 'center',
        marginBottom: 50,
    },

    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#24b946',
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        color: '#333',
    },

    form: {
        alignItems: 'center',
    },

    // Input normal (para email)
    input: {
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        borderColor: '#ddd',
        marginBottom: 15,
        backgroundColor: 'white',
        fontSize: 16,
    },

    // Contenedor para inputs con ícono (contraseña)
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 15,
        position: 'relative',
    },

    // Input especial para contraseña (con espacio para ícono)
    inputWithIcon: {
        width: '100%',
        borderWidth: 1,
        padding: 15,
        paddingRight: 50,
        borderRadius: 10,
        borderColor: '#ddd',
        backgroundColor: 'white',
        fontSize: 16,
    },

    // Ícono dentro del input
    iconInsideInput: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -11 }],
        padding: 5,
    },

    button: {
        backgroundColor: '#24b946',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        marginTop: 10,
    },

    buttonDisabled: {
        backgroundColor: '#ccc',
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    linkText: {
        color: '#24b946',
        marginTop: 20,
        fontSize: 16,
    },
});