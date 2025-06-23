"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Composant pour dessiner les étoiles
const StarField = (props) => {
  const ref = useRef();
  const sphere = useMemo(() => {
    const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 });
    if (positions.some((v) => isNaN(v))) {
      console.warn("NaN in sphere positions. Using fallback.");
      return new Float32Array([0, 0, 0]);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Canvas qui contient le champ d’étoiles
const StarsCanvas = () => (
  <div className="w-full h-full fixed inset-0 z-[10] pointer-events-none">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarField />
        <Preload all />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
