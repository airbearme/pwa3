import React from 'react';

interface RickshawWheelProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glowing?: boolean;
  animated?: boolean;
  effect?: 'fire' | 'neon' | 'holographic' | 'plasma' | 'solar';
}

const RickshawWheel: React.FC<RickshawWheelProps> = ({
  size = 'md',
  className = '',
  glowing = false,
  animated = false,
  effect,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const effectClasses = {
    fire: 'animate-rolling-fire',
    neon: 'animate-neon-glow',
    holographic: 'airbear-holographic',
    plasma: 'airbear-plasma',
    solar: 'airbear-solar-rays',
  };

  const animationClass = animated ? 'animate-spin-slow' : '';
  const glowClass = glowing ? 'animate-pulse-glow' : '';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`absolute inset-0 rounded-full ${effect ? effectClasses[effect] : ''}`}></div>
      <div className={`relative w-full h-full rounded-full border-2 border-primary/50 flex items-center justify-center ${animationClass} ${glowClass}`}>
        <div className="absolute w-full h-full rounded-full border-2 border-primary/30 transform rotate-45"></div>
        <div className="w-1/2 h-1/2 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
          🐻
        </div>
      </div>
    </div>
  );
};

export const AirbearWheel = RickshawWheel;
export default RickshawWheel;
