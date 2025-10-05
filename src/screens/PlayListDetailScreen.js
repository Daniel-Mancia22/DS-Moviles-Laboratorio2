import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayListDetailScreen({ navigation, route }) {
    const { playlist } = route.params;

    if (!playlist || !playlist.songs) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No hay canciones para esta playlist 🙁</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: '#24b946', marginTop: 10 }}>Regresar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const navigateToSong = (song) => {
        console.log('Navegando a canción:', song);
        navigation.navigate('SongDetail', { song });
    };

    const renderSongItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigateToSong(item)}
            activeOpacity={0.7}
        >
            <Text style={styles.songNumber}>{index + 1}</Text>
            <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{item.title || 'Canción sin título'}</Text>
                <Text style={styles.songArtist}>{item.artist || 'Artista desconocido'}</Text>
            </View>
            <Ionicons name="play-circle" size={24} color="#24b946" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header con botón de regreso */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.playlistTitle}>{playlist.name || 'Playlist'}</Text>
                    <Text style={styles.songCount}>{playlist.songs.length} canciones</Text>
                </View>
            </View>

            {/* Lista de canciones */}
            <FlatList
                data={playlist.songs}
                renderItem={renderSongItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.songList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    header: {
        backgroundColor: '#24b946',
        padding: 15,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        marginRight: 15,
        padding: 5,
    },

    headerInfo: {
        flex: 1,
    },

    playlistTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },

    songCount: {
        fontSize: 16,
        color: 'white',
        opacity: 0.8,
    },

    songList: {
        flex: 1,
        padding: 15,
    },

    songItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    songNumber: {
        fontSize: 16,
        color: '#666',
        marginRight: 15,
        width: 25,
        textAlign: 'center',
    },

    songInfo: {
        flex: 1,
    },

    songTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },

    songArtist: {
        fontSize: 14,
        color: '#666',
    },
});