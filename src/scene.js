import * as THREE from 'three';

const M = (c, opt = {}) => new THREE.MeshLambertMaterial({ color: c, ...opt });
const W = { motorway: 12, trunk: 12, primary: 10, secondary: 9, tertiary: 8, residential: 7, service: 5, footway: 3.5, path: 3, steps: 3, pedestrian: 5 };
const COL = { bodega: 0x3b82f6, farmacia: 0x10b981, parque: 0x22c55e, cruce: 0xef4444, seguro: 0xf59e0b };

export class Scene3D {
  constructor(cv) {
    this.cv = cv;
    this.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    this.r.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.r.shadowMap.enabled = true;
    this.r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.childName = 'Thiago';
  }

  setChildName(name) {
    this.childName = name || 'Explorador';
  }

  build(osm, route, pois, options = {}) {
    this.childName = options.childName || this.childName || 'Explorador';
    const [la0, lo0] = route[0];
    const kx = 111320 * Math.cos(la0 * Math.PI / 180);
    const P = (la, lo) => ({ x: (lo - lo0) * kx, z: -(la - la0) * 110540 });

    this.pois = pois.map((p, idx) => ({ ...p, ...P(p.lat, p.lng), id: idx }));

    const s = this.s = new THREE.Scene();
    s.background = new THREE.Color(0xbbf2f6); // Cielo diurno despejado y alegre
    s.fog = new THREE.Fog(0xbbf2f6, 40, 220);

    // Luces vivas y alegres para niños
    const hemi = new THREE.HemisphereLight(0xffffff, 0x86efac, 0.95);
    s.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff7ed, 0.9);
    sun.position.set(60, 100, 30);
    sun.castShadow = true;
    s.add(sun);

    // Suelo verde / césped suave
    const groundGeo = new THREE.PlaneGeometry(3500, 3500);
    const groundMat = M(0xa7f3d0); // Verde pradera claro
    const g = new THREE.Mesh(groundGeo, groundMat);
    g.rotation.x = -Math.PI / 2;
    g.receiveShadow = true;
    s.add(g);

