// js/app.js

// Importa las funciones de inicialización de cada módulo de la aplicación
import { initAuth } from "./auth.js";              // Inicialización de la autenticación (login, registro, recuperación, cierre de sesión)
import { initMap } from "./maps.js";                // Inicialización del mapa interactivo (geolocalización, capas, etc.)
import { initTables } from "./tables.js";           // Inicialización de las tablas interactivas (datos masivos)
import { initTensorFlow } from "./tensorflow.js";   // Inicialización del módulo de análisis de imágenes con TensorFlow.js

// Agrega un listener para ejecutar el código una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Muestra un mensaje en la consola indicando que la aplicación se ha iniciado
  console.log("App.js: Lógica principal de la aplicación iniciada.");

  // Inicializa cada uno de los módulos de la aplicación
  initAuth();          // Configura y activa la autenticación
  initMap();           // Inicializa el mapa interactivo y carga datos meteorológicos
  initTables();        // Configura y llena la tabla interactiva con datos masivos
  initTensorFlow();    // Inicializa el módulo de análisis de imágenes

  // Logica de navegación entre secciones del dashboard 
  // Obtiene los elementos de la barra de navegación para las diferentes secciones
  const navMap = document.getElementById('nav-map');           // Botón para la sección "Mapa Interactivo"
  const navTables = document.getElementById('nav-tables');       // Botón para la sección "Datos Masivos"
  const navTensorFlow = document.getElementById('nav-tensorflow'); // Botón para la sección "Análisis de Imágenes"

  // Obtiene los contenedores correspondientes a cada sección
  const sectionMap = document.getElementById('section-map');         // Contenedor de la sección del mapa
  const sectionTables = document.getElementById('section-tables');     // Contenedor de la sección de tablas
  const sectionTensorFlow = document.getElementById('section-tensorflow'); // Contenedor de la sección de análisis de imágenes

  // Función que oculta todas las secciones y muestra únicamente la sección pasada como parámetro
  function activateSection(sectionToShow) {
    sectionMap.style.display = 'none';         
    sectionTables.style.display = 'none';        
    sectionTensorFlow.style.display = 'none';    
    sectionToShow.style.display = 'block';       
  }

  // Función que actualiza la clase "active" en la barra de navegación para reflejar la sección actual
  function updateActiveNav(activeNav) {
    // Selecciona todos los elementos de la barra de navegación que tengan la clase "nav-link"
    const navItems = document.querySelectorAll("#dashboardNav .nav-link");
    // Remueve la clase "active" de todos ellos
    navItems.forEach(item => item.classList.remove("active"));
    // Agrega la clase "active" al elemento que fue seleccionado
    activeNav.classList.add("active");
  }

  // Asigna eventos de clic a cada botón de navegación para activar la sección correspondiente
  navMap.addEventListener('click', (e) => {
    e.preventDefault();            
    activateSection(sectionMap);   
    updateActiveNav(navMap);       
  });

  navTables.addEventListener('click', (e) => {
    e.preventDefault();            // Previene la acción por defecto
    activateSection(sectionTables);  // Muestra la sección de tablas
    updateActiveNav(navTables);      // Marca el botón de tablas como activo
  });

  navTensorFlow.addEventListener('click', (e) => {
    e.preventDefault();              // Previene la acción por defecto
    activateSection(sectionTensorFlow); // Muestra la sección de análisis de imágenes
    updateActiveNav(navTensorFlow);     // Marca el botón de análisis de imágenes como activo
  });

  // --- Mostrar mensaje de bienvenida en el dashboard ---
  // Recupera el email del usuario almacenado en sessionStorage durante el inicio de sesión
  const userEmail = sessionStorage.getItem('userEmail');
  if (userEmail) {
    // Obtiene el elemento donde se mostrará el mensaje de bienvenida
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
      // Establece el texto de bienvenida, incluyendo el email del usuario
      welcomeMsg.textContent = `Bienvenido ${userEmail}`;
    }
  }
});
