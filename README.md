# AgriWeb App

AgriWeb App es una aplicación web de una sola página (SPA) diseñada para brindar herramientas tecnológicas avanzadas a agricultores y ganaderos. La aplicación integra funcionalidades de autenticación, visualización de mapas interactivos, consulta de datos meteorológicos, análisis masivo de datos y análisis de imágenes mediante inteligencia artificial.

---

## Funcionalidades

### 1. Autenticación de Usuarios
- **Inicio de Sesión, Registro y Recuperación de Contraseña:**  
  Utiliza **Firebase Authentication** para gestionar el acceso de los usuarios.  
  - Inicia sesión con email y contraseña.
  - Registra nuevos usuarios.
  - Recupera la contraseña mediante correo electrónico.
- **Mensaje de Bienvenida:**  
  Al iniciar sesión, se muestra un mensaje de bienvenida personalizado con el email del usuario.

### 2. Mapa Interactivo
- **Geolocalización:**  
  Obtiene la ubicación actual del usuario utilizando la API de geolocalización del navegador.
- **Visualización:**  
  Muestra un mapa interactivo centrado en la ubicación actual utilizando **Leaflet.js**.
- **Capas Adicionales:**  
  - Marca la posición actual del usuario.
  - Dibuja un polígono representando una zona agrícola de ejemplo.
  - Consulta la [Open-Meteo API](https://open-meteo.com/) para mostrar datos meteorológicos y, si se detecta lluvia, dibuja un círculo que representa la intensidad de la precipitación.

### 3. Datos Masivos
- **Tablas Interactivas:**  
  Utiliza **DataTables.js** (con extensión **Buttons**) para listar datos meteorológicos masivos.  
  - Columnas: Fecha/Hora, Temperatura, Humedad, Precipitaciones y Viento.
  - Funcionalidades: Filtros, ordenación y exportación a CSV/Excel.

### 4. Análisis de Imágenes con TensorFlow.js
- **Captura de Imágenes:**  
  Permite capturar imágenes desde la cámara del dispositivo, con opción de elegir entre cámara frontal y trasera.
- **Procesamiento y Análisis:**  
  Utiliza **TensorFlow.js** para analizar la imagen capturada con un modelo preentrenado basado en **MobileNetV2** afinado para tareas agrícolas.  
  - **Detección de Enfermedades:** Evalúa si la planta está saludable o enferma.
  - **Clasificación de Cultivos:** Identifica el tipo de cultivo (por ejemplo, Maíz, Trigo, Soja).
  - **Nivel de Madurez:** Calcula un porcentaje de madurez del fruto.

### 5. Exploración de Secciones
- **Navegación Dinámica:**  
  El dashboard permite navegar fácilmente entre:
  - **Mapa Interactivo:** Muestra el mapa y los datos meteorológicos.
  - **Datos Masivos:** Presenta una tabla interactiva con datos históricos.
  - **Análisis de Imágenes:** Ofrece la herramienta para capturar y analizar imágenes.

---

## Tecnologías Utilizadas

- **Frontend:**  
  - HTML5, CSS3, JavaScript (ES6)
  - [Bootstrap 4.5](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- **Mapas:**  
  - [Leaflet.js](https://leafletjs.com/)
- **Datos Meteorológicos:**  
  - [Open-Meteo API](https://open-meteo.com/)
- **Tablas Interactivas:**  
  - [DataTables.js](https://datatables.net/) con la extensión [Buttons](https://datatables.net/extensions/buttons/)
- **Autenticación:**  
  - [Firebase Authentication](https://firebase.google.com/products/auth)
- **Análisis de Imágenes:**  
  - [TensorFlow.js](https://www.tensorflow.org/js)  
  - Modelo preentrenado basado en **MobileNetV2** (entrada: 416×416×3)
