/**
 * ALCHEMY CLASH: AAA UI INTERFACE (UPGRADED)
 * Handles 2D HUD, hand layout, card slot positioning, and cinematic announcements.
 */

export class Interface {
    constructor(duel, engine) {
        this.duel = duel;
        this.engine = engine; // reference to Engine3D
        
        // Element Selection
        this.uiHub = document.getElementById('ui-container');
        this.announcerEl = null;
        this.endTurnBtn = null;
        
        // Popup management
        this.detailOverlay = document.createElement('div');
        this.detailOverlay.id = 'card-detail-popup';
        document.body.appendChild(this.detailOverlay);

        // Config
        this.handY = -6; // Snap-style hand vertical offset
        this.handSpacing = 1.8; // Distance between cards in hand
        this.maxHandSpread = 7; // Max width for hand spread

        this.init();
    }

    init() {
        this.announcerEl = document.getElementById('announcer');
        this.endTurnBtn = document.getElementById('end-turn-btn');

        if (this.endTurnBtn) {
            this.endTurnBtn.onclick = () => {
                if (!this.duel.isRevealing) {
                    if (this.duel.audio) this.duel.audio.play('CLICK', 0.4);
                    this.duel.processTurn();
                }
            };
        }
    }

    /**
     * Triggers a high-impact screen announcement (e.g., "ROUND 1", "VICTORY")
     */
    announce(text) {
        const el = this.announcerEl;
        if (!el) return;

        el.innerText = text;
        el.style.display = 'block';

        const tl = gsap.timeline();
        tl.fromTo(el, 
            { opacity: 0, scale: 0.5, y: -50 }, 
            { opacity: 1, scale: 1.2, y: 0, duration: 0.6, ease: "back.out(2)" }
        )
        .to(el, { scale: 1, duration: 0.2 })
        .to(el, 
            { opacity: 0, scale: 1.5, duration: 0.4, ease: "power2.in" }, 
            "+=1.2"
        );
    }

    /**
     * Synchronizes the 3D game state with the 2D HUD and hand layout
     */
    updateUI() {
        this.updateEnergy();
        this.updateLaneScores();
        this.updateEndTurnBtn();
        this.layoutHand();
    }

    updateEnergy() {
        const manaVal = document.getElementById('mana-value');
        if (manaVal) {
            const current = parseInt(manaVal.innerText);
            if (current !== this.duel.playerMana) {
                manaVal.innerText = this.duel.playerMana;
                this.pulseElement(manaVal.parentElement);
            }
        }
    }

    updateLaneScores() {
        this.duel.lanes.forEach((lane, i) => {
            const pScoreEl = document.getElementById(`score-${i}`);
            const eScoreEl = document.getElementById(`enemy-${i}`);
            if (pScoreEl && eScoreEl) {
                const pPow = lane.userData.pPower;
                const ePow = lane.userData.ePower;

                pScoreEl.innerText = pPow;
                eScoreEl.innerText = ePow;

                pScoreEl.classList.toggle('winning', pPow > ePow);
                eScoreEl.classList.toggle('winning', ePow > pPow);
            }
        });
    }

    updateEndTurnBtn() {
        if (!this.endTurnBtn) return;

        if (this.duel.isRevealing) {
            this.endTurnBtn.classList.add('disabled-btn');
            this.endTurnBtn.innerText = "WAITING...";
        } else {
            this.endTurnBtn.classList.remove('disabled-btn');
            this.endTurnBtn.innerText = "END TURN";
        }
    }

    /**
     * Snap-style hand layout
     */
    layoutHand() {
        const hand = this.duel.playerHand; // Array of cardObjs from Engine3D
        const n = hand.length;
        if (!n) return;

        const spread = Math.min(this.maxHandSpread, (n - 1) * this.handSpacing);
        const startX = -spread / 2;

        hand.forEach((cardObj, i) => {
            const targetX = startX + i * this.handSpacing;
            const targetY = this.handY;
            const distanceFromCenter = (i - (n - 1) / 2) * 0.05;

            cardObj.targetX = targetX;
            cardObj.targetY = targetY;
            cardObj.targetZ = 0;
            cardObj.targetRot = distanceFromCenter; // slight fan rotation
            cardObj.targetScale = 1;
        });
    }

    pulseElement(el) {
        gsap.fromTo(el, { scale: 1.4 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }

    /**
     * Detailed card inspect view
     */
    showCardDetail(cardData) {
        const hex = cardData.color.toString(16).padStart(6, '0');
        
        this.detailOverlay.innerHTML = `
            <div class="detail-card-view" style="border-top: 8px solid #${hex}">
                <div class="detail-top">
                    <span class="detail-cost">${cardData.cost}</span>
                    <span class="detail-name">${cardData.name}</span>
                </div>
                <div class="detail-art" style="background-image: url('${cardData.texture}')"></div>
                <div class="detail-desc">${cardData.desc}</div>
                <div class="detail-stats">POWER: ${cardData.atk}</div>
            </div>
        `;

        this.detailOverlay.style.display = 'flex';
        gsap.fromTo(this.detailOverlay, 
            { opacity: 0, backdropFilter: "blur(0px)" }, 
            { opacity: 1, backdropFilter: "blur(10px)", duration: 0.3 }
        );

        const close = () => {
            gsap.to(this.detailOverlay, { opacity: 0, duration: 0.2, onComplete: () => {
                this.detailOverlay.style.display = 'none';
            }});
        };

        this.detailOverlay.onclick = close;
        setTimeout(close, 3000);
    }
}