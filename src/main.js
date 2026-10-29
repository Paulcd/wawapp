import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { loadOSM, loadFallback } from './osm.js';
import { Scene3D } from './scene.js';
import { playVictorySound, playGentleSound, playPopSound } from './sound.js';
import { ConfettiCannon } from './confetti.js';
import { getQuestionForPoi } from './questions.js';
import { AppState } from './state.js';

const $ = s => document.querySelector(s);

// Mapeo de íconos para inicio, fin y POIs
const START_ICONS = {
  colegio: { icon: '🏫', label: 'Colegio' },
  casa: { icon: '🏠', label: 'Casa' },
  mochila: { icon: '🎒', label: 'Escuela' },
  bandera: { icon: '🚩', label: 'Partida' }
};

const END_ICONS = {
  casa: { icon: '🏠', label: 'Casita' },
  abuela: { icon: '👵', label: 'Casa Abuelita' },
  colegio: { icon: '🏫', label: 'Colegio' },
  meta: { icon: '🏁', label: 'Llegada' }
};

const TY = {
  bodega: ['🛒', 'Bodega'],
  farmacia: ['💊', 'Farmacia'],
  parque: ['🌳', 'Parque'],
  cruce: ['🚦', 'Cruce con semáforo'],
  seguro: ['🛡️', 'Lugar seguro']
};

// Instancias de servicios
const appState = new AppState();
const confetti = new ConfettiCannon();
let sc = null;
let currentTool = 'camino'; // 'inicio' | 'camino' | 'fin' | 'bodega' | 'farmacia' | ...
let currentStars = 0;
let totalPossibleStars = 0;
let isChildMode = appState.isChildMode();

