/**
 * ALCHEMY CLASH: UI INTERFACE
 * Manages the 2D HUD, Round Announcements, and Score Synchronization.
 */

export class Interface {
    constructor(duel) {
        this.duel = duel;
        this.endTurnBtn = document.getElementById('end-turn-btn');
        this.announcerEl = document.getElementById('announcer');
        
        // Detail Overlay Elements
        this.detailOverlay = document.createElement('div');
        this.detailOverlay.id = 'card-detail-popup';
        document.body.appendChild(this.detailOverlay);

        this.init();
    }


    init() {
        // Bind the End Turn button to the logic engine
        if (this.endTurnBtn) {
            this.endTurnBtn.onclick = () => {
                if (!this.duel.isRevealing) {
                    this.duel.processTurn();
                }
            };
        }
        
        // Initial match start announcement
        this.announce("ROUND 1");
    }

    /**
     * Triggers a cinematic text overlay (VICTORY, DEFEAT, ROUND X)
     * @param {string} text - The message to display
     */
    announce(text) {
        if (!this.announcerEl) return;

        this.announcerEl.innerText = text;

        // AAA Animation: Fade in, stay, then fade out with scale
        const tl = gsap.timeline();
        tl.fromTo(this.announcerEl, 
            { opacity: 0, scale: 0.8, y: 20 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        )
        .to(this.announcerEl, 
            { opacity: 0, scale: 1.2, duration: 0.4, ease: "power2.in" }, 
            "+=1.5" // Hold for 1.5 seconds
        );
    }

    /**
     * Syncs the 3D Lane data and Player Mana with the HTML HUD
     */
    updateUI() {
        // 1. Update Mana/Energy Hex
        const manaVal = document.getElementById('mana-value');
        if (manaVal) {
            manaVal.innerText = this.duel.playerMana;
            
            // Visual feedback: If out of mana, dim the hex slightly
            const hex = document.querySelector('.mana-hex');
            if (hex) hex.style.opacity = this.duel.playerMana === 0 ? "0.5" : "1";
        }

        // 2. Update Lane Scores (Player and Enemy)
        this.duel.lanes.forEach((lane, i) => {
            const pScoreEl = document.getElementById(`score-${i}`);
            const eScoreEl = document.getElementById(`enemy-${i}`);

            if (pScoreEl && eScoreEl) {
                // If power changed, add a little "pulse" animation
                if (pScoreEl.innerText != lane.userData.pPower) {
                    this.pulseElement(pScoreEl);
                }
                if (eScoreEl.innerText != lane.userData.ePower) {
                    this.pulseElement(eScoreEl);
                }

                pScoreEl.innerText = lane.userData.pPower;
                eScoreEl.innerText = lane.userData.ePower;
            }
        });

        // 3. Control End Turn Button state
        if (this.endTurnBtn) {
            if (this.duel.isRevealing) {
                this.endTurnBtn.style.opacity = "0.5";
                this.endTurnBtn.style.pointerEvents = "none";
                this.endTurnBtn.innerText = "WAITING...";
            } else {
                this.endTurnBtn.style.opacity = "1";
                this.endTurnBtn.style.pointerEvents = "auto";
                this.endTurnBtn.innerText = "END TURN";
            }
        }
    }

    /**
     * Small UI polish: Makes a HUD element "pop" when data changes
     */
    pulseElement(el) {
        gsap.fromTo(el, { scale: 1.3 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    }

    /**
     * Displays a full-screen cinematic preview of a card's stats and lore
     */
    showCardDetail(cardData) {
        this.detailOverlay.innerHTML = `
            <div class="detail-content">
                <div class="detail-header">
                    <span class="detail-name">${cardData.name}</span>
                    <span class="detail-cost">${cardData.cost}⚡</span>
                </div>
                <div class="detail-body">
                    <p class="detail-desc">${cardData.desc || "A mysterious alchemical force."}</p>
                    <div class="detail-stats">POWER: ${cardData.atk}</div>
                </div>
            </div>
        `;

        this.detailOverlay.style.display = 'flex';
        gsap.fromTo(this.detailOverlay, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });

        // Auto-hide after 2 seconds or on click
        const hide = () => {
            gsap.to(this.detailOverlay, { opacity: 0, duration: 0.2, onComplete: () => {
                this.detailOverlay.style.display = 'none';
            }});
            this.detailOverlay.removeEventListener('click', hide);
        };
        this.detailOverlay.addEventListener('click', hide);
        setTimeout(hide, 2500);
    }
}

