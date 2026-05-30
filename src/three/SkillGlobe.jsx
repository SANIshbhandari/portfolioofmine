import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { allSkillNames } from '../data/skills';

function SkillWord({ text, position, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.22}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

function Globe() {
  const groupRef = useRef();

  const words = useMemo(() => {
    const colors = ['#00FFFF', '#FF00FF', '#00FF99', '#0088FF', '#FF6600', '#FFFF00'];
    const items = [];
    const radius = 3;
    const count = allSkillNames.length;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = ((Math.PI * (1 + Math.sqrt(5))) * i);

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      items.push({
        text: allSkillNames[i],
        position: [x * radius, y * radius, z * radius],
        color: colors[i % colors.length],
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.8, 20, 20]} />
        <meshBasicMaterial
          wireframe
          color="#00FFFF"
          transparent
          opacity={0.05}
        />
      </mesh>

      {words.map((word, i) => (
        <SkillWord key={i} {...word} />
      ))}
    </group>
  );
}

export default function SkillGlobe() {
  return (
    <div style={{ width: '100%', height: '450px' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
