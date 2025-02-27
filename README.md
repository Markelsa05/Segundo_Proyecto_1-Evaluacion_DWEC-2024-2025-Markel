AgriWeb App
AgriWeb App es una aplicación web de una sola página (SPA) diseñada para proporcionar herramientas tecnológicas avanzadas a agricultores y ganaderos. La aplicación integra funcionalidades de autenticación, geolocalización, visualización de mapas interactivos, consulta de datos meteorológicos, análisis masivo de datos a través de tablas interactivas y análisis de imágenes utilizando inteligencia artificial.

Funcionalidades
1. Autenticación de Usuarios
Inicio de Sesión, Registro y Recuperación de Contraseña:
Utiliza Firebase Authentication para gestionar el acceso de los usuarios. Los formularios de autenticación permiten:
Iniciar sesión con email y contraseña.
Registrar nuevos usuarios.
Recuperar contraseña mediante correo electrónico.
Mensaje de Bienvenida:
Una vez autenticado, se muestra un mensaje de bienvenida que incluye el email del usuario en el dashboard.
2. Mapa Interactivo
Geolocalización:
Utiliza la API de geolocalización del navegador para obtener la posición actual del usuario.
Visualización de Mapas:
Se emplea Leaflet.js para mostrar un mapa interactivo centrado en la ubicación del usuario.
Capas Adicionales:
Se añade un marcador que indica la ubicación actual.
Se dibuja un polígono representando una zona agrícola de ejemplo.
Se consulta la API de Open-Meteo para obtener datos meteorológicos y, si se detecta precipitación, se dibuja un círculo en el mapa representando la intensidad de la lluvia.
3. Datos Masivos
Tablas Interactivas:
Se utiliza DataTables.js con la extensión Buttons para mostrar datos masivos obtenidos de la API de Open-Meteo. Las tablas incluyen:
Fecha/Hora
Temperatura
Humedad
Precipitaciones
Velocidad del viento
Exportación:
Permite exportar los datos a formatos como CSV y Excel.
4. Análisis de Imágenes con TensorFlow.js
Captura de Imágenes:
La aplicación permite capturar imágenes desde la cámara del dispositivo (con opción de elegir entre cámara frontal o trasera).
Procesamiento y Análisis:
Las imágenes capturadas se preprocesan y se analizan mediante un modelo preentrenado usando TensorFlow.js.
Modelo Utilizado:
Se utiliza un modelo basado en MobileNetV2 afinado para tareas agrícolas, con un tamaño de entrada esperado de 416x416 píxeles. El modelo realiza:
Detección de Enfermedades: Identifica si la planta está saludable o presenta indicios de enfermedad.
Clasificación de Tipos de Cultivos: Clasifica la imagen en categorías predefinidas (por ejemplo: Maíz, Trigo, Soja).
Detección de Niveles de Madurez: Estima el nivel de madurez de los frutos (expresado en porcentaje).
5. Exploración de Secciones
Navegación Dinámica:
El dashboard permite al usuario navegar fácilmente entre las secciones:
Mapa Interactivo: Visualización del mapa, datos meteorológicos y capas ambientales.
Datos Masivos: Tabla interactiva con datos meteorológicos.
Análisis de Imágenes: Herramienta para capturar y analizar imágenes agrícolas.
Tecnologías y Herramientas
Frontend:

HTML5, CSS3 y JavaScript (ES6)
Bootstrap 4.5
Mapas:

Leaflet.js para mapas interactivos
Datos Meteorológicos:

Open-Meteo API
Tablas Interactivas:

DataTables.js y su extensión Buttons
Autenticación:

Firebase Authentication
Análisis de Imágenes:

TensorFlow.js
Modelo preentrenado basado en MobileNetV2 afinado para tareas agrícolas (entrada esperada: 416x416x3)
