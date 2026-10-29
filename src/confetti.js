// Sistema de Cotillón y Confeti para niños
// Crea una explosión de confetis, estrellas y serpentinas coloridas en pantalla.

export class ConfettiCannon {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cotillon-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Dispara el cotillón desde una posición (por defecto centro-inferior de la pantalla)
  burst(x = this.width / 2, y = this.height * 0.6, count = 90) {
    this.resize();
    this.canvas.style.display = 'block';

    const colors = [
      '#FF1744', '#FF5252', '#FF9100', '#FFEA00', 
      '#00E676', '#00B0FF', '#7C4DFF', '#E040FB', '#FF4081'
    ];
    const shapes = ['rect', 'circle', 'star', 'ribbon'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * Math.random());
      const speed = 7 + Math.random() * 14;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
        vy: -Math.abs(Math.sin(angle)) * speed * 1.3 - 4, // fuerte impulso hacia arriba
        gravity: 0.35 + Math.random() * 0.15,
        drag: 0.965,
        color,
        shape,
        size: 8 + Math.random() * 10,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        life: 1.0,
        decay: 0.009 + Math.random() * 0.007
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.lastTime = performance.now();
      requestAnimationFrame(this.loop);
    }
  }

  loop = (now) => {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.height + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(0, 0, 5, p.size * 0.7, p.size * 0.35);
      } else if (p.shape === 'ribbon') {
        this.ctx.fillRect(-p.size * 0.8, -2, p.size * 1.6, 4);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(this.loop);
    } else {
      this.animating = false;
      this.canvas.style.display = 'none';
    }
  };

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
