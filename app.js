const STORAGE_KEY = 'control_mesas_invitados_v4';
const STORAGE_BACKUP_KEY = 'control_mesas_invitados_v4_backup';
const QR_MAP_KEY = 'mapa_codigos_qr_mesas_v4';
const IDB_NAME = 'MesasQRFailSafeDB';
const IDB_STORE = 'estado_mesas_store';

// Datos iniciales de las 10 mesas (basados en tu boceto y en los 10 QR de qr.zip)
const MESAS_INICIALES = {
  1: {
    numero: 1,
    qr: 'qr/1.png',
    invitados: [
      { id: 'm1-1', nombre: 'Tal nombre', presente: true, hora: 'Confirmado' },
      { id: 'm1-2', nombre: 'Esquís', presente: true, hora: 'Confirmado' },
      { id: 'm1-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm1-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm1-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm1-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  2: {
    numero: 2,
    qr: 'qr/2.png',
    invitados: [
      { id: 'm2-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm2-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm2-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm2-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm2-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm2-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  3: {
    numero: 3,
    qr: 'qr/3.png',
    invitados: [
      { id: 'm3-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm3-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm3-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm3-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm3-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm3-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  4: {
    numero: 4,
    qr: 'qr/4.png',
    invitados: [
      { id: 'm4-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm4-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm4-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm4-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm4-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm4-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  5: {
    numero: 5,
    qr: 'qr/5.png',
    invitados: [
      { id: 'm5-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm5-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm5-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm5-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm5-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm5-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  6: {
    numero: 6,
    qr: 'qr/6.png',
    invitados: [
      { id: 'm6-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm6-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm6-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm6-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm6-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm6-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  7: {
    numero: 7,
    qr: 'qr/7.png',
    invitados: [
      { id: 'm7-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm7-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm7-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm7-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm7-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm7-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  8: {
    numero: 8,
    qr: 'qr/8.png',
    invitados: [
      { id: 'm8-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm8-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm8-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm8-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm8-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm8-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  9: {
    numero: 9,
    qr: 'qr/9.png',
    invitados: [
      { id: 'm9-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm9-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm9-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm9-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm9-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm9-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  },
  10: {
    numero: 10,
    qr: 'qr/10.png',
    invitados: [
      { id: 'm10-1', nombre: 'Invitado 1', presente: false, hora: null },
      { id: 'm10-2', nombre: 'Invitado 2', presente: false, hora: null },
      { id: 'm10-3', nombre: 'Invitado 3', presente: false, hora: null },
      { id: 'm10-4', nombre: 'Invitado 4', presente: false, hora: null },
      { id: 'm10-5', nombre: 'Invitado 5', presente: false, hora: null },
      { id: 'm10-6', nombre: 'Invitado 6', presente: false, hora: null }
    ]
  }
};

let estadoMesas = cargarDatosConVerificacion();
let mapaQrMesas = cargarMapaQr();
let mesaActual = 1;
let modoEdicion = false;
let accionConfirmacionPendiente = null;
let toastTimer = null;

// Variables de control de cámara
let videoStream = null;
let escaneando = false;
let animFrameId = null;

// Referencias del DOM
const scannerView = document.getElementById('scannerView');
const resultView = document.getElementById('resultView');
const qrVideo = document.getElementById('qrVideo');
const qrCanvas = document.getElementById('qrCanvas');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const cameraStatusText = document.getElementById('cameraStatusText');
const btnToggleCamera = document.getElementById('btnToggleCamera');
const qrFileInput = document.getElementById('qrFileInput');
const btnBackToScan = document.getElementById('btnBackToScan');
const scanPill = document.getElementById('scanPill');
const storageStatusBadge = document.getElementById('storageStatusBadge');

const tableTabs = document.getElementById('tableTabs');
const tableTitle = document.getElementById('tableTitle');
const tableCounter = document.getElementById('tableCounter');
const tableQrImg = document.getElementById('tableQrImg');
const qrContainer = document.getElementById('qrContainer');
const guestList = document.getElementById('guestList');
const globalStats = document.getElementById('globalStats');
const btnConfirmAllTable = document.getElementById('btnConfirmAllTable');
const btnToggleAdd = document.getElementById('btnToggleAdd');
const addGuestForm = document.getElementById('addGuestForm');
const newGuestName = document.getElementById('newGuestName');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const confirmModal = document.getElementById('confirmModal');
const confirmModalIcon = document.getElementById('confirmModalIcon');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');
const btnConfirmAccept = document.getElementById('btnConfirmAccept');

const qrModal = document.getElementById('qrModal');
const modalTableTitle = document.getElementById('modalTableTitle');
const modalQrImg = document.getElementById('modalQrImg');
const btnCloseModal = document.getElementById('btnCloseModal');
const saveToast = document.getElementById('saveToast');
const btnExportBackup = document.getElementById('btnExportBackup');
const importBackupInput = document.getElementById('importBackupInput');

/* ==========================================================================
   MOTOR DE PERSISTENCIA A PRUEBA DE FALLOS (LOCALSTORAGE + ESPEJO + INDEXEDDB)
   ========================================================================== */

// Valida que el objeto de mesas tenga estructura íntegra (mesas 1 a 10 y listas válidas)
function esEstructuraValida(datos) {
  if (!datos || typeof datos !== 'object') return false;
  for (let i = 1; i <= 10; i++) {
    if (!datos[i] || !Array.isArray(datos[i].invitados)) {
      return false;
    }
  }
  return true;
}

function cargarDatosConVerificacion() {
  // 1. Intentar leer almacenamiento principal
  try {
    const primario = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (esEstructuraValida(primario)) {
      return primario;
    }
  } catch (e) {
    console.warn('Fallo en almacenamiento primario, intentando espejo...', e);
  }

  // 2. Si el primario falló o se corrompió, recuperar desde espejo (_backup)
  try {
    const espejo = JSON.parse(localStorage.getItem(STORAGE_BACKUP_KEY));
    if (esEstructuraValida(espejo)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(espejo));
      return espejo;
    }
  } catch (e) {
    console.warn('Fallo en espejo secundario:', e);
  }

  // 3. Cargar valores por defecto y luego intentar restaurar desde IndexedDB
  return JSON.parse(JSON.stringify(MESAS_INICIALES));
}

function abrirBaseIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB no soportado'));
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function guardarEnIndexedDB(datos) {
  try {
    const db = await abrirBaseIndexedDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(datos, 'estado_actual');
  } catch (err) {
    console.warn('No se pudo sincronizar en IndexedDB:', err);
  }
}

async function sincronizarDesdeIndexedDBAlIniciar() {
  try {
    const db = await abrirBaseIndexedDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get('estado_actual');
    req.onsuccess = () => {
      const datosIdb = req.result;
      if (esEstructuraValida(datosIdb)) {
        // Si localStorage estaba vacío o recién reiniciado pero IndexedDB tenía asistencias guardadas, recupera IndexedDB
        const confirmadosLocal = contarConfirmadosTotales(estadoMesas);
        const confirmadosIdb = contarConfirmadosTotales(datosIdb);
        if (confirmadosIdb > confirmadosLocal) {
          estadoMesas = datosIdb;
          guardarDatosAPruebaDeFallos(false);
          renderizarTodo();
        }
      } else {
        guardarEnIndexedDB(estadoMesas);
      }
    };
  } catch (_) {}
}

function contarConfirmadosTotales(mapaMesas) {
  let total = 0;
  Object.values(mapaMesas).forEach((m) => {
    total += m.invitados.filter((i) => i.presente).length;
  });
  return total;
}

// Guardado atómico en las 3 capas + retroalimentación visual
function guardarDatosAPruebaDeFallos(mostrarNotificacion = true) {
  if (!esEstructuraValida(estadoMesas)) return;

  const serializado = JSON.stringify(estadoMesas);
  try {
    localStorage.setItem(STORAGE_KEY, serializado);
    localStorage.setItem(STORAGE_BACKUP_KEY, serializado);
    storageStatusBadge.textContent = '🛡️ Guardado Seguro';
  } catch (err) {
    console.error('Error en localStorage:', err);
    storageStatusBadge.textContent = '⚠️ Memoria IDB';
  }

  guardarEnIndexedDB(estadoMesas);

  if (mostrarNotificacion) {
    mostrarToast('🛡️ Asistencia confirmada y guardada');
  }
}

function mostrarToast(texto) {
  saveToast.textContent = texto;
  saveToast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    saveToast.classList.add('hidden');
  }, 2200);
}

// Solicitar al sistema operativo (iOS / Android) que nunca borre el almacenamiento offline
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((concedido) => {
    if (concedido) {
      storageStatusBadge.textContent = '🛡️ Memoria Protegida';
    }
  });
}

// Salvaguarda automática cuando el usuario bloquea el celular o minimiza Safari/Chrome
window.addEventListener('pagehide', () => guardarDatosAPruebaDeFallos(false));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    guardarDatosAPruebaDeFallos(false);
  }
});

/* ==========================================================================
   SISTEMA DE DOBLE CONFIRMACIÓN AL CONFIRMAR INVITADO O MESA
   ========================================================================== */

function obtenerHoraActual() {
  const ahora = new Date();
  return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function solicitarConfirmacionInvitado(numMesa, invitado) {
  const mesa = estadoMesas[numMesa];
  if (!mesa) return;

  const vaAConfirmar = !invitado.presente;

  if (vaAConfirmar) {
    confirmModalIcon.textContent = '✅';
    confirmModalTitle.textContent = 'Confirmar Invitado';
    confirmModalMessage.innerHTML = `¿Confirmas la llegada de <strong>${invitado.nombre}</strong> en la <strong>Mesa ${numMesa}</strong>?`;
    btnConfirmAccept.textContent = '✅ Sí, confirmar llegada';
    btnConfirmAccept.classList.remove('uncheck-mode');
  } else {
    confirmModalIcon.textContent = '⚠️';
    confirmModalTitle.textContent = 'Quitar Confirmación';
    confirmModalMessage.innerHTML = `<strong>${invitado.nombre}</strong> (Mesa ${numMesa}) ya está confirmado${invitado.hora ? ` (${invitado.hora})` : ''}.<br><br>¿Seguro que deseas desmarcar su asistencia?`;
    btnConfirmAccept.textContent = 'Sí, quitar palomita';
    btnConfirmAccept.classList.add('uncheck-mode');
  }

  accionConfirmacionPendiente = () => {
    invitado.presente = vaAConfirmar;
    invitado.hora = vaAConfirmar ? `Llegó ${obtenerHoraActual()}` : null;
    emitirConfirmacionSonora();
    guardarDatosAPruebaDeFallos(true);
    renderizarTodo();
  };

  confirmModal.classList.remove('hidden');
}

// Confirmar a todos los invitados de la mesa actual con diálogo de confirmación
btnConfirmAllTable.addEventListener('click', () => {
  const datosMesa = estadoMesas[mesaActual];
  const faltantes = datosMesa.invitados.filter((i) => !i.presente);

  if (faltantes.length === 0) {
    mostrarToast(`✅ Todos en la Mesa ${mesaActual} ya están confirmados`);
    return;
  }

  confirmModalIcon.textContent = '👥';
  confirmModalTitle.textContent = `Confirmar Mesa ${mesaActual}`;
  confirmModalMessage.innerHTML = `¿Confirmar la asistencia de los <strong>${faltantes.length} invitados restantes</strong> de la <strong>Mesa ${mesaActual}</strong>?`;
  btnConfirmAccept.textContent = `✅ Confirmar (${faltantes.length})`;
  btnConfirmAccept.classList.remove('uncheck-mode');

  accionConfirmacionPendiente = () => {
    const hora = obtenerHoraActual();
    datosMesa.invitados.forEach((inv) => {
      if (!inv.presente) {
        inv.presente = true;
        inv.hora = `Llegó ${hora}`;
      }
    });
    emitirConfirmacionSonora();
    guardarDatosAPruebaDeFallos(true);
    renderizarTodo();
  };

  confirmModal.classList.remove('hidden');
});

btnConfirmCancel.addEventListener('click', () => {
  accionConfirmacionPendiente = null;
  confirmModal.classList.add('hidden');
});

btnConfirmAccept.addEventListener('click', () => {
  if (typeof accionConfirmacionPendiente === 'function') {
    accionConfirmacionPendiente();
  }
  accionConfirmacionPendiente = null;
  confirmModal.classList.add('hidden');
});

confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) {
    accionConfirmacionPendiente = null;
    confirmModal.classList.add('hidden');
  }
});

/* ==========================================================================
   LECTURA Y MAPEO DE CÓDIGOS QR (qr/1.png a qr/10.png)
   ========================================================================== */

function cargarMapaQr() {
  try {
    const guardado = localStorage.getItem(QR_MAP_KEY);
    if (guardado) return JSON.parse(guardado);
  } catch (_) {}
  return {};
}

function guardarMapaQr() {
  try {
    localStorage.setItem(QR_MAP_KEY, JSON.stringify(mapaQrMesas));
  } catch (_) {}
}

function configurarImagenQr(imgElement, numMesa) {
  const rutasAlternativas = [`qr/${numMesa}.png`, `${numMesa}.png`, `resultado/${numMesa}.png`];
  let intento = 0;

  imgElement.onerror = function () {
    intento++;
    if (intento < rutasAlternativas.length) {
      imgElement.src = rutasAlternativas[intento];
    }
  };
  imgElement.src = rutasAlternativas[0];
}

async function indexarImagenesQrLocales() {
  if (typeof jsQR === 'undefined') return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  for (let num = 1; num <= 10; num++) {
    const rutas = [`qr/${num}.png`, `${num}.png`];
    for (const ruta of rutas) {
      try {
        const textoDecodificado = await decodificarImagenUrl(ruta, canvas, ctx);
        if (textoDecodificado) {
          mapaQrMesas[textoDecodificado.trim()] = num;
          break;
        }
      } catch (_) {}
    }
  }
  guardarMapaQr();
}

function decodificarImagenUrl(url, canvas, ctx) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      resolve(code ? code.data : null);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function resolverMesaDesdeTextoQr(textoRaw) {
  if (!textoRaw) return null;
  const limpio = textoRaw.trim();

  if (mapaQrMesas[limpio]) {
    return Number(mapaQrMesas[limpio]);
  }

  if (/^(10|[1-9])$/.test(limpio)) {
    return Number(limpio);
  }

  const matchEspecifico = limpio.match(/(?:mesa|resultado|qr|table|id|m)[\s\/=:_#-]*0*(10|[1-9])(?:\.png|\b|$)/i);
  if (matchEspecifico) {
    return Number(matchEspecifico[1]);
  }

  const matchNumero = limpio.match(/(?:^|\D)0*(10|[1-9])(?:\D|$)/);
  if (matchNumero) {
    return Number(matchNumero[1]);
  }

  return null;
}

function emitirConfirmacionSonora() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}

  if (navigator.vibrate) {
    navigator.vibrate(120);
  }
}

function procesarQrDetectado(textoQr) {
  let numMesa = resolverMesaDesdeTextoQr(textoQr);

  if (!numMesa) {
    const respuesta = prompt(
      `Código QR detectado: "${textoQr}"\n\n¿A qué número de mesa (1 al 10) pertenece este QR?`,
      '1'
    );
    const numUsuario = Number(respuesta);
    if (numUsuario >= 1 && numUsuario <= 10) {
      mapaQrMesas[textoQr.trim()] = numUsuario;
      guardarMapaQr();
      numMesa = numUsuario;
    } else {
      return;
    }
  }

  emitirConfirmacionSonora();
  detenerCamara();
  abrirMesa(numMesa, true);
}

function abrirMesa(numMesa, desdeQr = false) {
  if (!estadoMesas[numMesa]) return;
  mesaActual = Number(numMesa);

  scannerView.classList.add('hidden');
  resultView.classList.remove('hidden');

  scanPill.textContent = desdeQr ? `✅ QR Mesa ${mesaActual}` : `📍 Mesa ${mesaActual}`;
  renderizarTodo();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function volverAlEscaner() {
  resultView.classList.add('hidden');
  scannerView.classList.remove('hidden');
  iniciarCamara();
}

async function iniciarCamara() {
  if (escaneando) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraStatusText.textContent = 'Usa el botón "Escanear con Cámara Nativa / Foto" abajo.';
    return;
  }

  try {
    cameraStatusText.textContent = 'Abriendo cámara...';
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });

    qrVideo.srcObject = videoStream;
    qrVideo.setAttribute('playsinline', 'true');
    await qrVideo.play();

    escaneando = true;
    cameraPlaceholder.classList.add('hidden');
    btnToggleCamera.textContent = '⏹️ Detener Cámara';

    escanearCuadroVideo();
  } catch (err) {
    console.warn('Cámara directa no disponible:', err);
    cameraStatusText.textContent = 'Sin permiso de cámara en vivo. Usa "Escanear con Cámara Nativa / Foto" abajo.';
  }
}

function detenerCamara() {
  escaneando = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
    videoStream = null;
  }
  qrVideo.srcObject = null;
  cameraPlaceholder.classList.remove('hidden');
  cameraStatusText.textContent = 'Presiona "Iniciar Cámara" para escanear el código QR';
  btnToggleCamera.textContent = '📷 Iniciar Cámara QR';
}

function escanearCuadroVideo() {
  if (!escaneando) return;

  if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
    const ctx = qrCanvas.getContext('2d', { willReadFrequently: true });
    qrCanvas.width = qrVideo.videoWidth;
    qrCanvas.height = qrVideo.videoHeight;
    ctx.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);

    if (typeof jsQR !== 'undefined') {
      const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        procesarQrDetectado(code.data);
        return;
      }
    }
  }

  animFrameId = requestAnimationFrame(escanearCuadroVideo);
}

qrFileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const ctx = qrCanvas.getContext('2d', { willReadFrequently: true });
      qrCanvas.width = img.width;
      qrCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (typeof jsQR !== 'undefined') {
        const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          procesarQrDetectado(code.data);
        } else {
          alert('No se detectó un código QR válido en la foto. Intenta acercar más la cámara.');
        }
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  qrFileInput.value = '';
});

btnToggleCamera.addEventListener('click', () => {
  if (escaneando) {
    detenerCamara();
  } else {
    iniciarCamara();
  }
});

btnBackToScan.addEventListener('click', volverAlEscaner);

/* ==========================================================================
   RENDERIZADO DE MESAS E INVITADOS
   ========================================================================== */

function renderizarPestanas() {
  tableTabs.innerHTML = '';
  Object.keys(estadoMesas).forEach((num) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.textContent = `Mesa ${num}`;
    btn.addEventListener('click', () => {
      detenerCamara();
      abrirMesa(Number(num), false);
    });
    tableTabs.appendChild(btn);
  });
}

function renderizarMesaActual() {
  const datosMesa = estadoMesas[mesaActual];
  tableTitle.textContent = `Mesa ${datosMesa.numero}`;

  const presentes = datosMesa.invitados.filter((i) => i.presente).length;
  const total = datosMesa.invitados.length;
  tableCounter.textContent = `${presentes} de ${total} confirmados`;

  configurarImagenQr(tableQrImg, mesaActual);

  guestList.innerHTML = '';
  datosMesa.invitados.forEach((invitado) => {
    const li = document.createElement('li');
    li.className = `guest-item ${invitado.presente ? 'checked' : ''}`;

    const leftDiv = document.createElement('div');
    leftDiv.className = 'guest-left';

    const checkIcon = document.createElement('div');
    checkIcon.className = 'check-icon';
    checkIcon.innerHTML = `
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'guest-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'guest-name';
    nameSpan.textContent = invitado.nombre;
    infoDiv.appendChild(nameSpan);

    if (invitado.presente && invitado.hora) {
      const timeSpan = document.createElement('span');
      timeSpan.className = 'guest-time';
      timeSpan.textContent = `✓ ${invitado.hora}`;
      infoDiv.appendChild(timeSpan);
    }

    leftDiv.appendChild(checkIcon);
    leftDiv.appendChild(infoDiv);
    li.appendChild(leftDiv);

    // Al tocar el invitado pide confirmación antes de marcar o desmarcar
    leftDiv.addEventListener('click', () => {
      solicitarConfirmacionInvitado(mesaActual, invitado);
    });

    if (modoEdicion) {
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'btn-delete-guest';
      btnDel.textContent = '✕';
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Eliminar a "${invitado.nombre}" de la Mesa ${mesaActual}?`)) {
          datosMesa.invitados = datosMesa.invitados.filter((item) => item.id !== invitado.id);
          guardarDatosAPruebaDeFallos(true);
          renderizarTodo();
        }
      });
      li.appendChild(btnDel);
    }

    guestList.appendChild(li);
  });
}

