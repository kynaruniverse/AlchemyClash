import { CardManager } from '../managers/cardManager.js';
import { DuelManager } from '../managers/duelManager.js';

export class DuelScreen extends Phaser.Scene {
    constructor() { super('DuelScreen'); }

    create() {
        // Init Managers
        this.cardMgr = new CardManager(this);
        this.duelMgr = new DuelManager();

        this.add.rectangle(180, 320, 360, 640, 0x0a0a1a);
        
        // Setup Lanes
        this.lanes = [];
        this.laneTexts = [];
        for(let i=0; i<3; i++) {
            let lane = this.add.rectangle(70 + (i * 110), 280, 100, 220, 0xffffff, 0.05).setStrokeStyle(1, 0x444444);
            lane.setData('index', i);
            this.lanes.push(lane);

            // Lane Score UI
            let scoreText = this.add.text(70 + (i * 110), 160, '0', { fontSize: '20px', fontStyle: 'bold' }).setOrigin(0.5);
            this.laneTexts.push(scoreText);
        }

        // HUD: Energy
        this.energyText = this.add.text(180, 600, this.duelMgr.playerMana, { fontSize: '28px', fontStyle: 'bold' }).setOrigin(0.5);

        // Spawn Hand from Card Manager
        for(let i=0; i<3; i++) {
            let card = this.cardMgr.createCardAt(80 + (i * 100), 500);
            card.animateIn(i * 150);
            card.setSize(80, 110).setInteractive();
            this.input.setDraggable(card);
        }

        this.setupDragEvents();
    }

    setupDragEvents() {
        this.input.on('drag', (p, obj, dx, dy) => { obj.setPosition(dx, dy); obj.setHighlight(true); });

        this.input.on('dragend', (p, obj) => {
            obj.setHighlight(false);
            let dropped = false;

            this.lanes.forEach((lane, index) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(obj.getBounds(), lane.getBounds())) {
                    // Logic: Apply power to lane
                    let power = obj.data.atk;
                    let newScore = this.duelMgr.addCardToLane(index, power);
                    this.laneTexts[index].setText(newScore);
                    
                    obj.setPosition(lane.x, lane.y);
                    obj.disableInteractive(); // Card is played
                    dropped = true;
                    this.cameras.main.shake(100, 0.005);
                }
            });

            if (!dropped) {
                this.tweens.add({ targets: obj, x: obj.input.dragStartX, y: obj.input.dragStartY, duration: 200 });
            }
        });
    }
}
