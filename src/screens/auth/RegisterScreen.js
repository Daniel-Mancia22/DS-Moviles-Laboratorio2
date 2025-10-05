import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [imagen, setImagen] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validar email
    const isValidEmail = (email) => {
        return email.includes('@');
    };

    // Seleccionar imagen
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    // Función para alternar visibilidad de contraseña
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const signup = async () => {
        // Validaciones
        if (!nombre || !correo || !contrasenia || !ciudad) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (!isValidEmail(correo)) {
            Alert.alert('Error', 'Por favor ingresa un email válido(@)');
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                'https://dsm-moviles.onrender.com/users/signup',
                {
                    name: nombre,
                    email: correo,
                    password: contrasenia,
                    city: ciudad
                }
            );

            console.log('Usuario creado:', response.data);

            // Guardar imagen en ASYNCSTORAGE
            if (imagen) {
                await AsyncStorage.setItem('userImage', imagen);
            }

            Alert.alert('Éxito', 'Cuenta creada correctamente');

            navigation.replace('Login');

        } catch (error) {
            console.error('Error:', error.response?.data || error.message);

            let errorMessage = 'Error al crear la cuenta';
            if (error.response?.data?.message) {
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
                <Text style={styles.title}>¡Regístrate ahora!</Text>
            </View>

            <View style={styles.form}>
                {/* Campo de imagen */}
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {imagen ? (
                        <Image source={{ uri: imagen }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imageText}>Seleccionar Foto</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    placeholder="Nombre completo"
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                />

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

                <TextInput
                    placeholder="Ciudad"
                    style={styles.input}
                    value={ciudad}
                    onChangeText={setCiudad}
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={signup}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Crear Cuenta</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Welcome')}
                >
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
        paddingTop: 70,
    },

    header: {
        alignItems: 'center',
        marginBottom: 30,
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

    imagePicker: {
        marginBottom: 20,
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#24b946',
        borderStyle: 'dashed',
    },

    imageText: {
        color: '#24b946',
        textAlign: 'center',
    },

    // Contenedor para inputs con ícono
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 15,
        position: 'relative',
    },

    // Input normal (sin ícono)
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

    // Input especial para contraseña (con espacio para ícono)
    inputWithIcon: {
        width: '100%',
        borderWidth: 1,
        padding: 15,
        paddingRight: 50, // Espacio para el ícono
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
        marginTop: 15,
        fontSize: 16,
    },
});