// Inicialización de mapa Leaflet
const initialPos = appState.data.route[0] || [-11.9880, -77.0090];
const map = L.map('map', { zoomControl: true }).setView(initialPos, 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const routeLayer = L.layerGroup().addTo(map);
const poiLayer = L.layerGroup().addTo(map);
const polyline = L.polyline([], {
  color: '#0284c7',
  weight: 7,
  opacity: 0.9,
  lineJoin: 'round',
  dashArray: '10, 10'
}).addTo(map);

// Actualiza los campos del panel de mamá
function syncInputsFromState() {
  $('#input-child-name').value = appState.data.childName || '';
  $('#input-route-title').value = appState.data.routeTitle || '';
  $('#input-mom-phone').value = appState.data.phone || '';
  $('#select-start-icon').value = appState.data.startIcon || 'colegio';
  $('#select-end-icon').value = appState.data.endIcon || 'casa';
}

// Aplica el modo visual (Mamá vs Niño)
function applyModeView() {
  const childName = appState.data.childName || 'Explorador';
  const routeTitle = appState.data.routeTitle || 'Camino Seguro';

  if (isChildMode) {
    // Vista Niño
    $('#mode-badge').textContent = `🎒 ${childName}`;
    $('#mode-badge').style.background = '#fef08a';
    $('#mode-badge').style.color = '#854d0e';
    $('#mom-bar').style.display = 'none';
    $('#tools-container').style.display = 'none';
    $('#child-banner').style.display = 'flex';
    $('#btn-share-modal').style.display = 'none';
    $('#btn-toggle-child').textContent = '👩‍👦 Modo Mamá / Editar';
    $('#child-welcome-msg').textContent = `🎒 ¡Hola, ${childName}! ⭐`;
    $('#child-sub-msg').textContent = `Mamá te preparó: "${routeTitle}"`;
  } else {
    // Vista Mamá
    $('#mode-badge').textContent = 'Modo Mamá';
    $('#mode-badge').style.background = '#e0f2fe';
    $('#mode-badge').style.color = '#0369a1';
    $('#mom-bar').style.display = 'flex';
    $('#tools-container').style.display = 'flex';
    $('#child-banner').style.display = 'none';
    $('#btn-share-modal').style.display = 'inline-flex';
    $('#btn-toggle-child').textContent = '🎮 Modo Niño';
  }
}

// Renderizado gráfico del circuito en el mapa con Ícono de Inicio, Camino y Fin
function redrawMap() {
  routeLayer.clearLayers();
  poiLayer.clearLayers();

  const route = appState.data.route;
  const pois = appState.data.pois;
  polyline.setLatLngs(route);

  if (route.length === 0) return;

  const startIconData = START_ICONS[appState.data.startIcon] || START_ICONS.colegio;
  const endIconData = END_ICONS[appState.data.endIcon] || END_ICONS.casa;

  // 1. Ícono de INICIO (punto 0)
  const startPt = route[0];
  const startIconHtml = `
    <div class="map-badge map-badge-start">
      <div class="map-badge-bubble">${startIconData.icon}</div>
      <div class="map-badge-label" style="background:#16a34a;">📍 INICIO: ${startIconData.label}</div>
    </div>
  `;
  L.marker(startPt, {
    icon: L.divIcon({ html: startIconHtml, className: 'custom-pin', iconSize: [40, 50], iconAnchor: [20, 48] })
  }).bindTooltip(`<b>Inicio:</b> ${startIconData.label}`).addTo(routeLayer);

  // 2. Íconos de CAMINO (puntos intermedios)
  for (let i = 1; i < route.length - 1; i++) {
    const pt = route[i];
    const pathHtml = `
      <div style="background:#0284c7; color:#fff; font-size:11px; font-weight:800; width:22px; height:22px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
        ${i}
      </div>
    `;
    L.marker(pt, {
      icon: L.divIcon({ html: pathHtml, className: 'custom-pin', iconSize: [22, 22], iconAnchor: [11, 11] })
    }).bindTooltip(`Camino paso ${i}`).addTo(routeLayer);
  }

  // 3. Ícono de FIN / META (último punto, si hay más de 1 punto)
  if (route.length > 1) {
    const endPt = route[route.length - 1];
    const endIconHtml = `
      <div class="map-badge map-badge-end">
        <div class="map-badge-bubble">${endIconData.icon}</div>
        <div class="map-badge-label" style="background:#d97706;">🏁 LLEGADA: ${endIconData.label}</div>
      </div>
    `;
    L.marker(endPt, {
      icon: L.divIcon({ html: endIconHtml, className: 'custom-pin', iconSize: [40, 50], iconAnchor: [20, 48] })
    }).bindTooltip(`<b>Llegada:</b> ${endIconData.label}`).addTo(routeLayer);
  }

  // 4. Marcadores de POIs (Bodega, Farmacia, Parque, Cruce, Lugar Seguro)
  pois.forEach(p => {
    const poiDef = TY[p.t] || ['⭐', 'Punto de interés'];
    const poiHtml = `
      <div class="map-badge">
        <div class="map-badge-bubble" style="border-color:#8b5cf6;">${poiDef[0]}</div>
        <div class="map-badge-label" style="background:#475569;">${p.n || poiDef[1]}</div>
      </div>
    `;
    L.marker([p.lat, p.lng], {
      icon: L.divIcon({ html: poiHtml, className: 'custom-pin', iconSize: [36, 44], iconAnchor: [18, 42] })
    }).bindTooltip(`<b>${poiDef[1]}</b>: ${p.n}`).addTo(poiLayer);
  });
}

// Clics en el mapa para edición del circuito
map.on('click', e => {
  if (isChildMode) return; // En modo niño el mapa es interactivo solo para explorar
  playPopSound();

  const latlng = [e.latlng.lat, e.latlng.lng];
  const route = appState.data.route;
  const pois = appState.data.pois;

  if (currentTool === 'inicio') {
    // Establecer o reubicar punto de inicio
    if (route.length === 0) {
      route.push(latlng);
    } else {
      route[0] = latlng;
    }
    updateHint('¡Inicio fijado! Ahora selecciona "👣 Camino" para agregar los pasos.');
  } else if (currentTool === 'camino') {
    // Agregar puntos al camino
    route.push(latlng);
    updateHint(`Paso #${route.length} agregado. Continúa o selecciona "🏁 Llegada".`);
  } else if (currentTool === 'fin') {
    // Establecer o agregar punto de fin
    if (route.length === 0) {
      route.push(latlng);
    } else if (route.length === 1) {
      route.push(latlng);
    } else {
      route[route.length - 1] = latlng;
    }
    updateHint('¡Meta fijada! Agrega lugares seguros o genera el recorrido.');
  } else if (TY[currentTool]) {
    // Agregar POI
    pois.push({
      t: currentTool,
      lat: latlng[0],
      lng: latlng[1],
      n: TY[currentTool][1]
    });
    updateHint(`¡${TY[currentTool][1]} agregado al mapa!`);
  }

  appState.save();
  redrawMap();
});

function updateHint(text) {
  const hint = $('#status-hint');
  if (hint) hint.innerHTML = `💡 ${text}`;
}

// Manejo de botones de herramientas
function initTools() {
  const toolButtons = document.querySelectorAll('#tools button[data-tool]');
  toolButtons.forEach(btn => {
    btn.onclick = () => {
      playPopSound();
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.dataset.tool;

      if (currentTool === 'inicio') {
        updateHint('Toca el mapa donde comenzará el niño (ej. puerta del colegio).');
      } else if (currentTool === 'camino') {
        updateHint('Toca en cada esquina o tramo por donde debe caminar.');
      } else if (currentTool === 'fin') {
        updateHint('Toca el mapa donde terminará el recorrido (ej. casita).');
      } else if (TY[currentTool]) {
        updateHint(`Toca el mapa para ubicar un(a) ${TY[currentTool][1]}.`);
      }
    };
  });

  // Activar 'camino' por defecto
  const defaultToolBtn = $(`#btn-tool-${currentTool}`) || toolButtons[0];
  if (defaultToolBtn) defaultToolBtn.classList.add('active');

  // Selectores de íconos
  $('#select-start-icon').onchange = e => {
    appState.data.startIcon = e.target.value;
    appState.save();
    redrawMap();
  };

  $('#select-end-icon').onchange = e => {
    appState.data.endIcon = e.target.value;
    appState.save();
    redrawMap();
  };

  // Botón Deshacer
  $('#btn-undo').onclick = () => {
    playPopSound();
    if (appState.data.route.length > 0) {
      appState.data.route.pop();
    } else if (appState.data.pois.length > 0) {
      appState.data.pois.pop();
    }
    appState.save();
    redrawMap();
    updateHint('Último punto eliminado.');
  };

  // Botón Limpiar
  $('#btn-clear').onclick = () => {
    if (confirm('¿Deseas reiniciar y limpiar todo el circuito?')) {
      playPopSound();
      appState.data.route = [];
      appState.data.pois = [];
      appState.save();
      redrawMap();
      updateHint('Mapa limpio. Toca "🚩 Inicio" para comenzar.');
    }
  };

  // Botón Guardar cambios de texto
  $('#btn-quick-save').onclick = () => {
    playPopSound();
    saveInputsToState();
    appState.save();
    updateHint('¡Datos guardados con éxito!');
  };
}

function saveInputsToState() {
  appState.data.childName = $('#input-child-name').value.trim() || 'Thiago';
  appState.data.routeTitle = $('#input-route-title').value.trim() || 'Camino Seguro';
  appState.data.phone = $('#input-mom-phone').value.trim().replace(/\D/g, '') || '51999888777';
}

// Modal de preguntas con festejo (cotillón), sonido y feedback pedagógico
function askSafetyQuestion(category = 'cruce') {
  return new Promise(resolve => {
    const childName = appState.data.childName || 'Explorador';
    const qData = getQuestionForPoi(category, childName, Math.floor(Math.random() * 5));

    $('#q-badge').textContent = qData.badge;
    $('#qt').textContent = qData.question;
    const qo = $('#qo');
    const qf = $('#qf');
    const qn = $('#qn');

    qo.innerHTML = '';
    qf.className = 'feedback-box';
    qf.innerHTML = '';
    qn.style.display = 'none';

    qData.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'q-opt';
      btn.innerHTML = `<span>${['A', 'B', 'C'][idx]}</span> <span>${optText}</span>`;

      btn.onclick = () => {
        // Deshabilitar opciones
        qo.querySelectorAll('.q-opt').forEach((b, j) => {
          b.disabled = true;
          if (j === qData.answer) {
            b.classList.add('ok');
          }
        });

        const isCorrect = (idx === qData.answer);

        if (isCorrect) {
          // FESTEJO CON COTILLÓN Y MÚSICA ALEGRE
          playVictorySound();
          confetti.burst(window.innerWidth / 2, window.innerHeight * 0.5, 95);
          if (sc) sc.celebrate();

          currentStars++;
          $('#hud-star-count').textContent = currentStars;

          qf.className = 'feedback-box feedback-ok';
          qf.innerHTML = `
            <div style="font-size:16px; font-weight:800; margin-bottom:4px;">🎉 ¡SÚPER BIEN, ${childName.toUpperCase()}! ⭐ +1 Estrella</div>
            <div>${qData.celebration}</div>
          `;
        } else {
          // RESPUESTA SUTIL Y EDUCATIVA PARA AYUDAR A ENTENDER
          playGentleSound();
          btn.classList.add('no');

          qf.className = 'feedback-box feedback-hint';
          qf.innerHTML = `
            <div style="font-size:15px; font-weight:800; margin-bottom:4px;">💡 ¡Buen intento! Aprendamos juntos:</div>
            <div>${qData.explanation}</div>
            <div style="margin-top:4px; font-size:13px; color:#b45309;">(La opción más segura está marcada en verde arriba ⬆️)</div>
          `;
        }

        qn.style.display = 'block';
        qn.onclick = () => {
          playPopSound();
          $('#mq').classList.remove('on');
          resolve(isCorrect);
        };
      };

      qo.appendChild(btn);
    });

    $('#mq').classList.add('on');
  });
}

