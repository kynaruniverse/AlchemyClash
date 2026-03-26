/**
 * FUSIONGOD - Main Engine
 * Optimized for Phaser v3.90.0 "Tsugumi"
 */

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 450, 
        height: 800
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    // Assets with fallback placeholders
    this.load.image('card-frame', 'https://labs.phaser.io/assets/sprites/cardBack_red.png');
    this.load.image('particle-flare', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
}

function create() {
    console.log("FUSIONGOD v3.90.0 Ready");

    // 1. Initialize Player State
    this.playerStats = { 
        hp: 100, 
        maxHp: 100, 
        gold: 0, 
        depth: 1 
    };
    
    // Load discoveries from localStorage
    this.discoveredEntries = JSON.parse(localStorage.getItem('fusion_discovery')) || ['fire', 'water', 'wolf'];

    // 2. Setup HUD (Text placeholders, updated by ui.js)
    this.hpText = this.add.text(20, 20, '', { fontFamily: 'Orbitron', fontSize: '24px', color: '#ff4b2b' });
    this.goldText = this.add.text(20, 50, '', { fontFamily: 'Orbitron', fontSize: '20px', color: '#ffd700' });
    updateHUD(this);

    // 3. Setup Hand Area
    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);
    
    // 4. Initial Spawn
    createCard(this, 150, 700, ELEMENT_DATA['fire']);
    createCard(this, 300, 700, ELEMENT_DATA['wolf']);

    // 5. Dungeon Logic
    this.dungeonRow = [null, null, null];
    this.fillDungeonRow = () => {
        for (let i = 0; i < 3; i++) {
            if (!this.dungeonRow[i] || !this.dungeonRow[i].active) {
                const randomKey = getRandomDungeonKey();
                const data = DUNGEON_DATA[randomKey];
                
                let card = createDungeonCard(this, 100 + (i * 125), -200, data);
                this.dungeonRow[i] = card;
                
                this.tweens.add({
                    targets: card,
                    y: 200,
                    duration: 600,
                    ease: 'Back.easeOut',
                    delay: i * 150
                });
            }
        }
    };

    this.fillDungeonRow();
}

function createCard(scene, x, y, data) {
    let container = scene.add.container(x, y);
    
    // AAA Tinting: Use the color from database.js
    let bg = scene.add.sprite(0, 0, 'card-frame').setScale(1.2);
    if (data.color) bg.setTint(data.color);
    
    let title = scene.add.text(0, 45, data.name, { 
        fontFamily: 'MedievalSharp', fontSize: '20px', color: '#ffd700', fontStyle: 'bold' 
    }).setOrigin(0.5);
    
    let stats = scene.add.text(0, 75, `ATK:${data.atk} HP:${data.hp}`, { 
        fontFamily: 'Orbitron', fontSize: '14px', color: '#ffffff' 
    }).setOrigin(0.5);

    container.add([bg, title, stats]);
    container.setSize(bg.width, bg.height).setInteractive({ draggable: true });
    
    // Deep copy data to prevent shared object bugs
    container.cardData = JSON.parse(JSON.stringify(data));
    container.isPlayerCard = true;

    scene.input.setDraggable(container);
    
    container.on('drag', (p, dragX, dragY) => {
        container.setPosition(dragX, dragY);
        container.setDepth(1000);
    });

    container.on('dragend', () => {
        container.setDepth(10);
        if (!checkFusion(scene, container)) {
            organizeHand(scene);
        }
    });

    // Auto-align hand
    scene.time.delayedCall(10, () => organizeHand(scene));
    return container;
}

function checkFusion(scene, draggedCard) {
    let targets = scene.children.list.filter(c => 
        (c.isPlayerCard || c.isEnemy) && c !== draggedCard && c.active
    );
    
    let actionTaken = false;

    for (let target of targets) {
        let dist = Phaser.Math.Distance.Between(draggedCard.x, draggedCard.y, target.x, target.y);
        
        if (dist < 70) {
            if (target.isPlayerCard) {
                performFusion(scene, draggedCard, target);
                actionTaken = true;
                break;
            } else if (target.isEnemy) {
                handleDungeonInteraction(scene, draggedCard, target);
                actionTaken = true;
                break;
            }
        }
    }
    return actionTaken;
}

