// js/game.js
class FusionGod {
  constructor() {
    this.state = { hp: 100, maxHp: 100, gold: 0, depth: 1, discoveredFusions: new Set() };
    this.handCards = [];
    this.dungeonCards = [];
    this.particles = [];
    this.screenShake = { x:0, y:0, power:0 };
    this.dragCard = null;
    this.hoverCard = null;
    this.gameRunning = false;
    this.lastTime = 0;
  }

  loadSave() {
    const saved = localStorage.getItem('fusionGodSave');
    if (saved) {
      const data = JSON.parse(saved);
      this.state.discoveredFusions = new Set(data.discovered || []);
    }
  }

  saveGame() {
    localStorage.setItem('fusionGodSave', JSON.stringify({
      discovered: Array.from(this.state.discoveredFusions)
    }));
  }

  resetState() {
    this.state = { hp: 100, maxHp: 100, gold: 0, depth: 1, discoveredFusions: new Set() };
    this.loadSave();
  }

  drawCard() {
    const keys = ELEMENT_KEYS.filter(k => !['void','arcane'].includes(k) || Math.random() < 0.2);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const el = { ...ELEMENTS[key], id: key };
    const c = new Card(el, true);
    c.x = canvas.width / 2;
    c.y = canvas.height + CARD_H;
    c.scale = 0.1;

    if (this.handCards.filter(c => !c.dead).length >= HAND_SLOTS) {
      const toDiscard = this.handCards.find(c => !c.data.isFusion) || this.handCards[0];
      if (toDiscard) toDiscard.dead = true;
      toast("Hand full — oldest card discarded", 1800);
    }
    this.handCards.push(c);
    this.layoutGame();
    return c;
  }

  fillDungeon() {
    while (this.dungeonCards.filter(c => !c.dead).length < 3) {
      const data = getRandomDungeonCard(this.state.depth);
      const c = new Card(data, false);
      c.x = canvas.width / 2;
      c.y = -CARD_H;
      c.scale = 0.1;
      this.dungeonCards.push(c);
    }
    this.layoutGame();
  }

