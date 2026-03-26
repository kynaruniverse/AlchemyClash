// js/ui.js
// ── Draw Helpers ───────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}
function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h);
  ctx.lineTo(x, y+h);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}
function drawStat(ctx, x, y, icon, val, color, align='left') {
  ctx.font = `bold 10px "Rajdhani"`;
  ctx.fillStyle = color;
  ctx.textAlign = align === 'right' ? 'right' : 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${icon} ${val}`, x, y);
}
function drawStatCenter(ctx, x, y, icon, val, color) {
  ctx.font = `bold 11px "Rajdhani"`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`${icon} ${val}`, x, y);
}
function shadeColor(hex, pct) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + pct));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + pct));
  const b = Math.min(255, Math.max(0, (num & 0xff) + pct));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// ── Particles & Shake (global helpers used by game) ────────
function spawnBurst(x, y, color, count=20) { game.spawnBurst(x, y, color, count); }
function shake(power) { game.shake(power); }

// ── Toasts & HUD ───────────────────────────────────────────
function toast(msg, duration=2500) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 350);
  }, duration);
}

function updateHUD() {
  document.getElementById('hp-val').textContent = `\( {game.state.hp}/ \){game.state.maxHp}`;
  document.getElementById('gold-val').textContent = game.state.gold;
  document.getElementById('depth-val').textContent = `Depth ${game.state.depth}`;
  const hpEl = document.getElementById('hud-hp');
  hpEl.style.color = game.state.hp < 30 ? '#ff1744' : '#ff4b6e';
}

// ── Background & Zone Labels ───────────────────────────────
function drawBackground() {
  const W = canvas.width, H = canvas.height;
  const bg = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H/2, H*0.8);
  bg.addColorStop(0, '#1a0a2e');
  bg.addColorStop(0.5, '#0d0a1e');
  bg.addColorStop(1, '#060610');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(100,60,200,0.04)';
  ctx.lineWidth = 1;
  const gridSz = 40;
  for (let x = 0; x < W; x += gridSz) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += gridSz) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  const dungY = H * DUNGEON_Y_RATIO;
  ctx.fillStyle = 'rgba(120,40,200,0.04)';
  ctx.fillRect(0, dungY - CARD_H/2 - 10, W, CARD_H + 20);
  ctx.strokeStyle = 'rgba(120,40,200,0.1)';
  ctx.setLineDash([6,6]);
  ctx.strokeRect(0, dungY - CARD_H/2 - 10, W, CARD_H + 20);
  ctx.setLineDash([]);

  const handY = H * HAND_Y_RATIO;
  ctx.fillStyle = 'rgba(40,60,140,0.06)';
  ctx.fillRect(0, handY - CARD_H/2 - 10, W, CARD_H + 20);
  ctx.strokeStyle = 'rgba(80,100,200,0.12)';
  ctx.setLineDash([6,6]);
  ctx.strokeRect(0, handY - CARD_H/2 - 10, W, CARD_H + 20);
  ctx.setLineDash([]);
}

function drawZoneLabels() {
  const W = canvas.width, H = canvas.height;
  ctx.save();
  ctx.font = '9px "Cinzel", serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.textAlign = 'center';
  ctx.fillText('— DUNGEON ROW —', W/2, H * DUNGEON_Y_RATIO - CARD_H/2 - 14);
  ctx.fillText('— YOUR HAND —', W/2, H * HAND_Y_RATIO - CARD_H/2 - 14);
  ctx.restore();
}

// ── Simple Web Audio SFX ───────────────────────────────────
const AudioEngine = {
  ctx: new (window.AudioContext || window.webkitAudioContext)(),
  playSFX(type) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain).connect(this.ctx.destination);
    if (type === 'fuse') { osc.frequency.setValueAtTime(420, this.ctx.currentTime); gain.gain.value = 0.3; }
    else if (type === 'fight') { osc.frequency.setValueAtTime(180, this.ctx.currentTime); gain.gain.value = 0.6; }
    osc.start();
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.stop(this.ctx.currentTime + 0.4);
  }
};

// Expose drawParticles globally for main loop
function drawParticles() {
  for (const p of game.particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}