function handleDungeonInteraction(scene, playerCard, dungeonCard) {
    const type = dungeonCard.cardData.type;

    if (type === 'enemy') {
        performBattle(scene, playerCard, dungeonCard);
    } else if (type === 'loot') {
        collectLoot(scene, playerCard, dungeonCard);
    } else if (type === 'hazard') {
        triggerTrap(scene, playerCard, dungeonCard);
    }
}

function performBattle(scene, player, enemy) {
    enemy.cardData.hp -= player.cardData.atk;
    scene.playerStats.hp -= enemy.cardData.atk;
    
    updateHUD(scene);
    scene.cameras.main.shake(100, 0.01);

    if (enemy.cardData.hp <= 0) {
        scene.playerStats.gold += 10;
        updateHUD(scene);
        
        enemy.destroy();
        player.destroy();
        
        scene.time.delayedCall(400, () => scene.fillDungeonRow());
    }
}

function performFusion(scene, cardA, cardB) {
    cardA.disableInteractive();
    cardB.disableInteractive();

    scene.tweens.add({
        targets: cardA,
        x: cardB.x, y: cardB.y,
        scale: 0.2, alpha: 0.5,
        duration: 250,
        onComplete: () => {
            const prefix = FUSION_NAMES.prefixes[cardA.cardData.id] || FUSION_NAMES.prefixes['hybrid'];
            const suffix = FUSION_NAMES.suffixes[cardB.cardData.id] || FUSION_NAMES.suffixes['hybrid'];
            const newName = `${prefix} ${suffix}`;
            
            // Logic: Trait Bonuses
            let bonusAtk = (cardA.cardData.traits?.includes('aggressive')) ? 5 : 0;
            let bonusHp = (cardB.cardData.traits?.includes('beast')) ? 10 : 0;

            const newStats = {
                id: 'hybrid',
                name: newName,
                atk: cardA.cardData.atk + cardB.cardData.atk + bonusAtk,
                hp: cardA.cardData.hp + cardB.cardData.hp + bonusHp,
                color: 0xffffff // Hybrids start white/neutral
            };

            cardA.destroy();
            cardB.destroy();

            let newCard = createCard(scene, cardB.x, cardB.y, newStats);
            unlockDiscovery(scene, newName.toLowerCase().replace(/\s/g, '_'), newName);
        }
    });
}

function createDungeonCard(scene, x, y, data) {
    let container = scene.add.container(x, y);
    
    // Set color based on type
    let color = data.color || 0x333333;
    let bg = scene.add.rectangle(0, 0, 100, 140, 0x1a1a1a).setStrokeStyle(3, color);
    
    let nameText = scene.add.text(0, -40, data.name.toUpperCase(), { 
        fontSize: '14px', fontFamily: 'Orbitron', color: '#ffffff' 
    }).setOrigin(0.5);
    
    let valText = "";
    let valColor = "#ffffff";

    if (data.type === 'enemy') { valText = `HP: ${data.hp}`; valColor = "#ff4b2b"; }
    else if (data.type === 'loot') { valText = `GOLD: ${data.gold}`; valColor = "#ffd700"; }
    else if (data.type === 'hazard') { valText = `DMG: ${data.damage}`; valColor = "#ff00ff"; }

    let infoText = scene.add.text(0, 20, valText, { 
        fontSize: '18px', fontFamily: 'Orbitron', color: valColor 
    }).setOrigin(0.5);
    
    container.add([bg, nameText, infoText]);
    container.cardData = JSON.parse(JSON.stringify(data));
    container.isEnemy = true; 
    
    return container;
}

function collectLoot(scene, playerCard, lootCard) {
    const goldFound = lootCard.cardData.gold || 10;
    scene.playerStats.gold += goldFound;
    
    createToast(scene, `💰 +${goldFound} Gold!`);
    updateHUD(scene);

    lootCard.destroy();
    playerCard.destroy();
    scene.time.delayedCall(400, () => scene.fillDungeonRow());
}

function triggerTrap(scene, playerCard, trapCard) {
    const dmg = trapCard.cardData.damage || 15;
    scene.playerStats.hp -= dmg;
    
    scene.cameras.main.flash(200, 150, 0, 0); 
    createToast(scene, `⚠️ TRAP! -${dmg} HP`);
    updateHUD(scene);

    trapCard.destroy();
    playerCard.destroy();
    
    if (scene.playerStats.hp <= 0) {
        alert("GAME OVER: Death by Trap");
        location.reload();
    } else {
        scene.time.delayedCall(400, () => scene.fillDungeonRow());
    }
}

function update() {}