  performFusion(cardA, cardB) {
    if (!cardA.active || !cardB.active || cardA.dead || cardB.dead) return;
    cardA.active = cardB.active = false;
    const fx = (cardA.x + cardB.x) / 2;
    const fy = (cardA.y + cardB.y) / 2;
    let startTime = performance.now();

    const animateMerge = (now) => {
      const t = Math.min((now - startTime) / 420, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      cardA.x += (fx - cardA.x) * 0.35;
      cardA.y += (fy - cardA.y) * 0.35;
      cardA.scale = Math.max(0, 1 - ease * 0.9);
      cardA.alpha = Math.max(0, 1 - ease);

      cardB.x += (fx - cardB.x) * 0.35;
      cardB.y += (fy - cardB.y) * 0.35;
      cardB.scale = Math.max(0, 1 - ease * 0.9);
      cardB.alpha = Math.max(0, 1 - ease);

      if (t < 1) {
        requestAnimationFrame(animateMerge);
      } else {
        cardA.dead = cardB.dead = true;
        spawnBurst(fx, fy, '#ffd700', 35);
        shake(6);

        const fusionData = getFusion(cardA.data.id, cardB.data.id);
        const newCard = new Card(fusionData, true);
        newCard.x = fx; newCard.y = fy; newCard.scale = 0.1;
        this.handCards.push(newCard);
        this.layoutGame();

        if (!this.state.discoveredFusions.has(fusionData.name)) {
          this.state.discoveredFusions.add(fusionData.name);
          toast(`✨ New Fusion: ${fusionData.name}!`, 3000);
        }
        AudioEngine.playSFX('fuse');
      }
    };
    requestAnimationFrame(animateMerge);
  }

  doCombat(playerCard, dungeonCard) {
    const pc = playerCard.data;
    const dc = dungeonCard.data;
    dc.hp = (dc.hp || 0) - (pc.atk || 0);
    spawnBurst(dungeonCard.x, dungeonCard.y, '#ff4b6e', 12);
    dungeonCard.shake();
    shake(4);

    if (dc.hp <= 0) {
      dungeonCard.dead = true;
      spawnBurst(dungeonCard.x, dungeonCard.y, dungeonCard.data.glow || '#ffd700', 25);
      toast(`⚔ ${dc.name} defeated!`);
      this.state.depth++;
      updateHUD();
      setTimeout(() => {
        this.fillDungeon();
        this.drawCard();
        toast(`🃏 Drew a new card!`);
      }, 600);
      playerCard.data.hp = Math.max(1, (playerCard.data.hp || 1) - Math.round(dc.atk * 0.18));
    } else {
      const dmg = dc.atk || 0;
      this.state.hp = Math.max(0, this.state.hp - dmg);
      spawnBurst(canvas.width/2, canvas.height*0.6, '#ff1744', 8);
      shake(8);
      toast(`💔 Took \( {dmg} damage! ( \){this.state.hp} HP left)`);
      dungeonCard.data.hp = dc.hp;
      updateHUD();
      playerCard.dead = true;
      spawnBurst(playerCard.x, playerCard.y, '#666', 10);
      if (this.state.hp <= 0) {
        setTimeout(showDeath, 800);
        return;
      }
      setTimeout(() => this.drawCard(), 400);
    }
    this.layoutGame();
  }

  handleDungeonInteraction(playerCard, dungeonCard) {
    const type = dungeonCard.data.type;
    shake(4);
    AudioEngine.playSFX('fight');

    if (type === 'enemy') {
      this.doCombat(playerCard, dungeonCard);
    } else if (type === 'loot') {
      const gold = dungeonCard.data.gold || 40;
      this.state.gold += gold;
      toast(`💰 Found ${gold} gold!`);
      spawnBurst(dungeonCard.x, dungeonCard.y, '#ffd700', 20);
      dungeonCard.dead = true;
      playerCard.dead = true;
      updateHUD();
      setTimeout(() => { this.fillDungeon(); this.drawCard(); }, 500);
    } else if (type === 'heal') {
      const heal = dungeonCard.data.heal || 30;
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + heal);
      toast(`💚 Restored ${heal} HP!`);
      spawnBurst(dungeonCard.x, dungeonCard.y, '#4caf50', 20);
      dungeonCard.dead = true;
      playerCard.dead = true;
      updateHUD();
      setTimeout(() => { this.fillDungeon(); this.drawCard(); }, 500);
    } else if (type === 'hazard') {
      const dmg = dungeonCard.data.damage || 15;
      this.state.hp = Math.max(0, this.state.hp - dmg);
      toast(`⚠ Trap! Took ${dmg} damage!`);
      spawnBurst(playerCard.x, playerCard.y, '#f44336', 16);
      shake(10);
      dungeonCard.dead = true;
      playerCard.dead = true;
      updateHUD();
      if (this.state.hp <= 0) setTimeout(showDeath, 800);
      else setTimeout(() => { this.fillDungeon(); this.drawCard(); }, 500);
    }
    this.layoutGame();
  }

  layoutGame() {
    const W = canvas.width, H = canvas.height;
    const handY = H * HAND_Y_RATIO;
    const dungY = H * DUNGEON_Y_RATIO;

    const alive = this.handCards.filter(c => !c.dead);
    const spacing = Math.min(CARD_W + 12, (W - 40) / Math.max(alive.length, 1));
    const totalW = spacing * (alive.length - 1);
    alive.forEach((c, i) => {
      c.targetX = W/2 - totalW/2 + i * spacing;
      c.targetY = handY;
    });

    const dAlive = this.dungeonCards.filter(c => !c.dead);
    const dSpacing = Math.min(CARD_W + 20, (W - 40) / Math.max(dAlive.length, 1));
    const dTotal = dSpacing * (dAlive.length - 1);
    dAlive.forEach((c, i) => {
      c.targetX = W/2 - dTotal/2 + i * dSpacing;
      c.targetY = dungY;
    });
  }

  shake(power) { this.screenShake.power = power; }
  spawnBurst(x, y, color, count=20) {
    for (let i=0; i<count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: 0.8 + Math.random()*0.6,
        size: 2 + Math.random()*4,
        color,
      });
    }
  }
  updateParticles(dt) {
    for (let i = this.particles.length-1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.vx *= 0.96;
      p.life -= p.decay * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }
  updateShake(dt) {
    if (this.screenShake.power > 0) {
      this.screenShake.x = (Math.random()-0.5)*this.screenShake.power*2;
      this.screenShake.y = (Math.random()-0.5)*this.screenShake.power*2;
      this.screenShake.power = Math.max(0, this.screenShake.power - dt*80);
    } else {
      this.screenShake.x = 0; this.screenShake.y = 0;
    }
  }
}