function renderizarEstadisticasGlobales() {
  let totalInvitados = 0;
  let totalPresentes = 0;

  Object.values(estadoMesas).forEach((mesa) => {
    totalInvitados += mesa.invitados.length;
    totalPresentes += mesa.invitados.filter((i) => i.presente).length;
  });

  globalStats.textContent = `${totalPresentes} / ${totalInvitados} invitados confirmados`;
}

function renderizarTodo() {
  renderizarPestanas();
  renderizarMesaActual();
  renderizarEstadisticasGlobales();
}

btnToggleAdd.addEventListener('click', () => {
  modoEdicion = !modoEdicion;
  addGuestForm.classList.toggle('hidden', !modoEdicion);
  btnToggleAdd.textContent = modoEdicion ? 'Listo' : '+ Editar';
  if (modoEdicion) {
    newGuestName.focus();
  }
  renderizarMesaActual();
});

addGuestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = newGuestName.value.trim();
  if (!nombre) return;

  estadoMesas[mesaActual].invitados.push({
    id: `m${mesaActual}-${Date.now()}`,
    nombre,
    presente: false,
    hora: null
  });

  newGuestName.value = '';
  guardarDatosAPruebaDeFallos(true);
  renderizarTodo();
});

// Buscador de invitados: abre su mesa y permite confirmar directamente al invitado buscado
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.classList.add('hidden');
    return;
  }

  const coincidencias = [];
  Object.values(estadoMesas).forEach((mesa) => {
    if (`mesa ${mesa.numero}`.includes(query) || String(mesa.numero) === query) {
      coincidencias.push({
        mesa: mesa.numero,
        invitado: null,
        texto: `Ir a Mesa ${mesa.numero}`,
        estado: `${mesa.invitados.filter((i) => i.presente).length}/${mesa.invitados.length}`
      });
    }

    mesa.invitados.forEach((inv) => {
      if (inv.nombre.toLowerCase().includes(query)) {
        coincidencias.push({
          mesa: mesa.numero,
          invitado: inv,
          texto: `${inv.presente ? '✅' : '⭕'} ${inv.nombre}`,
          estado: `Mesa ${mesa.numero}`
        });
      }
    });
  });

  searchResults.innerHTML = '';
  if (coincidencias.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item">Sin resultados</div>';
  } else {
    coincidencias.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'search-result-item';
      row.innerHTML = `
        <span>${item.texto}</span>
        <span class="search-result-badge">${item.estado}</span>
      `;
      row.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.classList.add('hidden');
        detenerCamara();
        abrirMesa(item.mesa, false);
        // Si tocó a un invitado en el buscador, abre también la ventana para confirmar su llegada
        if (item.invitado) {
          solicitarConfirmacionInvitado(item.mesa, item.invitado);
        }
      });
      searchResults.appendChild(row);
    });
  }

  searchResults.classList.remove('hidden');
});

