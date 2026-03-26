// js/Card.js
let nextId = 0;
class Card {
  constructor(data, isPlayer) {
    this.id = nextId++;
    this.data = { ...data };
    this.isPlayer = isPlayer;
    this.isDungeon = !isPlayer;
    this.x = 0; this.y = 0;
    this.targetX = 0; this.targetY = 0;
    this.scale = 0.1;
    this.alpha = 1;
    this.angle = 0;
    this.active = true;
    this.dragging = false;
    this.dragOffX = 0; this.dragOffY = 0;
    this.glowPulse = 0;
    this.glowDir = 1;
    this.hoverGlow = 0;
    this.dead = false;
    this.shakeX = 0; this.shakeY = 0;
  }

  update(dt) {
    if (this.dead) return;
    if (!this.dragging) {
      this.x += (this.targetX - this.x) * 0.18;
      this.y += (this.targetY - this.y) * 0.18;
    }
    if (this.scale < 1) this.scale = Math.min(1, this.scale + dt * 4);
    this.glowPulse += dt * this.glowDir * 1.5;
    if (this.glowPulse > 1) { this.glowPulse = 1; this.glowDir = -1; }
    if (this.glowPulse < 0) { this.glowPulse = 0; this.glowDir = 1; }
    this.shakeX *= 0.8;
    this.shakeY *= 0.8;
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    const rx = this.x + this.shakeX;
    const ry = this.y + this.shakeY;
    ctx.translate(rx, ry);
    ctx.scale(this.scale, this.scale);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.globalAlpha = this.alpha;

    const w = CARD_W, h = CARD_H, r = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = this.dragging ? 30 : 14;
    ctx.shadowOffsetY = this.dragging ? 8 : 3;

    const grad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
    const baseColor = this.data.color || '#333';
    grad.addColorStop(0, shadeColor(baseColor, 40));
    grad.addColorStop(1, shadeColor(baseColor, -30));
    roundRect(ctx, -w/2, -h/2, w, h, r);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = this.data.glow || this.data.color || '#fff';
    ctx.shadowBlur = 12 + this.glowPulse * 10 + this.hoverGlow * 12;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = this.data.glow || this.data.color || '#fff';
    ctx.lineWidth = this.dragging ? 2.5 : 1.5;
    roundRect(ctx, -w/2, -h/2, w, h, r);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, -w/2+4, -h/2+4, w-8, h-8, r-2);
    ctx.stroke();

    const hdr = ctx.createLinearGradient(-w/2, -h/2, w/2, -h/2+24);
    hdr.addColorStop(0, 'rgba(0,0,0,0.5)');
    hdr.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = hdr;
    roundRectTop(ctx, -w/2+2, -h/2+2, w-4, 22, r-2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    roundRect(ctx, -w/2+8, -h/2+30, w-16, 46, 6);
    ctx.fill();

    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.data.icon || '?', 0, -h/2 + 53);

    ctx.font = `bold 10px "Rajdhani", sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const name = this.data.name || '???';
    ctx.fillText(name.length > 12 ? name.slice(0,12)+'…' : name, 0, -h/2 + 82);

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w/2+10, -h/2+92);
    ctx.lineTo(w/2-10, -h/2+92);
    ctx.stroke();

    if (this.isPlayer) {
      drawStat(ctx, -w/2+10, -h/2+98, '⚔', this.data.atk || 0, '#ff6b6b');
      drawStat(ctx, w/2-10, -h/2+98, '♥', this.data.hp || 0, '#4ecdc4', 'right');
    } else {
      const d = this.data;
      if (d.type === 'enemy') {
        drawStat(ctx, -w/2+10, -h/2+98, '⚔', d.atk, '#ff6b6b');
        drawStat(ctx, w/2-10, -h/2+98, '♥', d.hp, '#4ecdc4', 'right');
      } else if (d.type === 'loot') {
        drawStatCenter(ctx, 0, -h/2+100, '◈', d.gold, '#ffd700');
      } else if (d.type === 'heal') {
        drawStatCenter(ctx, 0, -h/2+100, '♥', '+'+d.heal, '#4ecdc4');
      } else if (d.type === 'hazard') {
        drawStatCenter(ctx, 0, -h/2+100, '💀', '-'+d.damage, '#ff4b6e');
      }
    }

    if (this.isDungeon) {
      const badgeColor = { enemy: '#b71c1c', loot: '#f57f17', heal: '#1b5e20', hazard: '#37474f' }[this.data.type] || '#333';
      const badgeLabel = { enemy: 'FOE', loot: 'LOOT', heal: 'HEAL', hazard: 'TRAP' }[this.data.type] || '??';
      ctx.fillStyle = badgeColor;
      roundRect(ctx, -18, h/2-18, 36, 12, 4);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px "Rajdhani"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeLabel, 0, h/2-12);
    }

    if (this.isPlayer && this.data.isFusion) {
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(w/2-10, -h/2+10, 5, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  contains(px, py) {
    if (this.dead) return false;
    const hw = (CARD_W * this.scale) / 2;
    const hh = (CARD_H * this.scale) / 2;
    return px >= this.x - hw && px <= this.x + hw && py >= this.y - hh && py <= this.y + hh;
  }

  shake() {
    this.shakeX = (Math.random()-0.5) * 14;
    this.shakeY = (Math.random()-0.5) * 8;
  }
}