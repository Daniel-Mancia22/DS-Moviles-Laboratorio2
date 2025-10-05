import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation, onLogout }) {
    const [userData, setUserData] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        loadUserData();
        loadUserImage();
    }, []);

    const loadUserImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem('userImage');
            if (savedImage) {
                setImagen(savedImage);
            } else {
                setImagen('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
            }
        } catch (error) {
            setImagen('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
        }
    };

    const changeProfileImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitas permitir el acceso a la galería');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const newImage = result.assets[0].uri;
                setImagen(newImage);
                await AsyncStorage.setItem('userImage', newImage);
                Alert.alert('Éxito', 'Foto de perfil actualizada');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo cambiar la foto de perfil');
        }
    };

    const loadUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            console.log('Token en ProfileScreen:', token);

            if (!token) {
                console.log('No hay token, redirigiendo a Welcome');
                navigation.replace('Welcome');
                return;
            }

            // Obtener datos del perfil
            const profileResponse = await fetch('https://dsm-moviles.onrender.com/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!profileResponse.ok) {
                if (profileResponse.status === 401) {
                    // Token inválido o expirado
                    await AsyncStorage.removeItem('userToken');
                    navigation.replace('Welcome');
                    return;
                }
                throw new Error('Error al cargar perfil');
            }

            const profileData = await profileResponse.json();
            setUserData(profileData);

            // Obtener playlists de la API
            const playlistsResponse = await fetch('https://dsm-moviles.onrender.com/playlists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (playlistsResponse.ok) {
                const playlistsData = await playlistsResponse.json();
                console.log('Playlists from API:', playlistsData);

                if (Array.isArray(playlistsData)) {
                    setPlaylists(playlistsData);
                } else if (playlistsData && Array.isArray(playlistsData.data)) {
                    setPlaylists(playlistsData.data);
                } else {
                    setPlaylists([]);
                }
            } else {
                setPlaylists([]);
            }

        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos');
            await AsyncStorage.removeItem('userToken');
            navigation.replace('Welcome');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí, Cerrar Sesión',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userToken');
                            await AsyncStorage.removeItem('userImage');
                            if (onLogout) {
                                onLogout();
                            }
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                        }
                    }
                }
            ]
        );
    };

    const navigateToPlaylist = (playlist) => {
        navigation.navigate('PlayListDetail', {
            playlist: playlist
        });
    };

    const renderPlaylistItem = ({ item }) => (
        <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => navigateToPlaylist(item)}
        >
            <Text style={styles.playlistName}>{item.name || 'Playlist sin nombre'}</Text>
            <Text style={styles.playlistSongs}>
                {item.songs ? `${item.songs.length} canciones` : '0 canciones'}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error al cargar los datos</Text>
                <TouchableOpacity onPress={loadUserData}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header con botón de logout */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DM - bMusic</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Información del usuario */}
            <View style={styles.userCard}>
                <TouchableOpacity onPress={changeProfileImage}>
                    <Image source={{ uri: imagen }} style={styles.userImage} />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData.name || 'Usuario'}</Text>
                    <Text style={styles.userEmail}>{userData.email}</Text>
                    <Text style={styles.userCity}>{userData.city || 'Ciudad no especificada'}</Text>
                    <TouchableOpacity onPress={changeProfileImage}>
                        <Text style={styles.changePhotoText}>Cambiar foto</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista de playlists */}
            <View style={styles.playlistsSection}>
                <Text style={styles.sectionTitle}>Playlists</Text>
                {playlists.length === 0 ? (
                    <Text style={styles.noPlaylists}>No hay playlists disponibles</Text>
                ) : (
                    <FlatList
                        data={playlists}
                        renderItem={renderPlaylistItem}
                        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    retryText: {
        color: '#24b946',
        marginTop: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#24b946',
    },

    logoutText: {
        color: '#ff3b30',
        fontWeight: 'bold',
    },

    userCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },

    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 15,
        borderWidth: 3,
        borderColor: '#24b946',
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },

    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 3,
    },

    userCity: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },

    changePhotoText: {
        color: '#24b946',
        fontSize: 14,
        fontWeight: 'bold',
    },

    playlistsSection: {
        flex: 1,
        padding: 15,
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#24b946',
        marginBottom: 15,
    },

    noPlaylists: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 50,
    },

    playlistItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },

    playlistName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },

    playlistSongs: {
        fontSize: 14,
        color: '#666',
    },
});