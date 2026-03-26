# ⚡ FUSIONGOD ⚡
### A Modular AAA Dark-Fantasy Card Crawler
**Built with Phaser v3.90.0 "Tsugumi"**

---

## 🐲 The Vision
FUSIONGOD is a high-performance mobile card-merging dungeon crawler. Players must drag, drop, and fuse elemental essences to survive an ever-deepening crawl. Strategy meets alchemy in a dark-fantasy world where every fusion counts.

## 🕹️ Game Features
* **Dynamic Fusion Engine:** Combine elements (Fire, Water, Wolf) to create unique hybrids with inherited stats and traits.
* **Dungeon Crawler Interaction:** Drag cards onto **Enemies** to battle, **Gold Piles** to loot, or **Spike Traps** to sacrifice health for progress.
* **AAA Feedback Loops:** Radial background gradients, responsive "Pulse" HUD elements, and bouncy "Back.easeOut" notifications.
* **Modular Architecture:** Optimized for the **Spck Editor** workflow with a clean separation of concerns.

---

## 📂 Project Structure
The project is built using a **Modular System** to ensure scalability and easy debugging:

| File | Role | Responsibility |
| :--- | :--- | :--- |
| `index.html` | **The Skeleton** | Entry point, CDN loading, and Font-preloading. |
| `style.css` | **The Aesthetic** | Mobile-lock viewport, radial gradients, and UI shadows. |
| `database.js` | **The Brain** | Master data for Elemental stats, Fusion naming, and Dungeon encounters. |
| `ui.js` | **The Face** | Handles Toast notifications, HUD "Pulse" logic, and visual feedback. |
| `handManager.js`| **The Hands** | Manages card slot positions and automated hand reorganization. |
| `game.js` | **The Heart** | Core Phaser Engine, Combat logic, and Fusion mechanics. |

---

## 🛠️ Tech Stack
* **Engine:** [Phaser v3.90.0 (Tsugumi)](https://phaser.io/)
* **Editor:** Spck Editor (Mobile Optimized)
* **Fonts:** MedievalSharp & Orbitron via Google Fonts
* **Deployment:** Vercel / GitHub Pages

---

## 🚀 How to Play
1.  **Fuse:** Drag one Player Card onto another in your hand to create a stronger Hybrid.
2.  **Crawl:** Drag a card from your hand onto the **Dungeon Row** (top) to interact.
3.  **Survive:** Manage your HP carefully. Battles and Traps consume health, while Gold increases your score.

---

## 📈 Roadmap
- [ ] **Discovery Book:** A UI menu to track all unlocked fusions.
- [ ] **Depth Scaling:** Enemies gain +5 ATK/HP for every 5 rooms cleared.
- [ ] **Particle Overhaul:** Custom shaders for "Fire" and "Water" fusions.

---
*Created by the FUSIONGOD Team. "The God of Alchemy awaits your next move."*
