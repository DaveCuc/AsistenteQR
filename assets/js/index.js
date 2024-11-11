// Crear elementos
const video = document.createElement("video");

// Obtener el canvas donde se dibujará la imagen de la cámara
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

// Lectura desactivada
let scanning = false;

// Función para encender la cámara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // Necesario para que no se muestre a pantalla completa en iOS
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

// Función para dibujar el video en el canvas
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

// Función para intentar decodificar el QR
function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300); // Intentar nuevamente si no se detecta un código
  }
}

// Función para apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

// Función para activar el sonido de escaneo
const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

// Callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    // Mostrar el código QR escaneado
    Swal.fire(respuesta);

    // Reproducir el sonido de escaneo
    activarSonido();

    // Redirigir al script de Google Apps con los datos escaneados
    registrarAsistencia(respuesta);

    // Apagar la cámara después de escanear
    cerrarCamara();
  }
};

// Función para registrar la asistencia
function registrarAsistencia(qrData) {
  const baseUrl = "https://script.google.com/macros/s/AKfycbx-Ug5HcF0lCEcbuDrrhmG7MOrkrpEuu3N0_2cUfI--YuHAx7GPCh3iGBqtjize-1iC2w/exec";
  const fullUrl = `${baseUrl}&data=${qrData}`;
  window.location.href = fullUrl; // Redirigir a la URL para registrar la asistencia
}

// Evento para encender la cámara al cargar la página
window.addEventListener('load', (e) => {
  encenderCamara();
});
