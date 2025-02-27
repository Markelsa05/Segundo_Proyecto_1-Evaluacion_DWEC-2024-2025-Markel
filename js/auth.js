// js/auth.js

// Importa funciones necesarias de Firebase, usando la versión modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getAuth,                          // Obtiene la instancia de autenticación
  signInWithEmailAndPassword,       // Función para iniciar sesión con email y contraseña
  createUserWithEmailAndPassword,   // Función para registrar un nuevo usuario
  sendPasswordResetEmail,           // Función para enviar un correo de recuperación de contraseña
  signOut                           // Función para cerrar la sesión
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuración de Firebase: reemplaza estos valores con tu propia configuración.
const firebaseConfig = {
  apiKey: "AIzaSyAJ7VAuYHRwqizlLzFvZiBox-EaH_e_P4Y", // Clave de API
  authDomain: "pruebas-dwec-af678.firebaseapp.com",    // Dominio de autenticación
  projectId: "pruebas-dwec-af678",                      // ID del proyecto Firebase
  storageBucket: "pruebas-dwec-af678.firebasestorage.app", // Bucket para almacenamiento
  messagingSenderId: "734009558879",                    // ID del remitente de mensajes
  appId: "1:734009558879:web:321e4e48649daab2d218ea",   // ID de la aplicación
  measurementId: "G-K6Q75DP50G"                         // ID de medición (opcional)
};

// Inicializa la aplicación de Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);
// Obtiene la instancia de autenticación a partir de la aplicación inicializada
const auth = getAuth(app);

// =============== Funciones Auxiliares ===============

// Función que muestra un elemento en el DOM y asigna un mensaje, coloreándolo según si es error o no
function showElement(elementId, message = '', isError = false) {
  const el = document.getElementById(elementId); // Obtiene el elemento por su ID
  if (el) {                                    // Si el elemento existe
    el.style.display = 'block';                // Lo muestra (display block)
    el.style.color = isError ? 'red' : 'green';  // Asigna color rojo si es error, de lo contrario verde
    el.textContent = message;                  // Establece el mensaje de texto
  }
}

// Función que oculta un elemento y limpia su contenido
function hideElement(elementId) {
  const el = document.getElementById(elementId); // Obtiene el elemento por su ID
  if (el) {                                    // Si el elemento existe
    el.style.display = 'none';                 // Lo oculta (display none)
    el.textContent = '';                       // Limpia el contenido de texto
  }
}

// Función que oculta todos los formularios y muestra el que se le indique
function showForm(formId) {
  // Oculta el formulario de inicio de sesión
  document.getElementById('loginForm').style.display = 'none';
  // Oculta el formulario de registro
  document.getElementById('registerForm').style.display = 'none';
  // Oculta el formulario de recuperación de contraseña
  document.getElementById('resetForm').style.display = 'none';
  // Muestra el formulario cuyo ID se pasó como argumento
  document.getElementById(formId).style.display = 'block';
}

// =============== Encapsulamos la Lógica en initAuth() ===============
export function initAuth() {
  // Configura eventos para alternar entre formularios

  // Al hacer click en el enlace de "Regístrate", muestra el formulario de registro
  document.getElementById('showRegisterForm')?.addEventListener('click', (e) => {
    e.preventDefault();      // Previene la acción por defecto del enlace
    showForm('registerForm'); // Muestra el formulario de registro
  });

  // Al hacer click en el enlace de "Inicia Sesión", muestra el formulario de inicio de sesión
  document.getElementById('showLoginForm')?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('loginForm');
  });

  // Al hacer click en el enlace de "¿Olvidaste tu contraseña?", muestra el formulario de recuperación
  document.getElementById('showResetForm')?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('resetForm');
  });

  // Al hacer click en el enlace de "Volver al Inicio de Sesión", muestra el formulario de inicio
  document.getElementById('backToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('loginForm');
  });

  // =============== Manejo de Inicio de Sesión ===============
  // Obtiene el formulario de inicio de sesión
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // Agrega un listener para el evento submit del formulario
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();      // Previene que se envíe el formulario de forma tradicional
      hideElement('loginError'); // Limpia cualquier mensaje de error previo

      // Obtiene el email y la contraseña de los campos correspondientes
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      // Llama a la función de Firebase para iniciar sesión con email y contraseña
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Guarda el email del usuario en sessionStorage para utilizarlo en el mensaje de bienvenida
          sessionStorage.setItem('userEmail', userCredential.user.email);
          // Redirige al dashboard (página principal) después del inicio exitoso de sesión
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error); // Muestra el error en la consola
          // Muestra un mensaje de error en el formulario de inicio
          showElement('loginError', 'Credenciales incorrectas o usuario no existente.', true);
        });
    });
  }

  // =============== Manejo de Registro de Usuario ===============
  // Obtiene el formulario de registro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    // Agrega un listener para el evento submit del formulario de registro
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();       // Previene el envío tradicional del formulario
      hideElement('registerError');   // Limpia mensajes de error previos
      hideElement('registerSuccess'); // Limpia mensajes de éxito previos

      // Obtiene el email, contraseña y confirmación de contraseña de los campos del formulario
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Verifica que las contraseñas sean iguales
      if (password !== confirmPassword) {
        showElement('registerError', 'Las contraseñas no coinciden.', true);
        return;
      }

      // Llama a la función de Firebase para crear un nuevo usuario
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Muestra un mensaje de éxito si el registro es correcto
          showElement('registerSuccess', 'Registro exitoso. Ahora puedes iniciar sesión.');
          registerForm.reset(); // Reinicia el formulario
        })
        .catch((error) => {
          console.error("Error al registrar usuario:", error);
          // Muestra el error obtenido en el formulario
          showElement('registerError', error.message, true);
        });
    });
  }

  // =============== Manejo de Recuperación de Contraseña ===============
  // Obtiene el formulario de recuperación
  const resetForm = document.getElementById('resetForm');
  if (resetForm) {
    // Agrega un listener para el evento submit del formulario de recuperación
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();      // Previene el envío tradicional
      hideElement('resetError');    // Limpia mensajes de error previos
      hideElement('resetSuccess');  // Limpia mensajes de éxito previos

      // Obtiene el email del campo correspondiente
      const email = document.getElementById('resetEmail').value.trim();

      // Llama a la función de Firebase para enviar el correo de recuperación
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showElement('resetSuccess', 'Correo de recuperación enviado. Revisa tu bandeja de entrada.');
          resetForm.reset(); // Reinicia el formulario
        })
        .catch((error) => {
          console.error("Error al enviar correo de recuperación:", error);
          // Muestra el error en el formulario de recuperación
          showElement('resetError', error.message, true);
        });
    });
  }

  // =============== Manejo de Cerrar Sesión ===============
  // Obtiene el botón de cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    // Agrega un listener para el evento click en el botón de cerrar sesión
    logoutBtn.addEventListener('click', () => {
      // Llama a la función de Firebase para cerrar sesión
      signOut(auth)
        .then(() => {
          // Una vez cerrado, redirige al formulario de login (index.html)
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error);
        });
    });
  }
}
