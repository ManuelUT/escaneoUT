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

// Lista de archivos QR y resultado (se descubren dinámicamente o se hardcodean)
const QR_FILES = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png'];
const RESULTADO_FILES = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png'];

// ══════════════════════════════════════════
//  Estado
// ══════════════════════════════════════════

let qrMap = {};          // contenido QR normalizado → nombre archivo resultado
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

const welcomeScreen   = document.getElementById('welcomeScreen');
const scannerScreen   = document.getElementById('scannerScreen');
const resultScreen    = document.getElementById('resultScreen');
const errorScreen     = document.getElementById('errorScreen');
const btnEscanear     = document.getElementById('btnEscanear');
const btnEscanearOtro = document.getElementById('btnEscanearOtro');
const btnReintentar   = document.getElementById('btnReintentar');
const cameraVideo     = document.getElementById('cameraVideo');
const cameraCanvas    = document.getElementById('cameraCanvas');
const scannerStatus   = document.getElementById('scannerStatus');
const imgResultado    = document.getElementById('imgResultado');
const txtNombreArchivo= document.getElementById('txtNombreArchivo');
const txtError        = document.getElementById('txtError');
const loadingOverlay  = document.getElementById('loadingOverlay');

// ══════════════════════════════════════════
//  Navegación entre pantallas
// ══════════════════════════════════════════

function showScreen(screen) {
    [welcomeScreen, scannerScreen, resultScreen, errorScreen].forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

// ══════════════════════════════════════════
//  Carga dinámica de QRs (como la app Android)
// ══════════════════════════════════════════

async function cargarQRs() {
    if (typeof jsQR === 'undefined') {
        console.warn('jsQR no cargado, se usará matching por nombre de archivo.');
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
                img.src = `qr/${filename}`;
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
            // Saltar archivos con error
            console.warn(`Error cargando QR ${filename}:`, e);
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
        // Preferir cámara trasera
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

        // Esperar a que el autofoco se estabilice, luego empezar a escanear
        setTimeout(() => {
            scannerStatus.textContent = 'Apunta la cámara al código QR';
            escanearFrames();
        }, FOCUS_STABILIZATION_MS);

    } catch (err) {
        console.error('Error cámara:', err);
        scannerStatus.textContent = 'No se pudo acceder a la cámara';

        // Fallback iOS: si getUserMedia falla, ofrecer captura por foto
        if (/iPhone|iPad/.test(navigator.userAgent)) {
            setTimeout(() => ofrecerCapturaFoto(), 1000);
        }
    }
}

function detenerCamara() {
    if (scanAnimFrame) {
        cancelAnimationFrame(scanAnimFrame);
        scanAnimFrame = null;
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    cameraVideo.srcObject = null;
}

function escanearFrames() {
    if (!cameraStream || isProcessing) return;

    const canvas = cameraCanvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function tick() {
        if (!cameraStream || isProcessing) return;

        if (cameraVideo.readyState >= cameraVideo.HAVE_ENOUGH_DATA) {
            canvas.width = cameraVideo.videoWidth;
            canvas.height = cameraVideo.videoHeight;
            ctx.drawImage(cameraVideo, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (typeof jsQR !== 'undefined') {
                const code = jsQR(imageData.data, canvas.width, canvas.height, {
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
    const now = Date.now();

    // Ignorar durante estabilización de enfoque
    if (now - cameraStartTime < FOCUS_STABILIZATION_MS) return;

    // Cooldown
    if (now - lastScanTime < SCAN_COOLDOWN_MS) return;
    if (isProcessing) return;

    // Confirmación: misma lectura N veces seguidas
    if (texto === lastPartialRead) {
        confirmationCount++;
    } else {
        lastPartialRead = texto;
        confirmationCount = 1;
    }

    if (confirmationCount < REQUIRED_CONFIRMATIONS) return;

    // QR confirmado
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
//  Fallback: Captura por foto (iOS sin cámara en vivo)
// ══════════════════════════════════════════

function ofrecerCapturaFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (typeof jsQR !== 'undefined') {
                const code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: 'attemptBoth'
                });
                if (code && code.data) {
                    mostrarResultado(code.data.trim());
                } else {
                    mostrarError('No se detectó un código QR en la imagen');
                }
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
        document.body.removeChild(input);
    });

    input.click();
}

// ══════════════════════════════════════════
//  Búsqueda y presentación del resultado
// ══════════════════════════════════════════

async function mostrarResultado(textoEscaneado) {
    // Esperar al mapa si aún carga
    if (!qrMapReady) {
        const start = Date.now();
        while (!qrMapReady && Date.now() - start < 3000) {
            await new Promise(r => setTimeout(r, 50));
        }
    }

    const textoNorm = textoEscaneado.trim().toLowerCase();

    // 1. Coincidencia exacta en el mapa QR
    let archivoDestino = qrMap[textoNorm] || null;

    // 2. Fallback: texto es el nombre del archivo
    if (!archivoDestino) {
        archivoDestino = RESULTADO_FILES.find(f =>
            f.toLowerCase() === textoEscaneado.toLowerCase() ||
            f.replace(/\.[^.]+$/, '').toLowerCase() === textoEscaneado.toLowerCase()
        ) || null;
    }

    // 3. Fallback: nombre del archivo está dentro del texto
    if (!archivoDestino) {
        archivoDestino = RESULTADO_FILES.find(f => {
            const nameNoExt = f.replace(/\.[^.]+$/, '').toLowerCase();
            return textoNorm.includes(nameNoExt);
        }) || null;
    }

    // 4. Verificar que el archivo resultado existe
    if (archivoDestino && RESULTADO_FILES.includes(archivoDestino)) {
        detenerCamara();

        const nombreAmigable = archivoDestino.replace(/\.[^.]+$/, '');
        txtNombreArchivo.textContent = `Invitación ${nombreAmigable}`;
        imgResultado.src = `resultado/${archivoDestino}`;

        showScreen(resultScreen);
    } else {
        mostrarError(`QR no reconocido: ${textoEscaneado}`);
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

btnEscanear.addEventListener('click', () => {
    iniciarCamara();
});

btnEscanearOtro.addEventListener('click', () => {
    iniciarCamara();
});

btnReintentar.addEventListener('click', () => {
    iniciarCamara();
});

// ══════════════════════════════════════════
//  Inicialización
// ══════════════════════════════════════════

window.addEventListener('load', () => {
    // Registrar Service Worker para offline
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registrado:', reg.scope))
            .catch(err => console.warn('SW error:', err));
    }

    // Cargar mapa de QRs en background
    cargarQRs();
});

// Limpiar cámara al salir
window.addEventListener('beforeunload', () => {
    detenerCamara();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && cameraStream) {
        detenerCamara();
    }
});

