import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

interface ParticleProps {
  intensity?: 'low' | 'medium' | 'high';
}

const ParticleAnimation = ({ intensity = 'medium' }: ParticleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      fadeDirection: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.color = isDark ? '#ffffff' : '#000000';
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas!.width || this.x < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y > canvas!.height || this.y < 0) {
          this.speedY = -this.speedY;
        }

        // Random opacity changes for twinkling effect
        this.opacity += this.fadeDirection * 0.005;
        if (this.opacity >= 0.5 || this.opacity <= 0.1) {
          this.fadeDirection = -this.fadeDirection;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Set number of particles based on intensity
    const getParticleCount = () => {
      switch (intensity) {
        case 'low': return Math.floor((canvas!.width * canvas!.height) / 30000);
        case 'high': return Math.floor((canvas!.width * canvas!.height) / 10000);
        case 'medium':
        default: return Math.floor((canvas!.width * canvas!.height) / 20000);
      }
    };

    // Initialize particles
    const initParticles = () => {
      particlesArray = [];
      const particleCount = getParticleCount();
      
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate particles when resizing
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      
      // Connect particles with lines if they're close enough
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${0.2 * (1 - distance/100)})`; 
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, theme.palette.mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5
      }}
    />
  );
};

export default ParticleAnimation;