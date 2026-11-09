/**
 * Ximbal PWA — Escáner QR de Invitaciones
 * Réplica web de la app Android con soporte offline (Service Worker + PWA)
 */

// ══════════════════════════════════════════
//  Constantes
// ══════════════════════════════════════════

const FOCUS_STABILIZATION_MS = 1500;
const SCAN_COOLDOWN_MS = 2500;
const REQUIRED_CONFIRMATIONS = 2;

const QR_FILES = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png'];
const RESULTADO_FILES = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png'];

// ══════════════════════════════════════════
//  Estado
// ══════════════════════════════════════════

let qrMap = {};
let qrMapReady = false;
let cameraStream = null;
let scanAnimFrame = null;
let cameraStartTime = 0;
let lastScanTime = 0;
let isProcessing = false;
let lastPartialRead = null;
let confirmationCount = 0;

// ══════════════════════════════════════════
//  Elementos DOM
// ══════════════════════════════════════════

const welcomeScreen    = document.getElementById('welcomeScreen');
const scannerScreen    = document.getElementById('scannerScreen');
const resultScreen     = document.getElementById('resultScreen');
const errorScreen      = document.getElementById('errorScreen');
const btnEscanear      = document.getElementById('btnEscanear');
const btnEscanearOtro  = document.getElementById('btnEscanearOtro');
const btnReintentar    = document.getElementById('btnReintentar');
const btnVolver        = document.getElementById('btnVolver');
const btnCapturarFoto  = document.getElementById('btnCapturarFoto');
const inputFoto        = document.getElementById('inputFoto');
const cameraVideo      = document.getElementById('cameraVideo');
const cameraCanvas     = document.getElementById('cameraCanvas');
const scannerStatus    = document.getElementById('scannerStatus');
const imgResultado     = document.getElementById('imgResultado');
const txtNombreArchivo = document.getElementById('txtNombreArchivo');
const txtError         = document.getElementById('txtError');

// ══════════════════════════════════════════
//  Navegación entre pantallas
// ══════════════════════════════════════════

function showScreen(screen) {
    [welcomeScreen, scannerScreen, resultScreen, errorScreen].forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

function volverAInicio() {
    detenerCamara();
    showScreen(welcomeScreen);
}

// ══════════════════════════════════════════
//  Carga dinámica de QRs
// ══════════════════════════════════════════

async function cargarQRs() {
    if (typeof jsQR === 'undefined') {
        console.warn('jsQR no cargado, se usará matching por nombre.');
        qrMapReady = true;
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (const filename of QR_FILES) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = 'qr/' + filename;
            });

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height, {
                inversionAttempts: 'attemptBoth'
            });

            if (code && code.data) {
                const key = code.data.trim().toLowerCase();
                qrMap[key] = filename;
            }
        } catch (e) {
            console.warn('Error cargando QR ' + filename + ':', e);
        }
    }

    qrMapReady = true;
    console.log('Mapa QR cargado:', Object.keys(qrMap).length, 'entradas');
}

// ══════════════════════════════════════════
//  Cámara y Escaneo
// ══════════════════════════════════════════

async function iniciarCamara() {
    showScreen(scannerScreen);
    scannerStatus.textContent = 'Iniciando cámara…';

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        cameraVideo.srcObject = cameraStream;
        await cameraVideo.play();

        cameraStartTime = Date.now();
        resetConfirmacion();
        isProcessing = false;
        lastScanTime = 0;

        scannerStatus.textContent = 'Enfocando cámara…';

        setTimeout(function() {
            scannerStatus.textContent = 'Apunta la cámara al código QR';
            escanearFrames();
        }, FOCUS_STABILIZATION_MS);

    } catch (err) {
        console.error('Error cámara:', err);
        scannerStatus.textContent = 'No se pudo acceder a la cámara. Usa "Tomar foto".';
    }
}

function detenerCamara() {
    if (scanAnimFrame) {
        cancelAnimationFrame(scanAnimFrame);
        scanAnimFrame = null;
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(function(track) { track.stop(); });
        cameraStream = null;
    }
    cameraVideo.srcObject = null;
}

function escanearFrames() {
    if (!cameraStream || isProcessing) return;

    var canvas = cameraCanvas;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });

    function tick() {
        if (!cameraStream || isProcessing) return;

        if (cameraVideo.readyState >= cameraVideo.HAVE_ENOUGH_DATA) {
            canvas.width = cameraVideo.videoWidth;
            canvas.height = cameraVideo.videoHeight;
            ctx.drawImage(cameraVideo, 0, 0);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (typeof jsQR !== 'undefined') {
                var code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: 'dontInvert'
                });

                if (code && code.data) {
                    procesarLectura(code.data.trim());
                }
            }
        }

        scanAnimFrame = requestAnimationFrame(tick);
    }

    scanAnimFrame = requestAnimationFrame(tick);
}

