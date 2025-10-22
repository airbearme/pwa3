import React from 'react';

interface AirbearWheelProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glowing?: boolean;
  animated?: boolean;
  effectType?: 'solar' | 'eco' | string;
}

export const AirbearWheel: React.FC<AirbearWheelProps> = ({
  size = 'md',
  className = '',
  glowing = false,
  animated = false,
  effectType
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const glowClass = glowing ? 'shadow-lg shadow-primary/50' : '';

  return (
    <div className={`airbear-wheel ${sizeClasses[size]} ${glowClass} ${className}`}>
      <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-primary/80 flex items-center justify-center ${animated ? 'animate-spin' : ''}`}>
        <div className="w-1/2 h-1/2 rounded-full bg-card border border-primary/40"></div>
      </div>
    </div>
  );
};

export default AirbearWheel;
