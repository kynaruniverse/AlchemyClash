// ============================================================
// ALCHEMY CLASH — Title Screen (REBORN 2.0)
// Bold, game-first, high clarity UI + ambient particles
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

const BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/alchemy-hero-bg-fbv5NSHYwxEPjjcv55cZtK.webp";

interface DustParticleProps {
  style: React.CSSProperties;
}

function DustParticle({ style }: DustParticleProps): JSX.Element {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 4,
        height: 4,
        background: "rgba(212, 168, 67, 0.6)",
        animation: `dust-float ${3 + Math.random() * 4}s ease-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        ...style,
      }}
    />
  );
}

interface ModeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
}

function ModeCard({ title, subtitle, icon, onClick, primary = false }: ModeCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl p-5 flex flex-col gap-2"
      style={{
        background: primary
          ? "linear-gradient(135deg, #d4a843, #b8892f)"
          : "rgba(255, 255, 255, 0.05)",
        border: primary
          ? "1px solid rgba(212, 168, 67, 0.6)"
          : "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: primary
          ? "0 0 35px rgba(212, 168, 67, 0.5)"
          : "0 4px 14px rgba(0, 0, 0, 0.3)",
      }}
      aria-label={title}
      role="button"
      tabIndex={0}
    >
      <div className="text-3xl md:text-4xl">{icon}</div>
      <div className="font-bold text-sm md:text-base" style={{ fontFamily: "'Cinzel'" }}>
        {title}
      </div>
      <div className="text-xs md:text-sm opacity-70">{subtitle}</div>
    </motion.div>
  );
}

export default function TitleScreen(): JSX.Element {
  const { setScreen, state } = useGame();
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${20 + Math.random() * 60}%`,
    }))
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BG})`,
          filter: "brightness(0.35) contrast(1.1) saturate(1.2)",
        }}
      />

      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Particles */}
      {particles.map((particle) => (
        <DustParticle key={particle.id} style={{ left: particle.left, top: particle.top }} />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "'Cinzel Decorative'", color: "#d4a843" }}
            >
              Alchemy Clash
            </h1>
            <p className="text-xs md:text-sm opacity-60 mt-1">
              Forge elements. Build power. Win battles.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-xs md:text-sm">
            <div className="px-2 py-1 rounded-md bg-black/40 border border-yellow-600/50 flex flex-col items-center">
              <div>⚗️</div>
              <div>{state.totalDiscoveries}</div>
            </div>
            <div className="px-2 py-1 rounded-md bg-black/40 border border-red-600/50 flex flex-col items-center">
              <div>⚔️</div>
              <div>{state.battlesWon}</div>
            </div>
            <div className="px-2 py-1 rounded-md bg-black/40 border border-blue-400/50 flex flex-col items-center">
              <div>✨</div>
              <div>{state.essence}</div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ModeCard
              title="Start Fusion"
              subtitle="Discover new elements"
              icon="⚗️"
              primary
              onClick={() => setScreen("fusion")}
            />
          </div>

          <ModeCard
            title="Alchemy Book"
            subtitle="View discoveries"
            icon="📖"
            onClick={() => setScreen("book")}
          />

          <ModeCard
            title="Deck Builder"
            subtitle="Build your strategy"
            icon="🃏"
            onClick={() => setScreen("deck")}
          />

          <ModeCard
            title="Battle"
            subtitle="Test your deck"
            icon="⚔️"
            onClick={() => setScreen("battle")}
          />
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 text-center text-xs md:text-sm opacity-40"
        >
          Alchemy Clash • Prototype
        </motion.div>
      </div>
    </div>
  );
}