    // Segmentos de pistas / calles
    const seg = (a, b, w, y, c) => {
      const l = Math.hypot(b.x - a.x, b.z - a.z);
      if (l < 0.1) return;
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, l + w * 0.4), M(c));
      m.position.set((a.x + b.x) / 2, y, (a.z + b.z) / 2);
      m.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
      m.receiveShadow = true;
      s.add(m);
    };

    // Paleta de edificios estilo ciudad de juguete / amigable
    const pal = [0xfef08a, 0xfbcfe8, 0xbae6fd, 0xd9f99d, 0xfde047, 0xfecdd3, 0xc7d2fe];
    let n = 0;

    for (const el of osm.elements || []) {
      if (!el.geometry) continue;
      const t = el.tags || {};
      const pts = el.geometry.map(q => P(q.lat, q.lon));

      if (t.building) {
        if (pts.length < 3) continue;
        const sh = new THREE.Shape(pts.map(p => new THREE.Vector2(p.x, -p.z)));
        const levels = parseFloat(t['building:levels']) || 2;
        const h = Math.min(Math.max(levels * 2.8, 4), 22);
        const geo = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false });
        geo.rotateX(-Math.PI / 2);

        const m = new THREE.Mesh(geo, M(pal[n++ % pal.length]));
        m.position.y = 0.05;
        m.castShadow = true;
        m.receiveShadow = true;
        s.add(m);

        // Techo de color acento para darle vida
        const roofMat = M(0xf97316);
        const roofBorder = new THREE.Mesh(geo, roofMat);
        roofBorder.position.y = 0.07;
        roofBorder.scale.set(1.01, 1, 1.01);
      } else if (t.highway) {
        const w = W[t.highway] || 6;
        const c = w < 4 ? 0xd1d5db : 0x475569;
        for (let i = 1; i < pts.length; i++) {
          seg(pts[i - 1], pts[i], w, 0.04 + w * 0.001, c);
        }
      }
    }

    // Ruta segura trazada (camino amarillo brillante con huellas)
    this.path = route.map(p => P(p[0], p[1]));
    this.len = 0;
    for (let i = 1; i < this.path.length; i++) {
      const a = this.path[i - 1];
      const b = this.path[i];
      this.len += Math.hypot(b.x - a.x, b.z - a.z);
      b.s = this.len;
      // Línea de camino seguro acolchada
      seg(a, b, 2.6, 0.18, 0xfacc15); // Amarillo dorado brillante
    }
    this.path[0].s = 0;

    // Marcadores 3D para POIs
    this.poiMeshes = [];
    this.pois.forEach(p => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5), M(0xffffff));
      pole.position.set(p.x, 2.5, p.z);
      s.add(pole);

      // Globo / gema flotante
      const orb = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), M(COL[p.t] || 0x38bdf8));
      orb.position.set(p.x, 5.8, p.z);
      s.add(orb);
      this.poiMeshes.push(orb);

      // Corona brillante de advertencia amigable
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 2.2, 16),
        new THREE.MeshBasicMaterial({ color: COL[p.t] || 0xffffff, side: THREE.DoubleSide })
      );
      ring.position.set(p.x, 0.25, p.z);
      ring.rotation.x = -Math.PI / 2;
      s.add(ring);
    });

    // Marcador 3D de INICIO (bandera / arco de salida)
    if (this.path.length > 0) {
      const startPt = this.path[0];
      const startArch = new THREE.Mesh(new THREE.TorusGeometry(2, 0.25, 12, 24, Math.PI), M(0x22c55e));
      startArch.position.set(startPt.x, 2, startPt.z);
      s.add(startArch);
    }

    // Marcador 3D de LLEGADA / META (arco dorado de triunfo)
    if (this.path.length > 1) {
      const endPt = this.path[this.path.length - 1];
      const endArch = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.3, 12, 24, Math.PI), M(0xf59e0b));
      endArch.position.set(endPt.x, 2.4, endPt.z);
      s.add(endArch);

      // Estrella flotante de llegada
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), M(0xffd700));
      star.position.set(endPt.x, 5, endPt.z);
      s.add(star);
    }

    // CREACIÓN DEL PERSONAJE CHIBI VISTOSO PARA NIÑOS
    this.createKidHero(s);

    // Cámara con ángulo en tercera persona cercano y vistoso
    this.cam = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
    this.resize();
    this.d = 0;
    this.st = 'idle';
    this.celebrating = false;
    this.place(true);
  }

  createKidHero(s) {
    const hero = this.hero = new THREE.Group();

    // Sombra en el suelo
    const shadowGeo = new THREE.CircleGeometry(0.8, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
    const shadow = this.heroShadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    hero.add(shadow);

    // Contenedor articulado del cuerpo
    const bodyGroup = this.bodyGroup = new THREE.Group();
    hero.add(bodyGroup);

    // Torso / Polerita roja divertida
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.9, 14);
    const torsoMat = M(0xef4444); // Rojo amigable
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.1;
    bodyGroup.add(torso);

    // Rayas blancas en la polera
    const stripeGeo = new THREE.CylinderGeometry(0.485, 0.46, 0.2, 14);
    const stripeMat = M(0xffffff);
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 1.1;
    bodyGroup.add(stripe);

    // Cabeza Chibi expresiva
    const headMat = M(0xfbcfe8); // Piel sonrosada infantil
    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const head = this.head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.95;
    bodyGroup.add(head);

    // Gorra deportiva con visera
    const capMat = M(0x3b82f6); // Azul vibrante
    const capGeo = new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.98;
    bodyGroup.add(cap);

    const visorGeo = new THREE.BoxGeometry(0.55, 0.08, 0.45);
    const visor = new THREE.Mesh(visorGeo, capMat);
    visor.position.set(0, 2.12, 0.48);
    visor.rotation.x = -0.15;
    bodyGroup.add(visor);

    // Ojitos grandes y tiernos
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
    leftEye.position.set(-0.18, 1.96, 0.48);
    bodyGroup.add(leftEye);

    const leftSpark = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeWhiteMat);
    leftSpark.position.set(-0.16, 1.98, 0.52);
    bodyGroup.add(leftSpark);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
    rightEye.position.set(0.18, 1.96, 0.48);
    bodyGroup.add(rightEye);

    const rightSpark = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeWhiteMat);
    rightSpark.position.set(0.2, 1.98, 0.52);
    bodyGroup.add(rightSpark);

    // Sonrisa feliz
    const smileGeo = new THREE.TorusGeometry(0.09, 0.025, 8, 12, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.x = Math.PI;
    smile.position.set(0, 1.84, 0.52);
    bodyGroup.add(smile);

    // Mochila escolar en la espalda (¡indispensable para la temática del cole!)
    const packMat = M(0x10b981); // Mochila verde esmeralda
    const packGeo = new THREE.BoxGeometry(0.58, 0.72, 0.35);
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 1.15, -0.36);
    bodyGroup.add(backpack);

    // Bolsillo de la mochila
    const pocketMat = M(0xf59e0b);
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.12), pocketMat);
    pocket.position.set(0, 1.05, -0.52);
    bodyGroup.add(pocket);

    // Brazos articulados
    const armMat = M(0xef4444);
    const handMat = headMat;

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.55, 1.45, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.65), armMat);
    leftArmMesh.position.y = -0.3;
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.14), handMat);
    leftHand.position.y = -0.62;
    this.leftArm.add(leftArmMesh, leftHand);
    bodyGroup.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.55, 1.45, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.65), armMat);
    rightArmMesh.position.y = -0.3;
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.14), handMat);
    rightHand.position.y = -0.62;
    this.rightArm.add(rightArmMesh, rightHand);
    bodyGroup.add(this.rightArm);

    // Piernas articuladas con zapatillas
    const legMat = M(0x1d4ed8); // Pantalón jean azul
    const shoeMat = M(0xffffff); // Zapatillas blancas con suela de color

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.25, 0.7, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.65), legMat);
    leftLegMesh.position.y = -0.3;
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.42), shoeMat);
    leftShoe.position.set(0, -0.62, 0.08);
    this.leftLeg.add(leftLegMesh, leftShoe);
    hero.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.25, 0.7, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.65), legMat);
    rightLegMesh.position.y = -0.3;
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.42), shoeMat);
    rightShoe.position.set(0, -0.62, 0.08);
    this.rightLeg.add(rightLegMesh, rightShoe);
    hero.add(this.rightLeg);

    // Etiqueta 3D flotante con el nombre del niño
    this.createNameTag();

    s.add(hero);
  }

  createNameTag() {
    if (this.nameTagMesh) {
      this.hero.remove(this.nameTagMesh);
    }
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 64;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(4, 4, 248, 56, 24);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0284c7';
    ctx.roundRect(4, 4, 248, 56, 24);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🎒 ${this.childName}`, 128, 32);

    const tex = new THREE.CanvasTexture(cv);
    const tagMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(tagMat);
    sprite.scale.set(3.2, 0.8, 1);
    sprite.position.set(0, 3.1, 0);
    this.nameTagMesh = sprite;
    this.hero.add(sprite);
  }

  resize() {
    const parent = this.cv.parentElement;
    if (!parent) return;
    const w = parent.clientWidth || window.innerWidth;
    const h = parent.clientHeight || window.innerHeight;
    this.r.setSize(w, h, false);
    if (this.cam) {
      this.cam.aspect = w / h;
      this.cam.updateProjectionMatrix();
    }
  }

  at(d) {
    const p = this.path;
    d = Math.min(Math.max(0, d), this.len);
    let i = 1;
    while (i < p.length - 1 && p[i].s < d) i++;
    const a = p[i - 1];
    const b = p[i];
    const l = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    const t = Math.max(0, Math.min(1, (d - a.s) / l));
    return {
      x: a.x + (b.x - a.x) * t,
      z: a.z + (b.z - a.z) * t,
      dx: (b.x - a.x) / l,
      dz: (b.z - a.z) / l
    };
  }

  place(instant = false) {
    const p = this.at(this.d);
    this.hero.position.set(p.x, 0, p.z);
    
    const targetAngle = Math.atan2(p.dx, p.dz);
    this.hero.rotation.y = targetAngle;

    // Cámara vistosa en tercera persona (elevada a ~5.8m, distancia ~9m atrás del personaje)
    const camDist = 9.5;
    const camHeight = 5.8;
    const targetCamX = p.x - p.dx * camDist;
    const targetCamZ = p.z - p.dz * camDist;
    const targetCamY = camHeight;

    if (instant || !this.camTargetPos) {
      this.cam.position.set(targetCamX, targetCamY, targetCamZ);
      this.camTargetPos = new THREE.Vector3(targetCamX, targetCamY, targetCamZ);
    } else {
      // Suave lerp para que la cámara siga fluidamente
      this.cam.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
    }

    // Mirar hacia adelante del personaje, ligeramente arriba
    this.cam.lookAt(p.x + p.dx * 3, 2.2, p.z + p.dz * 3);
  }

  // Animación de festejo (saltito y brazos arriba)
  celebrate() {
    this.celebrating = true;
    this.celebrateStart = performance.now();
  }

  start(onPoi, onEnd) {
    this.onPoi = onPoi;
    this.onEnd = onEnd;
    this.d = 0;
    this.done = new Set();
    this.st = 'walk';
    this.last = performance.now();
    this.place(true);
    this.loop();
  }

  loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const t = performance.now();
    const dt = Math.min((t - (this.last || t)) / 1000, 0.05);
    this.last = t;

    // Rotar gemas flotantes de POIs
    if (this.poiMeshes) {
      this.poiMeshes.forEach((mesh, idx) => {
        mesh.rotation.y = t * 0.002 + idx;
        mesh.position.y = 5.8 + Math.sin(t * 0.003 + idx) * 0.3;
      });
    }

    // Animación del personaje caminando
    if (this.st === 'walk') {
      const walkSpeed = 6.2; // Velocidad de caminata amena
      this.d += walkSpeed * dt;

      // Ciclo de marcha (piernas y brazos oscilando)
      const stride = Math.sin(t * 0.012);
      this.leftLeg.rotation.x = stride * 0.65;
      this.rightLeg.rotation.x = -stride * 0.65;
      this.leftArm.rotation.x = -stride * 0.6;
      this.rightArm.rotation.x = stride * 0.6;

      // Bote suave del cuerpito y mochila al caminar
      const bounce = Math.abs(Math.sin(t * 0.012)) * 0.15;
      this.bodyGroup.position.y = bounce;
      this.head.rotation.y = Math.sin(t * 0.006) * 0.12;

      this.place();

      // Verificar si llegó al fin
      if (this.d >= this.len) {
        this.d = this.len;
        this.st = 'fin';
        this.resetLimbs();
        this.celebrate();
        this.place();
        if (this.onEnd) this.onEnd();
      } else {
        // Verificar proximidad a POIs
        const h = this.hero.position;
        this.pois.forEach((p, i) => {
          if (this.st === 'walk' && !this.done.has(i)) {
            const dist = Math.hypot(p.x - h.x, p.z - h.z);
            if (dist < 12) {
              this.done.add(i);
              this.st = 'ask';
              this.resetLimbs();
              // Detenerse y saludar
              this.rightArm.rotation.x = -2.2;
              this.rightArm.rotation.z = 0.4;
              if (this.onPoi) {
                this.onPoi(p).then(() => {
                  this.resetLimbs();
                  this.st = 'walk';
                });
              }
            }
          }
        });
      }
    } else if (this.st === 'idle' || this.st === 'ask') {
      // Idle adorable: pequeño vaivén de respiración y saludo
      this.bodyGroup.position.y = Math.sin(t * 0.004) * 0.05;
      this.head.rotation.y = Math.sin(t * 0.003) * 0.15;
      this.place();
    }

    // Efecto de celebración
    if (this.celebrating) {
      const elapsed = (t - this.celebrateStart) / 1000;
      if (elapsed < 3.5) {
        // Saltar alegremente
        const jump = Math.abs(Math.sin(elapsed * 7)) * 0.9;
        this.hero.position.y = jump;
        this.leftArm.rotation.x = -2.4;
        this.leftArm.rotation.z = -0.5;
        this.rightArm.rotation.x = -2.4;
        this.rightArm.rotation.z = 0.5;
      } else {
        this.celebrating = false;
        this.hero.position.y = 0;
        this.resetLimbs();
      }
    }

    this.r.render(this.s, this.cam);
  };

  resetLimbs() {
    if (!this.leftLeg) return;
    this.leftLeg.rotation.x = 0;
    this.rightLeg.rotation.x = 0;
    this.leftArm.rotation.x = 0;
    this.leftArm.rotation.z = 0;
    this.rightArm.rotation.x = 0;
    this.rightArm.rotation.z = 0;
    this.bodyGroup.position.y = 0;
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}
