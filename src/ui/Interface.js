/**
 * ALCHEMY CLASH: AAA UI INTERFACE
 * Handles the 2D HUD layer, Score Tracking, and Cinematic Announcements.
 */

export class Interface {
    constructor(duel) {
        this.duel = duel;
        
        // Element Selection
        this.uiHub = document.getElementById('ui-container');
        this.announcerEl = null;
        this.endTurnBtn = null;
        
        // Popup management
        this.detailOverlay = document.createElement('div');
        this.detailOverlay.id = 'card-detail-popup';
        document.body.appendChild(this.detailOverlay);

        this.init();
    }

    init() {
        // Find elements injected by GameBootstrapper
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
        const el = document.getElementById('announcer');
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
     * Synchronizes the 3D game state with the 2D HUD
     */
    updateUI() {
        // 1. Update Energy (Mana)
        const manaVal = document.getElementById('mana-value');
        if (manaVal) {
            const current = parseInt(manaVal.innerText);
            if (current !== this.duel.playerMana) {
                manaVal.innerText = this.duel.playerMana;
                this.pulseElement(manaVal.parentElement);
            }
        }

        // 2. Update Lane Scores & Winning Status
        this.duel.lanes.forEach((lane, i) => {
            const pScoreEl = document.getElementById(`score-${i}`);
            const eScoreEl = document.getElementById(`enemy-${i}`);

            if (pScoreEl && eScoreEl) {
                const pPow = lane.userData.pPower;
                const ePow = lane.userData.ePower;

                // Sync Text
                pScoreEl.innerText = pPow;
                eScoreEl.innerText = ePow;

                // Visual Priority: Who is winning this lane?
                pScoreEl.classList.toggle('winning', pPow > ePow);
                eScoreEl.classList.toggle('winning', ePow > pPow);
                
                // Pulse on change
                if (pPow > 0) pScoreEl.style.opacity = "1";
                if (ePow > 0) eScoreEl.style.opacity = "1";
            }
        });

        // 3. Update Button State
        if (this.endTurnBtn) {
            if (this.duel.isRevealing) {
                this.endTurnBtn.classList.add('disabled-btn');
                this.endTurnBtn.innerText = "WAITING...";
            } else {
                this.endTurnBtn.classList.remove('disabled-btn');
                this.endTurnBtn.innerText = "END TURN";
            }
        }
    }

    /**
     * AAA Feedback: Makes a UI element "pop"
     */
    pulseElement(el) {
        gsap.fromTo(el, { scale: 1.4 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }

    /**
     * Shows a detailed card inspect view
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
