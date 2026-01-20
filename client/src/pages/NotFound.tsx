import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const useDocumentEvent = (event: string, handler: any) => {
  useEffect(() => {
    document.addEventListener(event, handler);
    return () => document.removeEventListener(event, handler);
  }, [event, handler]);
};

const useMouseParallax = (...depths: number[]) => {
  const [coords, setCoords] = useState(depths.map(() => ({ x: 0, y: 0 })));
  useDocumentEvent('mousemove', (e: MouseEvent) => {
    requestAnimationFrame(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = e.clientX / width - 0.5;
      const y = e.clientY / height - 0.5;
      setCoords(depths.map((depth) => ({
        x: depth * x,
        y: depth * y,
      })));
    });
  });
  return coords;
};

const Robot = ({ x, y, scale }: { x: number; y: number; scale: number }) => (
  <g
    style={{
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: 'center',
      transformBox: 'fill-box',
    }}
  >
    <path
      fill="#4f46e5"
      d="M160,40 h80 a20,20 0 0 1 20,20 v60 a20,20 0 0 1 -20,20 h-80 a20,20 0 0 1 -20,-20 v-60 a20,20 0 0 1 20,-20 z"
    />
    <path
      fill="#4338ca"
      d="M140,140 h120 v80 h-120 z"
    />
    <circle fill="#18181b" cx="180" cy="90" r="8" />
    <circle fill="#18181b" cx="220" cy="90" r="8" />
    <rect fill="#818cf8" x="185" y="95" width="10" height="10" rx="2" />
    <line x1="200" y1="60" x2="200" y2="40" stroke="#71717a" strokeWidth="4" />
    <circle fill="#71717a" cx="200" cy="35" r="5" />
    <path
        fill="#27272a"
        d="M120,150 h20 v40 h-20 z"
    />
    <path
        fill="#27272a"
        d="M260,150 h20 v40 h-20 z"
    />
  </g>
);

const NotFound = () => {
  const [p1, p2, p3, p4, p5, p6, p7] = useMouseParallax(-240, -150, -80, -20, 80, 150, 300);

  return (
    <div
      className="app"
      style={{
        backgroundColor: '#050509',
        width: '100vw',
        height: '100vh',
        fontFamily: "'Montserrat', sans-serif",
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        className="text-container"
        style={{
          position: 'relative',
          zIndex: 10,
          margin: '1rem 0',
          textAlign: 'center',
          pointerEvents: 'none',
          paddingBottom: '200px'
        }}
      >
        <h1
          style={{
            color: 'white',
            fontFamily: 'Pridi',
            fontSize: '5rem',
            marginBottom: '1rem',
          }}
        >
          404
        </h1>
        <p style={{ color: '#71717a', fontWeight: 500, letterSpacing: '0.05rem', margin: '0.5rem 0' }}>
          Oops! This page has gone into maintenance mode.
        </p>
        <p style={{ color: '#71717a', fontWeight: 500, letterSpacing: '0.05rem', margin: '0.5rem 0' }}>
          You can{' '}
          <Link to="/" style={{ color: '#818cf8', pointerEvents: 'auto', textDecoration: 'none' }}>
            go back home
          </Link>
          , or{' '}
          <a href="#" style={{ color: '#818cf8', pointerEvents: 'auto', textDecoration: 'none' }}>
            report an issue
          </a>
          .
        </p>
      </div>

      <svg
        viewBox="0 0 2000 720"
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#050509',
        }}
        preserveAspectRatio="xMidYMax meet"
      >
        <path
          style={{ transform: `translate(${p3.x}px,${p3.y}px)` }}
          strokeWidth={5}
          stroke="#18181b"
          fill="#27272a"
          d="m1831 198l-8 565l-95 3v-576.3zm-441-42v633.1h-257v-622.1zm-340 36v597.3h-201.7v-596.3zm-246 20v531.7h-53v-534.7zm-136-20v575.1h-153.4v-576.3zm-348 3v574.7h-159v-566.8z"
        />
        <path
          style={{ transform: `translate(${p3.x}px,${p3.y}px)` }}
          fill="#09090b"
          d="m-203.5 227v-467.6h2433.1v553.6l-399.6-71l-102 29l-335-76l-258 80l-85-30l-202 32l-45-35l-50 19l-84-35l-154 61l-194-58l-160 58z"
        />

        <path
          style={{ transform: `translate(${p3.x}px,${p3.y}px)`, filter: 'blur(80px)' }}
          fill="#818cf8"
          opacity="0.08"
          d="m-300,400 H2400 V700 H0 z"
        />
        
        <text
          style={{ transform: `translate(${p4.x}px,${p4.y}px)` }}
          x="1000"
          y="550"
          textAnchor="middle"
          fill="#3f3f46"
          fontSize="660px"
          fontWeight="800"
          filter="drop-shadow(0 0 50px #18181b)"
        >
          404
        </text>
        
        <path
          style={{ transform: `translate(${p5.x}px,${p5.y}px)` }}
          fill="#27272a"
          stroke="#18181b"
          strokeWidth={5}
          d="m2195 396v531.1h-2437.2v-538.1l359.2 60l96-22l63 44l169-40l83 39l348-47l147 28l125-32l75 47l75-21l221 28l263-75l109 31z"
        />
        
        <g style={{ transform: `translate(${p5.x}px,${p5.y}px)` }}>
          <Robot x={100} y={120} scale={0.45} />
          <Robot x={900} y={140} scale={0.5} />
          <Robot x={1600} y={120} scale={0.45} />
        </g>

        <g style={{ transform: `translate(${p6.x}px,${p6.y}px)`, filter: 'blur(5px) brightness(0.7)' }}>
          <Robot x={300} y={200} scale={0.55} />
          <Robot x={1200} y={250} scale={0.5} />
        </g>
        
        <g style={{ transform: `translate(${p7.x}px,${p7.y}px)`, filter: 'blur(10px) brightness(0.5)' }}>
          <Robot x={500} y={350} scale={0.6} />
          <Robot x={1400} y={380} scale={0.65} />
        </g>
      </svg>
    </div>
  );
};

export default NotFound;
