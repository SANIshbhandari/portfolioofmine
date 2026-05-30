import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CanvasErrorBoundary from '../components/CanvasErrorBoundary';

function FloatingScene() {
  const meshRef = useRef();
  const torusRef = useRef();
  const count = 500;
  
  // Temp Object3D for instanced matrix calculations
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  // Set up 500 particles with initial positions, velocities, rotation speeds, and scales
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 6 - 2; // Keep them slightly behind the text layer
      
      list.push({
        position: new THREE.Vector3(x, y, z),
        baseX: x, // Retain original X for spring restore physics
        velocity: new THREE.Vector3(0, Math.random() * 0.015 + 0.005, 0), // Upward drift speed
        rotation: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale: Math.random() * 0.6 + 0.4,
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Project pointer position (-1 to 1) onto our 3D bounds (approx -8x6 viewport size at z=0)
    const mx = state.pointer.x * 8;
    const my = state.pointer.y * 6;

    particles.forEach((p, i) => {
      // 1. Apply Upward Drift
      p.position.y += p.velocity.y;
      
      // Wrap particles around from top to bottom
      if (p.position.y > 8) {
        p.position.y = -8;
        p.position.x = (Math.random() - 0.5) * 16;
        p.baseX = p.position.x;
      }
      
      // 2. Mouse Repulsion and Spring Return Physics
      const dx = p.position.x - mx;
      const dy = p.position.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 2.5;

      if (dist < repulsionRadius && dist > 0.1) {
        // Force increases as cursor gets closer
        const force = (1 - dist / repulsionRadius) * 0.12;
        const pushX = (dx / dist) * force;
        const pushY = (dy / dist) * force;
        
        p.position.x += pushX;
        p.position.y += pushY;
      } else {
        // Gentle spring force returning particles back to their original X tracks
        const springK = 0.025;
        const springForce = (p.baseX - p.position.x) * springK;
        p.position.x += springForce;
      }

      // 3. Apply Rotation
      p.rotation.add(p.rotSpeed);

      // 4. Set Instance Matrix
      tempObject.position.copy(p.position);
      tempObject.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
      tempObject.scale.set(p.scale, p.scale, p.scale);
      tempObject.updateMatrix();
      
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Slow rotational drift of background Torus Knot
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.04;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <group>
      {/* Background Torus Knot Wireframe (color-split highlight magenta) */}
      <mesh ref={torusRef} position={[0, 0, -8]}>
        <torusKnotGeometry args={[3.2, 0.9, 120, 16]} />
        <meshBasicMaterial
          wireframe
          color="#FF00FF"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* 500 Cyan Floating Icosahedrons */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial
          color="#00FFFF"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

export default function ParticleField() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <CanvasErrorBoundary silent overlay height="100%">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          {/* Subtle fog effect to fade particles out in the distance */}
          <fog attach="fog" args={['#020408', 5, 14]} />
          
          <ambientLight intensity={0.5} />
          <FloatingScene />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
