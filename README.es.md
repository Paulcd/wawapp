# 🎒 Wawapp — Tecnología de Impacto para la Seguridad y Autonomía Infantil

> **Wawapp** es una plataforma de impacto social y tecnología cívica que transforma la ruta diaria de un niño (colegio ↔ casa) en una experiencia lúdica interactiva en 3D basada en el entorno urbano real de **OpenStreetMap**. No es un rastreador pasivo: es una herramienta de **alfabetización espacial, resiliencia y autocuidado** que entrena a los niños para saber **qué hacer cuando el plan cambia**.

[English](README.md) | [Español](README.es.md)

---

## 👨‍💻 Creador & Dirección de Proyecto

* **Creador & Investigador Principal:** **Paul Damian Sarro**
* **Rol:** **Fundador & Director de I+D e Innovación de Alto Impacto** *(Chief Innovation Officer & Lead Impact Creator)*
* **Organización:** **Devs Generation**
* **Contacto:** [hola@devsgeneration.com](mailto:hola@devsgeneration.com)
* **Teléfono / WhatsApp:** [+51 959642919](https://wa.me/51959642919)

---

## 💡 El "Por Qué": Origen y Propósito Social

### 1. La Realidad Social en América Latina
En el Perú y en gran parte de Latinoamérica, millones de madres solteras y familias trabajadoras enfrentan una encrucijada cotidiana: sostener el hogar económicamente y, al mismo tiempo, estar presentes físicamente en cada horario de salida escolar.

El proyecto nace de un caso real en **San Juan de Lurigancho (Lima)**: un niño de 7 años esperó a su mamá en la puerta de la escuela durante más de una hora debido a una confusión en el horario laboral. El niño no sabía si caminar solo, si quedarse o con quién hablar. **El peligro no era únicamente la distancia hacia casa; el verdadero peligro era el pánico y la desorientación cuando la rutina falló.**

### 2. Por qué no un "Rastreador GPS Pasivo"
Las aplicaciones comerciales de control parental suelen limitarse a convertir al niño en un punto pasivo sobre una pantalla. Esto genera tres graves deficiencias:
1. **No enseña nada al menor:** Si el teléfono pierde señal, se apaga o el niño se confunde de calle, el niño sigue desprotegido cognitivamente.
2. **Riesgo de privacidad:** Centralizar las coordenadas exactas del trayecto de menores en servidores en la nube crea un vector de ataque y fuga de datos inaceptable.
3. **Ansiedad en lugar de autonomía:** La seguridad no surge de la vigilancia constante, sino de **dotar al niño de criterio, memoria espacial y calma emocional**.

**Wawapp cambia el paradigma:** sustituye la vigilancia pasiva por **aprendizaje espacial activo y preparación psicológica lúdica.**

---

## 🧠 El Por Qué de Cada Decisión de Diseño

```
┌────────────────────────────────────────────────────────┐
│ MODO MAMÁ │
│ Diseño de ruta · Hitos de confianza · Nombre de hijo │
└──────────────────────────┬─────────────────────────────┘
│ Enlace con carga útil (Hash URL)
▼
┌────────────────────────────────────────────────────────┐
│ MODO NIÑO │
│ Avatar 3D · Gemelo Urbano OSM · Preguntas · Cotillón │
└────────────────────────────────────────────────────────┘
```

### 1. ¿Por qué un Gemelo Digital 3D con OpenStreetMap real?
A los 6-11 años, los niños tienen dificultades para abstraer un mapa 2D cenital (visto desde el cielo). Sin embargo, reconocen inmediatamente **puntos de anclaje visuales tridimensionales**: la tienda de la esquina con rejas, la farmacia iluminada, la altura de las casas vecinas y el semáforo peatonal.
* Mediante **Three.js** y la **API Overpass de OpenStreetMap**, Wawapp proyecta los edificios reales con sus alturas estimadas y la traza exacta de las calles locales.
* El niño explora su propio barrio virtualmente antes de caminarlo en la vida real.

### 2. ¿Por qué la Arquitectura de Doble Rol (Madre vs. Niño)?
* **Modo Mamá (Planificación Segura):**
  * La madre define el corredor seguro: establece el **Punto de Inicio** (🏫 Colegio / 🎒 Escuela), marca el **Camino** (👣 huellas numeradas) y fija la **Llegada** (🏠 Casa / 👵 Casa de la Abuela).
  * Añade **Puntos de Apoyo Vecinal**: bodegas amigas, farmacias con personal identificado, parques familiares y cruces con semáforo.
  * Personaliza el nombre de su hijo/a para brindarle cercanía y cariño.
* **Modo Niño (Aventura Gamificada):**
  * Se accede a través de un **enlace directo único** generado por la madre.
  * Se eliminan todas las barras de edición o configuraciones técnicas.
  * El niño es recibido con su propio nombre (`🎒 ¡Hola, Thiago!`) y asume el recorrido como una misión donde gana estrellas y aprende a cuidarse.

### 3. ¿Por qué el Enlace Compartible sin Registro ni Servidor Central?
* **Privacidad Absoluta (Zero-Knowledge):** La ruta, los puntos y el nombre se serializan y codifican en el fragmento hash (`#data=...`) de la URL y en el almacenamiento local (`localStorage`).
* **Cero barreras de acceso:** El niño no necesita crear cuentas, recordar contraseñas ni instalar aplicaciones pesadas; solo abre el enlace que mamá le envió por WhatsApp y la app funciona en cualquier navegador móvil o de escritorio.
* **Ningún servidor recopila la ubicación ni los nombres de los menores.**

### 4. ¿Por qué el Personaje Chibi 3D Visible y Articulado?
* Los niños necesitan un **avatar con el que identificarse emocionalmente**.
* El personaje cuenta con zapatillas, ropa deportiva alegre, gorra infantil y su **mochila escolar**.
* Incorpora un ciclo de marcha fluido (movimiento alternado de brazos, zancada de piernas y balanceo de mochila) con una etiqueta flotante con su nombre.
* La cámara sigue en **tercera persona cercana e inmersiva**, permitiendo que el niño vea a su personaje avanzar paso a paso por las aceras.

### 5. ¿Por qué Preguntas Situacionales de Valor Real?
En lugar de trivias genéricas, el banco pedagógico (`src/questions.js`) entrena **protocolos de supervivencia urbana**:
* **Salida escolar:** Qué responder con firmeza si un desconocido dice *"tu mamá me mandó a recogerte"* y la importancia de quedarse con la profesora.
* **Cruce peatonal:** Comprobar que los autos se detuvieron antes de pisar el paso de cebra, aun con semáforo en verde.
* **Reacción ante imprevistos:** Si una pelota rueda a la pista, **no perseguirla** y pedir ayuda a un adulto.
* **Red de confianza comunitaria:** Acudir a la bodega amiga o a la botica iluminada para pedir una llamada telefónica a mamá si se siente desorientado o intimidado.

### 6. ¿Por qué Cotillón (Confeti) y Sonidos al Acertar?
* En la psicología infantil, el **refuerzo positivo inmediato** desencadena respuestas dopaminérgicas que consolidan la memoria a largo plazo.
* Se implementó un motor nativo de partículas en Canvas (`src/confetti.js`) con explosión de estrellas, serpentinas y confeti multicolor, acompañado de una fanfarria armónica mediante **Web Audio API** (100% nativa, sin dependencias externas ni descargas).
* El personaje 3D realiza un salto de festejo con los brazos en alto.

### 7. ¿Por qué una Orientación "Sublime" y Amable al Fallar?
* **En situaciones de emergencia, el miedo bloquea el pensamiento.** Castigar el error con sonidos estridentes o cruces rojas genera frustración y ansiedad.
* Si el niño se equivoca, Wawapp emite un tono suave y acogedor, resalta la opción segura en verde y despliega una explicación constructiva y afectuosa:
> *"💡 ¡Buen intento, campeón! Aprendamos juntos: Los autos no siempre ven a un niño agachándose en la pista; por eso siempre nos quedamos en la vereda y pedimos ayuda a un adulto."*
* Esto fomenta una mentalidad de aprendizaje continuo y seguridad interna.

### 8. ¿Por qué el Botón "SOS / Me Perdí"?
* Si el niño está en la calle y se siente perdido, el botón rojo de emergencia:
  1. Utiliza la geolocalización del dispositivo.
  2. Calcula por fórmula matemática de Haversine cuáles son los **3 puntos seguros o comercios más cercanos** que su madre trazó.
  3. Prepara un mensaje instantáneo de WhatsApp con la ubicación GPS en tiempo real de Google Maps y el lugar seguro al que se dirige para enviárselo a mamá con un solo tap.

---

## 🛠️ Stack Tecnológico y Arquitectura

| Componente                | Tecnología                                                                                                         | Razón de Elección                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Motor 3D**              | [Three.js r160](https://threejs.org/)                                                                              | Renderizado WebGL acelerado por hardware sin plugins.                           |
| **Cartografía 2D**        | [Leaflet 1.9.4](https://leafletjs.com/)                                                                            | Ligero, táctil y de alto rendimiento en dispositivos móviles.                   |
| **Datos Geoespaciales**   | [OpenStreetMap](https://www.openstreetmap.org/) + [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) | Datos urbanos abiertos y colaborativos a nivel global.                          |
| **Sintetizador de Audio** | Web Audio API nativo                                                                                               | Generación procedural de frecuencias y campanas sin archivos de audio externos. |
| **Física de Partículas**  | Canvas 2D nativo                                                                                                   | Cotillón a 60 FPS con gravedad, resistencia del aire y rotación de formas.      |
| **Empaquetador**          | [Vite 5.4](https://vitejs.dev/)                                                                                    | Tiempos de compilación ultrarrápidos y recarga en caliente instantánea.         |
| **Tipografía Infantil**   | Google Fonts (Fredoka & Nunito)                                                                                    | Legibilidad comprobada y calidez estética para menores.                         |

---

## 📁 Estructura del Código Fuente

```text
wawapp/
├── index.html              # Interfaz unificada, estilos responsivos y modales
├── package.json            # Dependencias y scripts de construcción
├── README.md               # Manifiesto, arquitectura y documentación
├── public/
│   └── data/
│       └── sjl.json        # Respaldo de geometría urbana para modo sin conexión
├── scripts/
│   └── fetch-osm.mjs       # Script Node.js para descargar y pre-cachear zonas OSM
└── src/
    ├── main.js             # Controlador general, interacción Leaflet y ciclo de vida
    ├── scene.js            # Escena 3D Three.js, personaje Chibi animado y cámara
    ├── questions.js        # Banco pedagógico de seguridad vial y comunitaria
    ├── confetti.js         # Motor de cotillón y serpentinas para niños
    ├── sound.js            # Síntesis de audio amigable (victoria, calma y clics)
    ├── state.js            # Gestión de estado, persistencia y codificación de links
    └── osm.js              # Cliente Overpass API con caché en localStorage
```

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos Previos
* Node.js v18.0.0 o superior
* Navegador con soporte WebGL habilitado (Chrome, Edge, Safari, Firefox)

### Ejecución Local
```bash
# 1. Clonar el repositorio o ingresar a la carpeta
cd wawapp

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo en vivo
npm run dev
```
Abre en tu navegador: `http://localhost:5173/`

### Generar versión de producción optimizada
```bash
npm run build
npm run preview
```

### Pre-descargar un cuadrante de OpenStreetMap (Modo Offline)
```bash
# Descarga por defecto (zona de ejemplo en San Juan de Lurigancho)
npm run osm

# O especificando un Bounding Box personalizado [sur oeste norte este]:
npm run osm -- -11.9935 -77.0105 -11.9880 -77.0040
```

---

## 🔒 Privacidad y Ética del Proyecto

* **Diseño Ético por Defecto:** Wawapp no contiene publicidad, rastreadores comerciales de telemetría ni cookies invasivas.
* **Sin Base de Datos Centralizada de Menores:** Las rutas jamás residen en un servidor central. La información pertenece exclusivamente a la madre y a su hijo.
* **Derecho al Autocuidado Infantil:** Se fomenta la educación activa en lugar de la hipervigilancia restrictiva.

---

## 🗺️ Visión y Próximos Pasos de Alto Impacto

1. **Integración con Redes de Serenazgo y Gobiernos Locales:** Mapeo verificado de "Casas Refugio" y puestos de auxilio rápido oficial.
2. **Modo Multilingüe Inclusivo:** Incorporación de doblaje y textos en Quechua y Aimara para comunidades andinas.
3. **Audio-Guía Asistida:** Lectura en voz alta para niños en etapa pre-lectora o con dificultades visuales.
4. **Alianzas Educativas:** Despliegue de pilotos en instituciones educativas públicas y escuelas rurales.

---

## 📬 Contacto y Alianzas Estratégicas

Para implementar este proyecto en colegios, municipios, ONGs o colaborar en su investigación y escalamiento:

* **Paul Damian Sarro**
* **Empresa:** Devs Generation
* **Correo Electrónico:** [hola@devsgeneration.com](mailto:hola@devsgeneration.com)
* **Teléfono / WhatsApp:** [+51 959642919](https://wa.me/51959642919)
* **Lima, Perú.**
