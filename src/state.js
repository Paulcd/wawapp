// Gestor de estado y enlaces compartidos para Wawapp (Modo Mamá y Modo Niño)

export const DEFAULT_STATE = {
  childName: 'Thiago',
  routeTitle: 'Camino seguro al cole y a casa',
  phone: '51999888777',
  startIcon: 'colegio', // 'colegio' | 'casa' | 'parque' | 'bandera'
  endIcon: 'casa',       // 'casa' | 'colegio' | 'abuela' | 'meta'
  route: [
    [-11.9880, -77.0090],
    [-11.9892, -77.0082],
    [-11.9906, -77.0072],
    [-11.9920, -77.0060]
  ],
  pois: [
    { t: 'bodega', lat: -11.9886, lng: -77.0086, n: 'Bodega Don Pepe' },
    { t: 'cruce', lat: -11.9899, lng: -77.0077, n: 'Cruce Av. Próceres' },
    { t: 'seguro', lat: -11.9912, lng: -77.0066, n: 'Punto Seguro Vecinal' }
  ]
};

const STORAGE_KEY = 'wawapp_data_v2';

export class AppState {
  constructor() {
    this.data = this.loadInitial();
  }

  loadInitial() {
    // 1. Intentar cargar desde URL (link compartido para el niño)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      // Buscar datos en el hash: #child:BASE64 o #data=BASE64
      let rawBase64 = '';
      if (hash.includes('data=')) {
        rawBase64 = hash.split('data=')[1].split('&')[0];
      } else if (hash.startsWith('#child:')) {
        rawBase64 = hash.replace('#child:', '');
      }

      if (rawBase64) {
        const jsonStr = decodeURIComponent(escape(atob(rawBase64)));
        const parsed = JSON.parse(jsonStr);
        if (parsed && Array.isArray(parsed.route) && parsed.route.length > 0) {
          return { ...DEFAULT_STATE, ...parsed };
        }
      }
    } catch (e) {
      console.warn('No se pudo decodificar datos desde URL:', e);
    }

    // 2. Intentar cargar desde localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.route)) {
          return { ...DEFAULT_STATE, ...parsed };
        }
      }
    } catch (e) {}

    // 3. Fallback a estado por defecto
    return { ...DEFAULT_STATE };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Error al guardar estado:', e);
    }
  }

  // Genera el enlace directo para que el niño ingrese con el mapa listo
  generateChildLink() {
    try {
      const payload = {
        childName: this.data.childName,
        routeTitle: this.data.routeTitle,
        phone: this.data.phone,
        startIcon: this.data.startIcon,
        endIcon: this.data.endIcon,
        route: this.data.route,
        pois: this.data.pois
      };
      const jsonStr = JSON.stringify(payload);
      const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
      
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}?mode=child#data=${base64}`;
    } catch (e) {
      console.error('Error generando link:', e);
      return window.location.href;
    }
  }

  isChildMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') === 'child' || window.location.hash.includes('child');
  }
}
