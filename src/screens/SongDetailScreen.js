import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SongDetailScreen({ navigation, route }) {
    const { song } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);

    useEffect(() => {
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            // Pausar
            setIsPlaying(false);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        } else {
            // Reproducir
            setIsPlaying(true);
            simulatePlayback();
        }
    };

    const simulatePlayback = () => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }

        progressInterval.current = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(progressInterval.current);
                    setIsPlaying(false);
                    return 0;
                }
                return prevProgress + 1;
            });
        }, 100);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const currentTime = (progress / 100) * 225; // 3:45 en segundos = 225
    const totalTime = 225;

    return (
        <SafeAreaView style={styles.container}>
            {/* Botón de regreso */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Álbum art */}
            <View style={styles.albumArtContainer}>
                <Image
                    style={styles.albumArt}
                    source={{ uri: song.albumArt || 'https://via.placeholder.com/300/24b946/ffffff?text=Album' }}
                />
            </View>

            {/* Información de la canción */}
            <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song.title || 'Canción sin título'}</Text>
                <Text style={styles.songArtist}>{song.artist || 'Artista desconocido'}</Text>
                <Text style={styles.songAlbum}>{song.album || 'Álbum desconocido'}</Text>
            </View>

            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progress}%` }]} />
                </View>
                <View style={styles.timeLabels}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
                </View>
            </View>

            {/* Controles de reproducción */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton}>
                    <MaterialIcons name='skip-previous' size={40} color={'#24b946'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
                    <MaterialIcons
                        name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                        size={80}
                        color={'#24b946'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton}>
                    <MaterialIcons name='skip-next' size={40} color={'#24b946'} />
                </TouchableOpacity>
            </View>

            {/* Estado de reproducción */}
            <Text style={styles.playbackStatus}>
                {isPlaying ? 'Reproduciendo...' : 'Pausado'}
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 20,
    },

    backButton: {
        alignSelf: 'flex-start',
        padding: 10,
        marginBottom: 20,
    },

    albumArtContainer: {
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    albumArt: {
        width: 280,
        height: 280,
        borderRadius: 10,
    },

    songInfo: {
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
    },

    songTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },

    songArtist: {
        fontSize: 20,
        color: '#666',
        marginBottom: 5,
    },

    songAlbum: {
        fontSize: 16,
        color: '#888',
    },

    progressContainer: {
        width: '100%',
        marginBottom: 50,
    },

    progressBar: {
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        marginBottom: 10,
    },

    progress: {
        height: '100%',
        backgroundColor: '#24b946',
        borderRadius: 2,
    },

    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    timeText: {
        color: '#666',
        fontSize: 12,
    },

    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30,
    },

    controlButton: {
        padding: 20,
    },

    playButton: {
        paddingHorizontal: 30,
    },

    playbackStatus: {
        fontSize: 16,
        color: '#24b946',
        fontWeight: 'bold',
    },
});