function procesarLectura(texto) {
    var now = Date.now();

    if (now - cameraStartTime < FOCUS_STABILIZATION_MS) return;
    if (now - lastScanTime < SCAN_COOLDOWN_MS) return;
    if (isProcessing) return;

    if (texto === lastPartialRead) {
        confirmationCount++;
    } else {
        lastPartialRead = texto;
        confirmationCount = 1;
    }

    if (confirmationCount < REQUIRED_CONFIRMATIONS) return;

    resetConfirmacion();
    lastScanTime = now;
    isProcessing = true;
    mostrarResultado(texto);
}

function resetConfirmacion() {
    lastPartialRead = null;
    confirmationCount = 0;
}

// ══════════════════════════════════════════
//  Captura por foto (fallback / iOS PWA)
// ══════════════════════════════════════════

function procesarFotoCapturada(file) {
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext('2d');
            // Fondo blanco para transparencias
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (typeof jsQR !== 'undefined') {
                var code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: 'attemptBoth'
                });
                if (code && code.data) {
                    isProcessing = true;
                    mostrarResultado(code.data.trim());
                } else {
                    mostrarError('No se detectó un código QR en la imagen');
                }
            } else {
                mostrarError('Librería de escaneo no disponible');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ══════════════════════════════════════════
//  Búsqueda y presentación del resultado
// ══════════════════════════════════════════

async function mostrarResultado(textoEscaneado) {
    // Esperar al mapa si aún carga
    if (!qrMapReady) {
        var start = Date.now();
        while (!qrMapReady && Date.now() - start < 3000) {
            await new Promise(function(r) { setTimeout(r, 50); });
        }
    }

    var textoNorm = textoEscaneado.trim().toLowerCase();

    // 1. Coincidencia exacta en el mapa QR
    var archivoDestino = qrMap[textoNorm] || null;

    // 2. Fallback: texto es nombre del archivo
    if (!archivoDestino) {
        archivoDestino = RESULTADO_FILES.find(function(f) {
            return f.toLowerCase() === textoEscaneado.toLowerCase() ||
                   f.replace(/\.[^.]+$/, '').toLowerCase() === textoEscaneado.toLowerCase();
        }) || null;
    }

    // 3. Fallback: nombre del archivo dentro del texto
    if (!archivoDestino) {
        archivoDestino = RESULTADO_FILES.find(function(f) {
            var nameNoExt = f.replace(/\.[^.]+$/, '').toLowerCase();
            return textoNorm.includes(nameNoExt);
        }) || null;
    }

    // 4. Mostrar resultado o error
    if (archivoDestino && RESULTADO_FILES.includes(archivoDestino)) {
        detenerCamara();
        var nombreAmigable = archivoDestino.replace(/\.[^.]+$/, '');
        txtNombreArchivo.textContent = 'Invitación ' + nombreAmigable;
        imgResultado.src = 'resultado/' + archivoDestino;
        showScreen(resultScreen);
    } else {
        mostrarError('QR no reconocido: ' + textoEscaneado);
    }
}

function mostrarError(mensaje) {
    isProcessing = false;
    resetConfirmacion();
    detenerCamara();
    txtError.textContent = mensaje;
    showScreen(errorScreen);
}

// ══════════════════════════════════════════
//  Eventos
// ══════════════════════════════════════════

btnEscanear.addEventListener('click', function() {
    iniciarCamara();
});

btnEscanearOtro.addEventListener('click', function() {
    iniciarCamara();
});

btnReintentar.addEventListener('click', function() {
    iniciarCamara();
});

btnVolver.addEventListener('click', function() {
    volverAInicio();
});

btnCapturarFoto.addEventListener('click', function() {
    inputFoto.value = '';
    inputFoto.click();
});

inputFoto.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        procesarFotoCapturada(file);
    }
});

// ══════════════════════════════════════════
//  Inicialización
// ══════════════════════════════════════════

window.addEventListener('load', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(function(reg) { console.log('SW registrado:', reg.scope); })
            .catch(function(err) { console.warn('SW error:', err); });
    }
    cargarQRs();
});

window.addEventListener('beforeunload', function() {
    detenerCamara();
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden && cameraStream) {
        detenerCamara();
    }
});
