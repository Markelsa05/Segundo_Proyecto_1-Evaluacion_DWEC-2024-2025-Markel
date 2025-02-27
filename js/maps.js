// Exporta la función initMap para que pueda ser utilizada en otros módulos
export function initMap() {
  // Verifica si el navegador soporta la API de geolocalización
  if (!navigator.geolocation) {
    alert("La geolocalización no es soportada por este navegador.");
    return; // Termina la ejecución si no hay soporte
  }
  
  // Solicita la posición actual del usuario
  navigator.geolocation.getCurrentPosition(
    // Función de éxito: se recibe el objeto position
    function(position) {
      // Extrae la latitud y longitud de la posición
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      // Inicializa el mapa con Leaflet, centrado en la ubicación actual, con zoom 13
      const map = L.map('map').setView([latitude, longitude], 13);
      // Guarda la instancia del mapa en window para poder usarla en otros módulos (por ejemplo, para agregar capas)
      window.map = map;
      
      // Agrega una capa base de OpenStreetMap al mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      // Añade un marcador en la ubicación actual del usuario
      L.marker([latitude, longitude]).addTo(map)
        .bindPopup("Estás aquí") // Asigna un popup que muestra "Estás aquí"
        .openPopup(); // Abre el popup inmediatamente
      
      // --- Capa de zona agrícola ---
      // Define un conjunto de coordenadas que delimitan una zona agrícola (ejemplo)
      const agriZoneCoords = [
        [latitude + 0.01, longitude - 0.01],
        [latitude + 0.01, longitude + 0.01],
        [latitude - 0.01, longitude + 0.01],
        [latitude - 0.01, longitude - 0.01]
      ];
      // Crea un polígono con las coordenadas definidas y un color verde con poca opacidad
      const agriZone = L.polygon(agriZoneCoords, { color: 'green', fillOpacity: 0.1 }).addTo(map);
      // Asigna un popup al polígono que indica "Zona agrícola relevante"
      agriZone.bindPopup("Zona agrícola relevante");
      
      // --- Consulta a la API de Open-Meteo ---
      // Construye la URL para consultar el pronóstico meteorológico, solicitando datos horarios y actuales
      const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude +
                     '&longitude=' + longitude +
                     '&hourly=temperature_2m,relativehumidity_2m,precipitation,wind_speed_10m' +
                     '&current_weather=true' +
                     '&timezone=auto';
      
      // Realiza una llamada AJAX a la API de Open-Meteo usando jQuery
      $.ajax({
        url: apiUrl,        // URL de la API
        method: 'GET',      // Método HTTP GET
        success: function(response) {  // Función de éxito: se recibe la respuesta de la API
          // Almacena la respuesta en una variable global para que otros módulos (como tables.js) la utilicen
          window.weatherData = response;
          // Dispara un evento personalizado "weatherDataReady" para notificar que los datos están listos
          $(document).trigger("weatherDataReady");
          
          // Procesa los datos del clima actual obtenidos de la respuesta
          const currentWeather = response.current_weather; // Datos meteorológicos actuales
          const currentTime = currentWeather.time;           // Hora actual según la API
          const hourlyTimes = response.hourly.time;            // Array de tiempos para datos horarios
          const index = hourlyTimes.indexOf(currentTime);      // Índice que coincide con el tiempo actual
          // Extrae la humedad, precipitaciones, velocidad del viento y temperatura usando el índice
          const currentHumidity = (index !== -1) ? response.hourly.relativehumidity_2m[index] : 'N/A';
          const currentPrecipitation = (index !== -1) ? response.hourly.precipitation[index] : 'N/A';
          const currentWindSpeed = currentWeather.wind_speed;
          const currentTemperature = currentWeather.temperature;
          
          // Construye el HTML para mostrar la información meteorológica en tarjetas
          let weatherHtml = '<div class="card-deck">';
          weatherHtml += '<div class="card"><div class="card-body"><h5 class="card-title">Temperatura</h5>';
          weatherHtml += '<p class="card-text">' + currentTemperature + ' °C</p></div></div>';
          weatherHtml += '<div class="card"><div class="card-body"><h5 class="card-title">Humedad</h5>';
          weatherHtml += '<p class="card-text">' + currentHumidity + ' %</p></div></div>';
          weatherHtml += '<div class="card"><div class="card-body"><h5 class="card-title">Precipitaciones</h5>';
          weatherHtml += '<p class="card-text">' + currentPrecipitation + ' mm</p></div></div>';
          weatherHtml += '<div class="card"><div class="card-body"><h5 class="card-title">Viento</h5>';
          weatherHtml += '<p class="card-text">' + currentWindSpeed + ' km/h</p></div></div>';
          weatherHtml += '</div>';
          
          // Inserta el HTML generado en el contenedor con ID "weatherInfo"
          $("#weatherInfo").html(weatherHtml);
          
          // Procesa el valor de precipitaciones para determinar si se debe dibujar una capa de lluvia
          const precipitationValue = parseFloat(currentPrecipitation);
          const scaleFactor = 100; // Factor de escala para convertir el valor de precipitación a un radio en metros
          // Si el valor de precipitación es un número y mayor a 0, dibuja un círculo en el mapa
          if (!isNaN(precipitationValue) && precipitationValue > 0) {
            const precipRadius = precipitationValue * scaleFactor;
            const precipCircle = L.circle([latitude, longitude], {
              color: 'blue',         // Borde del círculo en azul
              fillColor: 'blue',      // Color de relleno en azul
              fillOpacity: 0.2,       // Opacidad del relleno
              radius: precipRadius    // Radio del círculo, proporcional a la precipitación
            }).addTo(map);
            // Asigna un popup al círculo para mostrar la cantidad de precipitación
            precipCircle.bindPopup("Precipitación actual: " + currentPrecipitation + " mm");
          } else {
            // Si no se detecta lluvia, informa en la consola
            console.log("No se detecta lluvia; no se dibuja la capa de precipitación.");
          }
        },
        // Función de error en la llamada AJAX
        error: function(error) {
          console.error("Error al consultar la API de Open-Meteo:", error);
        }
      });
    },
    // Función de error al obtener la geolocalización
    function(error) {
      console.error("Error al obtener la geolocalización:", error);
      alert("No se pudo obtener tu ubicación.");
    }
  );
}
