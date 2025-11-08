import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}

function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    const colors = ["#10b981", "#84cc16", "#f59e0b", "#22c55e"];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
          }}
          animate={{
            y: [-20, 20, -20],
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function SolarWindParticles() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`solar-${i}`}
          className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}

function ShootingStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute h-1 w-20 bg-gradient-to-r from-white to-transparent"
          style={{
            left: '-20%',
            top: `${star.y}%`,
            transform: `rotate(-25deg)`
          }}
          animate={{
            x: ['0%', '120vw'],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}


function GlowingEmbers() {
  const embers = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <>
      {embers.map((ember) => (
        <motion.div
          key={`ember-${ember.id}`}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: ember.size,
            height: ember.size,
            background: 'rgba(255, 165, 0, 0.8)',
            boxShadow: '0 0 10px 5px rgba(255, 165, 0, 0.5)',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ember.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export default function ParticleSystem() {
  return (
    <div className="particle-system fixed inset-0 z-0 pointer-events-none">
      <FloatingParticles />
      <SolarWindParticles />
      <ShootingStars />
      <GlowingEmbers />
    </div>
  );
}
