import React from "react";

interface EMSLogoProps {
  size?: number;
  className?: string;
}

export const EMSLogo: React.FC<EMSLogoProps> = ({ size = 96, className = "" }) => {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center p-1 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border border-white/40 shadow-[0_0_20px_rgba(45,212,191,0.3)] bg-gradient-to-br from-white/20 to-teal-900/40 backdrop-blur-md" />
      
      {/* Inner Swirl SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 p-2 transform hover:rotate-45 transition-transform duration-700 ease-out"
      >
        <defs>
          <linearGradient id="tealGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="tealGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#14b8a6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#042f2e" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Dynamic Stylized "G" / Swirl Emblem */}
        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Outer Swirl Ribbon */}
        <path
          d="M 50 12 
             C 72 12, 88 28, 88 50 
             C 88 72, 70 88, 48 88 
             C 26 88, 14 70, 14 50 
             C 14 36, 24 24, 38 18
             C 44 15, 52 18, 54 24
             C 56 30, 50 36, 44 38
             C 32 42, 26 50, 26 60
             C 26 72, 36 80, 50 80
             C 66 80, 78 68, 78 50
             C 78 36, 68 26, 54 26"
          stroke="url(#tealGrad1)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Inner Curved Arc */}
        <path
          d="M 38 34 
             C 56 22, 76 34, 76 50 
             C 76 64, 64 74, 52 74 
             C 42 74, 34 66, 34 54 
             C 34 44, 46 42, 54 48
             C 62 54, 58 64, 50 64"
          stroke="url(#tealGrad2)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Center Glow Node */}
        <circle cx="50" cy="50" r="5" fill="url(#glowGrad)" />
      </svg>
    </div>
  );
};