// Iniciar recorrido 3D vistoso
async function start3DExperience() {
  saveInputsToState();
  appState.save();

  const route = appState.data.route;
  const pois = appState.data.pois;

  if (route.length < 2) {
    alert('Por favor traza al menos el Inicio y la Llegada en el mapa.');
    return;
  }

  $('#hud-mission').textContent = appState.data.routeTitle || 'Camino Seguro';
  currentStars = 0;
  totalPossibleStars = pois.length + 1;
  $('#hud-star-count').textContent = '0';

  // Ocultar mapa y mostrar 3D
  $('#map-view').style.display = 'none';
  $('#tools-container').style.display = 'none';
  $('#mom-bar').style.display = 'none';
  $('#child-banner').style.display = 'none';
  $('#v3').style.display = 'block';

  // Cargar edificios OSM o fallback local
  const ys = route.map(p => p[0]).concat(pois.map(p => p.lat));
  const xs = route.map(p => p[1]).concat(pois.map(p => p.lng));
  const pad = 0.0012;
  const bbox = [Math.min(...ys) - pad, Math.min(...xs) - pad, Math.max(...ys) + pad, Math.max(...xs) + pad];

  let osmData;
  try {
    osmData = await loadOSM(bbox);
  } catch (e) {
    try {
      osmData = await loadFallback();
    } catch {
      osmData = { elements: [] };
    }
  }

  // Inicializar o reconstruir la escena 3D con el personaje Chibi vistoso
  sc = sc || new Scene3D($('#c3'));
  sc.stop?.();
  sc.build(osmData, route, pois, { childName: appState.data.childName });
  sc.resize();

  // El personaje se muestra de inmediato en pantalla. El niño visualiza al personaje avanzando.
  sc.start(
    // Al alcanzar un POI
    async poi => {
      await askSafetyQuestion(poi.t);
    },
    // Al llegar a la meta
    async () => {
      // Pregunta final de llegada a casa
      await askSafetyQuestion('fin');

      // Pantalla de Gran Victoria con Cotillón!
      playVictorySound();
      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 120);

      $('#victory-child-msg').textContent = `¡Felicidades, ${appState.data.childName}! Has completado: "${appState.data.routeTitle}".`;
      $('#victory-score').textContent = `⭐ ${currentStars}/${totalPossibleStars} Estrellas Obtenidas`;
      $('#modal-victory').classList.add('on');
    }
  );
}

