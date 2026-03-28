// ============================================================
// ALCHEMY CLASH — Discovery Toast
// Shows animated notification when a new element is discovered
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { getElementById, getColor } from "@/lib/gameData";

export default function DiscoveryToast(): JSX.Element | null {
  const { state, clearNewDiscovery } = useGame();
  const [visible, setVisible] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState<string | null>(null);

  useEffect(() => {
    if (state.newDiscovery) {
      setCurrentDiscovery(state.newDiscovery);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearNewDiscovery();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.newDiscovery, clearNewDiscovery]);

  const element = currentDiscovery ? getElementById(currentDiscovery) : null;
  if (!element) return null;

  const colors = getColor(element.id);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-16 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(20,10,0,0.92)",
            border: `1.5px solid ${colors.glow}66`,
            boxShadow: `0 0 30px ${colors.glow}44, 0 8px 24px rgba(0,0,0,0.4)`,
            backdropFilter: "blur(8px)",
            minWidth: 220,
          }}
          aria-live="polite"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${colors.glow}55, ${colors.bg})`,
              border: `1.5px solid ${colors.glow}`,
              boxShadow: `0 0 12px ${colors.glow}66`,
            }}
          >
            {element.emoji}
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "#d4a843",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              ✦ New Discovery!
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.85rem",
                color: "rgba(245,230,200,0.95)",
                fontWeight: 700,
              }}
            >
              {element.name}
            </div>
            {element.isCard && (
              <div
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.6rem",
                  color: "rgba(212,168,67,0.7)",
                  fontStyle: "italic",
                }}
              >
                🃏 Battle card unlocked!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}