# DM - bMusic 🎵

## 📱 Descripción
DM - bMusic es una aplicación de streaming musical que ofrece una experiencia intuitiva para los amantes de la música. La aplicación incluye autenticación de usuarios, gestión de perfiles, exploración de playlists y un reproductor de música integrado.

## 🎯Funcionalidades Principales

### **🔐 Autenticación y Usuario**
  - Registro de usuarios con foto de perfil
  - Inicio de sesión seguro con tokens JWT
  - Gestión de perfil con información personal
  - Cierre de sesión con confirmación

### **🎵 Experiencia Musical**
  - Exploración de playlists desde la API
  - Detalle de canciones con información completa
  - Reproductor integrado con controles de reproducción
  - Barra de progreso en tiempo real
  - Simulación de reproducción con controles play/pause

### **📱 Interfaz de Usuario**
  - Navegación fluida entre pantallas
  - Diseño responsive y moderno
  - Indicadores de carga durante las operaciones
  - Manejo de errores con mensajes informativos
  
## 🛠 Tecnologías Utilizadas

### Frontend 📲
- React Native - Framework para desarrollo móvil
- Expo - Plataforma para desarrollo React Native
- React Navigation - Navegación (Stack Navigator)
- @expo/vector-icons - Iconografía consistente
- Axios - Cliente HTTP para APIs

### Almacenamiento 🗄️
- AsyncStorage - Almacenamiento local persistente
- Expo ImagePicker - Selección de imágenes de galería

### Backend 🌐
- API REST - Comunicación con servidor externo
- Autenticación JWT - Manejo seguro de sesiones

## 🚀 Flujo de la Aplicación

### Primer Uso
- Pantalla de Bienvenida → Presentación de la app
- Registro/Login → Crear cuenta o iniciar sesión
- Perfil → Visualización de datos de usuario y playlists

### Usuario Autenticado
- Lista de Playlists → Navegación desde el perfil
- Detalle de Playlist → Canciones disponibles
- Reproductor → Control de reproducción musical

## 📊 Características del Reproductor

- **Controles básicos:** Play, Pause, Next, Previous
- Barra de progreso visual
- Tiempo transcurrido y total
- **Información de canción:** título, artista, álbum
- Album art con diseño atractivo

## 🔒 Seguridad

- Tokens JWT para autenticación
- Validación de permisos en cada pantalla
- Manejo seguro de credenciales
- Logout automático en tokens expirados

## 🎨 Personalización
### Perfil de Usuario
  - Foto de perfil editable desde la galería
  - Información personal: nombre, email, ciudad
  - Playlists personales sincronizadas con la API

### Experiencia Visual
  - Tema verde corporativo (#24b946)
  - Animaciones y transiciones suaves
  - Indicadores de estado claros

## 👨🏽‍💻 Desarrollador
- [Daniel Mancia](https://github.com/Daniel-Mancia22) - DevMadCode

## 📄 Notas del Proyecto
- **Propósito Académico:** Desarrollado para el segundo laboratorio de "Desarrollo de Aplicaciones para Dispositivos Móviles"
- **Base Sólida:** Código estructurado para futuras mejoras y funcionalidades adicionales
