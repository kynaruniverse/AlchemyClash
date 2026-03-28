// ============================================================
// ALCHEMY CLASH — 404 Not Found Screen (REBORN)
// Bold, game-first, high clarity UI
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

interface DustParticleProps {
  style: React.CSSProperties;
}

function DustParticle({ style }: DustParticleProps): JSX.Element {
  const width = 3 + Math.random() * 2;
  const height = 3 + Math.random() * 2;
  const animationDuration = 3 + Math.random() * 4;

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width,
        height,
        background: "rgba(212, 168, 67, 0.6)",
        animation: `dust-float ${animationDuration}s ease-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        ...style,
      }}
    />
  );
}

export default function NotFound(): JSX.Element {
  const [, setLocation] = useLocation();
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80}%`,
    }))
  );

  const handleGoHome = () => setLocation("/");

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Particles */}
      {particles.map((particle) => (
        <DustParticle key={particle.id} style={{ left: particle.left, top: particle.top }} />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Animated Alert Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-6 relative"
          aria-label="Error icon"
        >
          <div className="absolute inset-0 bg-red-600 rounded-full opacity-30 animate-pulse blur-sm" />
          <AlertCircle className="relative w-16 h-16 text-red-400" aria-hidden="true" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl md:text-7xl font-bold text-yellow-400 mb-2"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl md:text-3xl font-semibold text-white/80 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-white/60 mb-8 leading-relaxed max-w-md"
        >
          The page you are looking for doesn’t exist.
          <br />
          It may have been moved or deleted, or you typed the URL wrong.
        </motion.p>

        {/* Go Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 text-xs text-yellow-300/40"
        >
          Alchemy Clash • Prototype
        </motion.div>
      </div>
    </div>
  );
}