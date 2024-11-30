import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html, PerspectiveCamera, Environment } from '@react-three/drei';

import * as THREE from 'three';

import tunnel from 'tunnel-rat';
import Hotspot from './assets/hotspot';

const status = tunnel();

export default function App() {
  // Toggle the visibility of the Product component when hotspot is clicked
  const handleHotspotClick = () => {
    alert("Hotspot clicked!");
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        gl={{
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.AgxToneMapping,
          toneMappingExposure: 1, // Adjust exposure for desired brightness
        }}
      >
        <PerspectiveCamera makeDefault fov={55} position={[0, 0.5, 3]} />
        <ambientLight intensity={1} color="white" />

        <group position={[0, -3, -3]}>
          <Suspense fallback={null}>
            <Model url='./assets/source/02.glb' onHotspotClick={handleHotspotClick} />
          </Suspense>
          <Environment files="./envy.hdr" />
        </group>

        <OrbitControls
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          enableDamping={true}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}

function Model({ url, onHotspotClick, ...props }) {
  const { scene, animations } = useGLTF(url); // Load the model and animations
  const { actions, mixer } = useAnimations(animations, scene); // Set up animations

  // Play the animation on load
  useState(() => {
    if (actions && actions[Object.keys(actions)[0]]) {
      actions[Object.keys(actions)[0]].play(); // Play the first animation in the GLB
    }
  }, [actions]);

  // Find the Shirt object
  const shirtObject = scene.getObjectByName('Plant004');

  return (
    <>
      <primitive object={scene} {...props} />

      {/* Hotspot for Shirt */}
      {shirtObject && (
        <mesh
          position={new THREE.Vector3().setFromMatrixPosition(shirtObject.matrixWorld)}
          rotation={shirtObject.rotation}
          scale={shirtObject.scale}
        >
          <Html>
            <Hotspot onClick={onHotspotClick} />
          </Html>
        </mesh>
      )}
    </>
  );
}
