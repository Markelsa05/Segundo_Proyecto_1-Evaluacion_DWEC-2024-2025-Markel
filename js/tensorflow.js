// Exporta la función initTensorFlow para que pueda ser llamada desde otros módulos (por ejemplo, app.js)
export function initTensorFlow() {
  // Declaramos variables para almacenar el modelo, el stream de video y los elementos contenedores
  let model;             // Variable que contendrá el modelo preentrenado de TensorFlow.js
  let videoStream;       // Variable para almacenar el objeto MediaStream de la cámara
  let $videoContainer;   // Elemento jQuery que contendrá el video
  let $videoElement;     // Elemento jQuery que mostrará el feed de video

  // Si no existe un contenedor con id "videoContainer", lo creamos y lo añadimos al body
  if ($("#videoContainer").length === 0) {
    $videoContainer = $('<div id="videoContainer" style="display: none;"></div>');
    $("body").append($videoContainer);
  } else {
    // Si ya existe, lo asignamos a la variable
    $videoContainer = $("#videoContainer");
  }
  
  // Creamos un elemento de video utilizando jQuery, con atributos autoplay y playsinline para reproducirse automáticamente y de forma inline
  $videoElement = $('<video autoplay playsinline style="width: 100%;"></video>');
  // Añadimos el elemento de video al contenedor creado o existente
  $videoContainer.append($videoElement);
  
  // Función asíncrona para cargar el modelo preentrenado
  async function loadModel() {
    try {
      // Se carga el modelo desde la ruta especificada. Reemplaza la URL con la de tu modelo exportado para TensorFlow.js.
      model = await tf.loadLayersModel('../assets/mobilenetv2-yolov3-master/tfjs/model.json');
      console.log("Modelo MobileNetV2 para agricultura cargado correctamente.");
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
    }
  }
  
  // Llamamos a la función loadModel() para iniciar la carga del modelo
  loadModel();
  
  // Función asíncrona para iniciar la cámara usando getUserMedia
  // El parámetro facingMode permite elegir entre la cámara trasera ("environment") y la frontal ("user")
  async function startCamera(facingMode = "environment") {
    // Si ya existe un stream activo, se detienen todas las pistas de video
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    try {
      // Se solicita el acceso a la cámara con el modo especificado
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      // Se asigna el objeto MediaStream al elemento de video (accedido con $videoElement[0])
      $videoElement[0].srcObject = videoStream;
      // Se muestra el contenedor de video (que estaba oculto por defecto)
      $videoContainer.show();
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("No se pudo acceder a la cámara.");
    }
  }
  
  // Función para capturar un fotograma del video y convertirlo en un tensor
  function captureFrame() {
    // Crea un elemento canvas para dibujar la imagen capturada
    const canvas = document.createElement("canvas");
    // Ajusta el tamaño del canvas a las dimensiones actuales del video
    canvas.width = $videoElement[0].videoWidth;
    canvas.height = $videoElement[0].videoHeight;
    // Obtiene el contexto 2D del canvas
    const ctx = canvas.getContext("2d");
    // Dibuja la imagen actual del video en el canvas
    ctx.drawImage($videoElement[0], 0, 0, canvas.width, canvas.height);
    // Convierte el contenido del canvas a un tensor
    let tensor = tf.browser.fromPixels(canvas);
    // Redimensiona el tensor al tamaño esperado por el modelo (por ejemplo, 224x224 píxeles)
    tensor = tf.image.resizeBilinear(tensor, [416, 416]);
    // Expande las dimensiones del tensor para incluir la dimensión del lote (batch), resultando en [1, 224, 224, 3]
    tensor = tensor.expandDims(0);
    // Normaliza los valores del tensor a un rango entre 0 y 1
    tensor = tensor.toFloat().div(255.0);
    // Retorna el tensor procesado
    return tensor;
  }
  
  // Asigna un evento "click" al botón con id "analyzeBtn"
  $("#analyzeBtn").on("click", async function() {
    // Si no existe un stream activo, solicita al usuario seleccionar la cámara
    if (!videoStream) {
      // Muestra un mensaje de confirmación para elegir la cámara trasera o frontal
      let useRear = confirm("¿Desea utilizar la cámara trasera? (Cancelar para cámara frontal)");
      // Inicia la cámara con el modo seleccionado
      await startCamera(useRear ? "environment" : "user");
      // Informa al usuario que la cámara se ha activado y debe pulsar nuevamente el botón para analizar
      alert("La cámara se ha activado. Pulse nuevamente 'Analizar Imagen' para capturar y analizar.");
      return; // Sale de la función para esperar al siguiente clic
    }
    
    // Captura un fotograma del video y lo convierte en tensor
    const imageTensor = captureFrame();
    
    // Verifica si el modelo ya se ha cargado
    if (model) {
      try {
        // Realiza la predicción utilizando el modelo con el tensor de la imagen
        const prediction = await model.predict(imageTensor);
        // Convierte la salida de la predicción a un array
        const predArray = prediction.dataSync();
        // Interpreta el primer valor para determinar si la planta está saludable (valor > 0.5)
        const healthStatus = predArray[0] > 0.5 ? "Saludable" : "Enfermo";
        // Define un arreglo de tipos de cultivo para la clasificación
        const cropTypes = ["Maíz", "Trigo", "Soja"];
        // Extrae las probabilidades para cada tipo de cultivo (suponiendo que están en las posiciones 1 a 3)
        const cropProbabilities = predArray.slice(1, 4);
        // Encuentra el índice del valor máximo en las probabilidades de cultivo
        const maxIndex = cropProbabilities.indexOf(Math.max(...cropProbabilities));
        // Selecciona el tipo de cultivo basado en el índice obtenido, o "Desconocido" si no coincide
        const cropType = cropTypes[maxIndex] || "Desconocido";
        // Interpreta el quinto valor como el nivel de madurez, y lo convierte a porcentaje
        const maturityLevel = (predArray[4] * 100).toFixed(1) + "%";
        
        // Actualiza el contenido del contenedor con id "analysisResult" para mostrar los resultados
        $("#analysisResult").html(`
          <p><strong>Estado de la planta:</strong> ${healthStatus}</p>
          <p><strong>Tipo de cultivo:</strong> ${cropType}</p>
          <p><strong>Nivel de madurez:</strong> ${maturityLevel}</p>
        `);
      } catch (error) {
        console.error("Error al analizar la imagen:", error);
        // En caso de error, muestra un mensaje en el contenedor de resultados
        $("#analysisResult").html("<p>Error al analizar la imagen.</p>");
      }
    } else {
      // Si el modelo no se ha cargado, notifica al usuario
      alert("El modelo aún no se ha cargado. Inténtelo de nuevo en unos segundos.");
    }
  });
}