// Botón volver del 3D al mapa
function exit3D() {
  sc?.stop();
  $('#v3').style.display = 'none';
  $('#map-view').style.display = 'block';
  applyModeView();
  map.invalidateSize();
}

$('#btn-v3-back').onclick = exit3D;
$('#btn-victory-again').onclick = () => {
  $('#modal-victory').classList.remove('on');
  exit3D();
};

// Generador de Enlace para el Niño
function setupShareModal() {
  $('#btn-share-modal').onclick = () => {
    playPopSound();
    saveInputsToState();
    appState.save();

    const link = appState.generateChildLink();
    $('#share-link-display').textContent = link;
    $('#modal-share').classList.add('on');
  };

  $('#btn-close-share').onclick = () => {
    $('#modal-share').classList.remove('on');
  };

  $('#btn-copy-link').onclick = async () => {
    playPopSound();
    const link = $('#share-link-display').textContent;
    try {
      await navigator.clipboard.writeText(link);
      $('#btn-copy-link').textContent = '✅ ¡Copiado al portapapeles!';
      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.5, 40);
      setTimeout(() => {
        $('#btn-copy-link').textContent = '📋 Copiar Enlace';
      }, 2500);
    } catch {
      alert('Enlace copiado manualmente desde la caja de texto.');
    }
  };

  $('#btn-whatsapp-share').onclick = () => {
    playPopSound();
    const childName = appState.data.childName || 'mi pequeño';
    const link = $('#share-link-display').textContent;
    const msg = `¡Hola ${childName}! Te preparé tu mapa interactivo de camino seguro en Wawapp: ${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  $('#btn-test-as-child').onclick = () => {
    playPopSound();
    $('#modal-share').classList.remove('on');
    isChildMode = true;
    applyModeView();
  };
}

// Alternar entre modo Mamá y modo Niño
$('#btn-toggle-child').onclick = () => {
  playPopSound();
  isChildMode = !isChildMode;
  applyModeView();
  redrawMap();
};

// Botón SOS "Me perdí"
function setupSOS() {
  const hav = (a, b, c, d) => {
    const r = Math.PI / 180;
    const x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2;
    return 12742000 * Math.asin(Math.sqrt(x));
  };

  $('#sos').onclick = () => {
    playPopSound();
    const pois = appState.data.pois;
    const currentLoc = appState.data.route[0] || [-11.9880, -77.0090];

    const showSOSDialog = (lat, lng, isGps) => {
      const safePoints = pois
        .filter(p => ['seguro', 'farmacia', 'bodega'].includes(p.t))
        .map(p => ({ p, d: hav(lat, lng, p.lat, p.lng) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);

      $('#sl').innerHTML = safePoints.length > 0
        ? safePoints.map(({ p, d }) => `
            <div style="padding:6px 0; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:8px;">
              <span style="font-size:22px;">${TY[p.t][0]}</span>
              <div>
                <b>${p.n}</b><br>
                <span style="font-size:12px; color:#64748b;">Aproximadamente a ${Math.round(d / 10) * 10} metros</span>
              </div>
            </div>
          `).join('')
        : '<p style="color:#64748b;">No hay puntos seguros cercanos marcados en este circuito.</p>';

      $('#sw').onclick = () => {
        playPopSound();
        const phone = appState.data.phone || '51999888777';
        const childName = appState.data.childName || 'tu hijo/a';
        const msg = `Mamá, soy ${childName}. Me desorienté o nadie me recogió. ${safePoints[0] ? 'Me dirijo hacia ' + safePoints[0].p.n + '. ' : ''}${isGps ? 'Mi ubicación en tiempo real: https://maps.google.com/?q=' + lat + ',' + lng : ''}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      };

      $('#ml').classList.add('on');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => showSOSDialog(p.coords.latitude, p.coords.longitude, true),
        () => showSOSDialog(currentLoc[0], currentLoc[1], false),
        { timeout: 3500 }
      );
    } else {
      showSOSDialog(currentLoc[0], currentLoc[1], false);
    }
  };

  $('#lc').onclick = () => {
    $('#ml').classList.remove('on');
  };
}

// Inicialización general
function init() {
  syncInputsFromState();
  initTools();
  setupShareModal();
  setupSOS();
  applyModeView();
  redrawMap();

  $('#gen').onclick = () => {
    playPopSound();
    start3DExperience();
  };

  $('#btn-child-start-3d').onclick = () => {
    playPopSound();
    start3DExperience();
  };

  window.addEventListener('resize', () => {
    sc?.resize();
    map.invalidateSize();
  });
}

init();
