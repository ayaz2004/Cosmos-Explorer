import { useMemo } from 'react';

function generateStars(count, layer) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = layer === 'near' ? Math.random() * 3 + 1.5
               : layer === 'mid'  ? Math.random() * 2 + 0.8
               :                    Math.random() * 1.5 + 0.3;

    const duration = layer === 'near' ? Math.random() * 3 + 2
                   : layer === 'mid'  ? Math.random() * 4 + 3
                   :                    Math.random() * 5 + 4;

    stars.push({
      id: `${layer}-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size,
      duration,
      delay: Math.random() * duration,
      opacity: layer === 'near' ? 0.9 : layer === 'mid' ? 0.6 : 0.35,
    });
  }
  return stars;
}

export default function Starfield() {
  const nearStars = useMemo(() => generateStars(40, 'near'), []);
  const midStars = useMemo(() => generateStars(60, 'mid'), []);
  const farStars = useMemo(() => generateStars(80, 'far'), []);
  const shootingStars = useMemo(() => generateStars(6, 'near'), []);

  const allStars = [...farStars, ...midStars, ...nearStars];

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Nebula gradient overlays */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          top: '10%',
          right: '-10%',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, transparent 70%)',
          top: '50%',
          left: '40%',
          filter: 'blur(100px)',
        }}
      />

      {/* Stars */}
      {allStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.size > 2
              ? 'radial-gradient(circle, #fff 0%, rgba(147, 197, 253, 0.8) 50%, transparent 100%)'
              : '#d4d4ff',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite, star-drift ${star.duration * 5}s linear ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <span
          key={`shoot-${star.id}`}
          className="absolute block rounded-full"
          style={{
            left: `${Math.random() * 85}%`,
            top: `${Math.random() * 45}%`,
            width: '2px',
            height: '2px',
            background: '#ffffff',
            boxShadow: '0 0 8px rgba(125, 211, 252, 0.85)',
            animation: `shooting-star ${12 + Math.random() * 8}s linear ${star.delay * 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
