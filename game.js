const ELEMENT_DATA = {
    'fire': { name: 'Fire', color: 0xff4500, traits: ['aggressive', 'hot'], power: 10 },
    'water': { name: 'Water', color: 0x1e90ff, traits: ['fluid', 'cold'], power: 8 },
    'wolf': { name: 'Wolf', color: 0x8b4513, traits: ['beast', 'fast'], power: 12 },
    // We will add hundreds more later!
};


const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 450,
        height: 800
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    // Assets for our AAA Fantasy look
    this.load.image('card-frame', 'https://labs.phaser.io/assets/sprites/cardBack_red.png');
    this.load.image('fire', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
    this.load.image('wolf', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Placeholder for beast
}

function create() {
    console.log("FUSIONGOD Initialized...");
    
    // 1. Create the Hand Area
    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);
    
    // 2. Spawn two initial cards to test fusion
    this.card1 = createCard(this, 150, 700, { id: 'fire', name: 'FIRE', atk: 10, hp: 5 });
    this.card2 = createCard(this, 300, 700, { id: 'wolf', name: 'WOLF', atk: 8, hp: 12 });
}

function createCard(scene, x, y, data) {
    let container = scene.add.container(x, y);
    
    let bg = scene.add.sprite(0, 0, 'card-frame').setScale(1.2);
    let title = scene.add.text(0, 45, data.name, { 
        fontFamily: 'MedievalSharp', fontSize: '22px', color: '#ffd700' 
    }).setOrigin(0.5);
    
    let stats = scene.add.text(0, 75, `ATK:${data.atk} HP:${data.hp}`, {
        fontFamily: 'Orbitron', fontSize: '14px', color: '#ffffff'
    }).setOrigin(0.5);

    container.add([bg, title, stats]);
    container.setSize(bg.width, bg.height);
    container.setInteractive({ draggable: true });
    
    // Data for fusion logic
    container.cardData = data;

    scene.input.setDraggable(container);
    
    // Drag Events
    container.on('drag', (pointer, dragX, dragY) => {
        container.setPosition(dragX, dragY);
        container.setDepth(100);
    });

    container.on('dragend', (pointer) => {
        container.setDepth(0);
        checkFusion(scene, container);
    });

    return container;
}

function checkFusion(scene, draggedCard) {
    // 1. Find all other cards on the screen
    let cards = scene.children.list.filter(child => child instanceof Phaser.GameObjects.Container && child !== draggedCard);

    cards.forEach(targetCard => {
        // 2. Check if the two cards are overlapping
        let distance = Phaser.Math.Distance.Between(draggedCard.x, draggedCard.y, targetCard.x, targetCard.y);

        if (distance < 50) {
            console.log("FUSION TRIGGERED!");
            performFusion(scene, draggedCard, targetCard);
        }
    });
}

function performFusion(scene, cardA, cardB) {
    // Combine Traits (The Animash Logic)
    const newName = `GHOST ${cardB.cardData.name}`; // Temporary naming logic
    const combinedAtk = cardA.cardData.atk + cardB.cardData.atk;
    const combinedHp = cardA.cardData.hp + cardB.cardData.hp;

    // Create the "AAA" Fusion Effect (Sparkles!)
    let emitter = scene.add.particles(cardB.x, cardB.y, 'fire', {
        speed: 100,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 500
    });
    
    // Destroy the old cards
    cardA.destroy();
    cardB.destroy();

    // Spawn the NEW powerful card
    createCard(scene, 225, 700, { 
        name: newName, 
        atk: combinedAtk, 
        hp: combinedHp 
    });
    
    // Stop the sparkles after a second
    scene.time.delayedCall(1000, () => emitter.destroy());
}


function update() {}
