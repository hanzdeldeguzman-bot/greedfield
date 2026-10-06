import React from "react";

export const BackgroundPolygons: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Deep Teal Radial Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 40% 45%, #183e3c 0%, #0d2726 45%, #071716 100%)",
        }}
      />

      {/* Atmospheric Ambient Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-glow"
        style={{
          background: "radial-gradient(circle, #2dd4bf 0%, #0d9488 40%, transparent 70%)",
          left: "25%",
          top: "30%",
        }}
      />

      {/* Low-Poly Faceted Triangular Backdrop Mesh */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Shading Gradients */}
          <linearGradient id="polyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e4e4a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0d2827" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="polyGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#286864" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1f1e" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="polyGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#143e3c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#071a19" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="crystalFace1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="crystalFace2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="crystalFace3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Large Backdrop Polygon Facets */}
        <polygon points="0,0 720,0 480,450 0,380" fill="url(#polyGrad1)" />
        <polygon points="720,0 1440,0 1100,500 480,450" fill="url(#polyGrad2)" />
        <polygon points="0,380 480,450 200,900 0,900" fill="url(#polyGrad3)" />
        <polygon points="480,450 1100,500 800,900 200,900" fill="url(#polyGrad1)" />
        <polygon points="1100,500 1440,0 1440,900 800,900" fill="url(#polyGrad2)" />

        {/* Facet Edge Light Rays */}
        <line x1="0" y1="380" x2="480" y2="450" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="480" y1="450" x2="1100" y2="500" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <line x1="480" y1="450" x2="200" y2="900" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <line x1="1100" y1="500" x2="800" y2="900" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      </svg>

      {/* Floating 3D Geometric Crystal (Icosahedron/Prism) in Center Left */}
      <div className="absolute left-[38%] top-[38%] -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] animate-crystal opacity-85">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(45,212,191,0.25)]">
          {/* Facets */}
          {/* Top center face */}
          <polygon points="100,20 150,65 100,85" fill="url(#crystalFace1)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <polygon points="100,20 50,65 100,85" fill="url(#crystalFace2)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          
          {/* Middle left faces */}
          <polygon points="50,65 20,115 70,135" fill="url(#crystalFace3)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
          <polygon points="50,65 100,85 70,135" fill="url(#crystalFace1)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          
          {/* Center faces */}
          <polygon points="100,85 150,65 140,135" fill="url(#crystalFace2)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <polygon points="100,85 70,135 100,165" fill="url(#crystalFace3)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
          <polygon points="100,85 140,135 100,165" fill="url(#crystalFace1)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          
          {/* Right side faces */}
          <polygon points="150,65 180,115 140,135" fill="url(#crystalFace3)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
          
          {/* Bottom points */}
          <polygon points="70,135 20,115 55,175" fill="url(#crystalFace2)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <polygon points="70,135 100,165 55,175" fill="url(#crystalFace1)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
          <polygon points="140,135 100,165 145,175" fill="url(#crystalFace2)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
          <polygon points="140,135 180,115 145,175" fill="url(#crystalFace3)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <polygon points="55,175 100,165 100,195" fill="url(#crystalFace3)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <polygon points="145,175 100,165 100,195" fill="url(#crystalFace1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
};
