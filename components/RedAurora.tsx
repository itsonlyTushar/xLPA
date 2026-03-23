"use client";

import { motion } from "framer-motion";

export const RedAurora = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
      {/* Deep Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,0,0,0.1),transparent_80%)]" />

      {/* Aurora Layer 1 - Large Slow Flow */}
      <motion.div
        animate={{
          x: [-150, 150, -150],
          y: [-80, 80, -80],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[30%] -left-[20%] w-[140%] h-[100%] bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1),transparent_65%)] blur-[120px]"
      />

      {/* Aurora Layer 2 - Complementary Flow */}
      <motion.div
        animate={{
          x: [150, -150, 150],
          y: [80, -80, 80],
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-[30%] -right-[20%] w-[140%] h-[100%] bg-[radial-gradient(ellipse_at_center,rgba(180,20,20,0.08),transparent_65%)] blur-[140px]"
      />

      {/* Dynamic Moving Streaks - Vertical/Diagonal "Shimmer" */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ["-50%", "150%"],
              opacity: [0, 0.8, 0],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "easeInOut",
            }}
            className="absolute h-px w-[80%] bg-gradient-to-r from-transparent via-red-500 to-transparent blur-[2px]"
            style={{
              top: `${15 * i}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
