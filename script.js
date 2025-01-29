// Tamaño de la vista de video
const tamano = 200;
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let currentStream = null;
let facingMode = "user"; // Inicialmente la cámara frontal
let model = null;
let maxPredictions = 0;

// Carga el modelo de Teachable Machine
(async () => {
    try {
        console.log("Cargando modelo...");
        alert("Cargando modelo...");
        model = await tmImage.load("model.json", "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("Modelo cargado");
        alert("Modelo cargado");
    } catch (err) {
        console.error("Error al cargar el modelo:", err);
        alert("Error al cargar el modelo");
    }
})();

// Configura la cámara al cargar la página
window.onload = () => {
    iniciarCamara();
};

// Función para iniciar la cámara
function iniciarCamara() {
    const opciones = {
        audio: false,
        video: { facingMode, width: tamano, height: tamano }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(stream => {
                currentStream = stream;
                video.srcObject = stream;
                procesarCamara();
            })
            .catch(err => {
                console.error("No se pudo acceder a la cámara:", err);
            });
    } else {
        console.error("getUserMedia no está soportado en este navegador.");
    }
}

// Cambiar entre cámaras frontal y trasera
function cambiarCamara() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    facingMode = facingMode === "user" ? "environment" : "user";
    iniciarCamara();
}

// Procesar el video de la cámara
function procesarCamara() {
    ctx.drawImage(video, 0, 0, tamano, tamano);
    predecir();
    requestAnimationFrame(procesarCamara);
}

// Hacer predicciones usando el modelo cargado
async function predecir() {
    if (model) {
        const predictions = await model.predict(video);
        const resultados = predictions.map(pred => `${pred.className}: ${pred.probability.toFixed(2)}`).join("<br>");
        document.getElementById("label-container").innerHTML = resultados;
    }
}
