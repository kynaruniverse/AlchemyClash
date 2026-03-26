// js/main.js
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const game = new FusionGod();

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); game.layoutGame(); });

function getPointer(e) {
  const r = canvas.getBoundingClientRect();
  if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function onPointerDown(e) {
  if (!game.gameRunning) return;
  const { x, y } = getPointer(e);
  for (let i = game.handCards.length-1; i >= 0; i--) {
    const c = game.handCards[i];
    if (!c.dead && c.active !== false && c.contains(x, y)) {
      game.dragCard = c;
      c.dragging = true;
      c.dragOffX = x - c.x;
      c.dragOffY = y - c.y;
      e.preventDefault();
      return;
    }
  }
}

function onPointerMove(e) {
  if (!game.gameRunning) return;
  e.preventDefault();
  const { x, y } = getPointer(e);
  if (game.dragCard) {
    game.dragCard.x = x - game.dragCard.dragOffX;
    game.dragCard.y = y - game.dragCard.dragOffY;
    const allCards = [...game.handCards, ...game.dungeonCards].filter(c => c !== game.dragCard && !c.dead);
    game.hoverCard = allCards.find(c => c.contains(x, y)) || null;
    allCards.forEach(c => c.hoverGlow = 0);
    if (game.hoverCard) game.hoverCard.hoverGlow = 1;
  }
}

function onPointerUp(e) {
  if (!game.gameRunning || !game.dragCard) return;
  const { x, y } = getPointer(e);
  game.dragCard.dragging = false;

  let acted = false;
  const playerTargets = game.handCards.filter(c => c !== game.dragCard && !c.dead && c.active !== false);
  for (const t of playerTargets) {
    const dist = Math.hypot(game.dragCard.x - t.x, game.dragCard.y - t.y);
    if (dist < CARD_W * 0.85) {
      game.performFusion(game.dragCard, t);
      acted = true;
      break;
    }
  }

  if (!acted) {
    for (const t of game.dungeonCards) {
      if (t.dead) continue;
      const dist = Math.hypot(game.dragCard.x - t.x, game.dragCard.y - t.y);
      if (dist < CARD_W * 1.1) {
        game.handleDungeonInteraction(game.dragCard, t);
        acted = true;
        break;
      }
    }
  }

  if (!acted) game.layoutGame();
  game.dragCard = null;
  game.hoverCard = null;
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
canvas.addEventListener('touchmove', onPointerMove, { passive: false });
canvas.addEventListener('touchend', onPointerUp, { passive: false });

let lastTime = 0;
function gameLoop(ts) {
  if (!game.gameRunning) return;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  game.updateShake(dt);
  game.updateParticles(dt);

  ctx.save();
  ctx.translate(game.screenShake.x, game.screenShake.y);

  drawBackground();
  drawZoneLabels();

  const allCards = [...game.dungeonCards, ...game.handCards];
  allCards.forEach(c => c.update(dt));

  game.dungeonCards.filter(c => !c.dead).forEach(c => c.draw(ctx));
  game.handCards.filter(c => !c.dead && c !== game.dragCard).forEach(c => c.draw(ctx));
  if (game.dragCard && !game.dragCard.dead) game.dragCard.draw(ctx);

  drawParticles();

  if (game.dragCard) {
    const allTargets = [...game.handCards, ...game.dungeonCards].filter(c => c !== game.dragCard && !c.dead);
    for (const t of allTargets) {
      const dist = Math.hypot(game.dragCard.x - t.x, game.dragCard.y - t.y);
      if (dist < CARD_W * 1.2) {
        ctx.save();
        ctx.strokeStyle = t.isPlayer ? '#7c3aed' : '#ff6b35';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([4,4]);
        roundRect(ctx, t.x - CARD_W/2 - 8, t.y - CARD_H/2 - 8, CARD_W+16, CARD_H+16, 14);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    }
  }
  ctx.restore();

  game.handCards = game.handCards.filter(c => !c.dead || c.alpha > 0);
  game.dungeonCards = game.dungeonCards.filter(c => !c.dead || c.alpha > 0);

  requestAnimationFrame(gameLoop);
}

function showDeath() {
  game.gameRunning = false;
  game.saveGame();
  const ov = document.getElementById('overlay');
  ov.innerHTML = `
    <h1><span class="title-fusion">GAME</span><span class="title-god"> OVER</span></h1>
    <div class="death-msg">You fell in the depths...</div>
    <div class="score-msg">Reached Depth ${game.state.depth} &nbsp;·&nbsp; ${game.state.gold} Gold &nbsp;·&nbsp; ${game.state.discoveredFusions.size} Fusions</div>
    <button class="btn" id="restart-btn">RISE AGAIN</button>
  `;
  ov.classList.remove('hidden');
  const btn = document.getElementById('restart-btn');
  btn.replaceWith(btn.cloneNode(true));
  document.getElementById('restart-btn').addEventListener('click', startGame);
}

function startGame() {
  document.getElementById('overlay').classList.add('hidden');
  game.resetState();
  updateHUD();
  game.handCards = [];
  game.dungeonCards = [];
  game.particles.length = 0;

  for (let i = 0; i < 3; i++) game.drawCard();
  game.fillDungeon();
  game.layoutGame();

  game.gameRunning = true;
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);

  setTimeout(() => toast('👉 Drag cards together to FUSE!'), 700);
  setTimeout(() => toast('👉 Drag up to fight the dungeon!'), 3200);
}

document.getElementById('start-btn').addEventListener('click', startGame);