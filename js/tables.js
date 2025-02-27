// Exporta la función initTables para que pueda ser utilizada en otros módulos
export function initTables() {
  // Función interna que inicializa la DataTable
  function initDataTable() {
    // Obtiene el objeto 'hourly' del objeto global weatherData
    const hourly = window.weatherData.hourly;
    // Inicializa un arreglo para almacenar las filas de datos de la tabla
    const tableData = [];
    
    // Recorre el array de tiempos para cada dato horario
    for (let i = 0; i < hourly.time.length; i++) {
      // Crea una fila de datos con los valores correspondientes a:
      // Fecha/Hora, Temperatura, Humedad, Precipitaciones y Viento
      tableData.push([
        hourly.time[i],
        hourly.temperature_2m[i],
        hourly.relativehumidity_2m[i],
        hourly.precipitation[i],
        hourly.wind_speed_10m[i]
      ]);
    }
    
    // Verifica si la función DataTable está definida (es decir, si la librería DataTables está cargada)
    if ($.fn.DataTable) {
      // Inicializa la DataTable en el elemento con ID "dataTable"
      $("#dataTable").DataTable({
        data: tableData, // Usa el arreglo de datos construido anteriormente
        columns: [
          { title: "Fecha/Hora" },         // Define la primera columna con este título
          { title: "Temperatura (°C)" },     // Segunda columna: Temperatura en grados Celsius
          { title: "Humedad (%)" },          // Tercera columna: Porcentaje de humedad
          { title: "Precipitaciones (mm)" }, // Cuarta columna: Precipitaciones en milímetros
          { title: "Viento (km/h)" }          // Quinta columna: Velocidad del viento en km/h
        ],
        dom: 'Bfrtip',          // Define el layout del control de la DataTable, incluyendo botones
        buttons: ['copy', 'csv', 'excel'], // Configura los botones para exportar datos (copiar, CSV, Excel)
        order: [[0, 'asc']],    // Ordena la tabla por la primera columna (Fecha/Hora) en orden ascendente
        responsive: true        // Habilita la respuesta adaptativa para dispositivos móviles
      });
    } else {
      // Si la función DataTable no está definida, muestra un error en la consola
      console.error("DataTable is not a function. Asegúrate de que la librería de DataTables y sus extensiones estén correctamente cargadas.");
    }
  }
  
  // Comprueba si la variable global weatherData y su propiedad hourly ya están definidas
  if (window.weatherData && window.weatherData.hourly) {
    // Si los datos ya están disponibles, inicializa la DataTable inmediatamente
    initDataTable();
  } else {
    // Si los datos aún no están disponibles, espera a que se dispare el evento "weatherDataReady"
    $(document).on("weatherDataReady", function() {
      // Una vez que el evento se dispara, inicializa la DataTable
      initDataTable();
    });
  }
}
