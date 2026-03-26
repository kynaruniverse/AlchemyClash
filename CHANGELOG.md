# FUSIONGOD Changelog

## [Unreleased] - 2026-03-26
### Added
- Full modular architecture (EventBus + Managers + Card class)
- Object pooling foundation + robust null checks
- ParticleSystem + screen shake + haptic feedback
- Auto-save / load system with error handling
- Onboarding toasts + first-time player guidance
- Clean data files (elements, dungeon, fusions, Constants)

### Changed
- Migrated from global scripts to full ES6 modules + folders
- Replaced duplicated card creation with reusable Card class
- All systems now communicate exclusively via EventBus

### Fixed
- CORS image loading issues
- Import/module errors on Vercel
- White-screen crashes on mobile

---

## [0.1.0] - 2026-03 (Initial Prototype)
- Basic drag-and-drop fusion + dungeon crawler