/* ==========================================================================
   EXPORTAR E IMPORTAR RESPALDO MANUAL (A PRUEBA DE CAMBIO DE DISPOSITIVO)
   ========================================================================== */

btnExportBackup.addEventListener('click', () => {
  const dataStr = JSON.stringify(estadoMesas, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `respaldo-mesas-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('💾 Archivo de respaldo descargado');
});

importBackupInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importado = JSON.parse(reader.result);
      if (esEstructuraValida(importado)) {
        estadoMesas = importado;
        guardarDatosAPruebaDeFallos(true);
        renderizarTodo();
        mostrarToast('✅ Respaldo restaurado con éxito');
      } else {
        alert('El archivo seleccionado no tiene un formato válido de mesas.');
      }
    } catch (_) {
      alert('No se pudo leer el archivo de respaldo.');
    }
  };
  reader.readAsText(file);
  importBackupInput.value = '';
});

qrContainer.addEventListener('click', () => {
  modalTableTitle.textContent = `Mesa ${mesaActual}`;
  configurarImagenQr(modalQrImg, mesaActual);
  qrModal.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', () => {
  qrModal.classList.add('hidden');
});

qrModal.addEventListener('click', (e) => {
  if (e.target === qrModal) {
    qrModal.classList.add('hidden');
  }
});

function verificarParametroUrl() {
  const params = new URLSearchParams(window.location.search);
  const mesaParam = params.get('mesa') || window.location.hash.replace(/\D/g, '');
  const num = Number(mesaParam);
  if (num >= 1 && num <= 10) {
    abrirMesa(num, true);
  }
}

// Registro del Service Worker para funcionamiento 100% offline en iOS y Android
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('Service Worker:', err);
    });
  });
}

// Inicialización completa
renderizarTodo();
sincronizarDesdeIndexedDBAlIniciar();
indexarImagenesQrLocales();
verificarParametroUrl();