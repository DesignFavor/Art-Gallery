import { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import tunnel from 'tunnel-rat';
import Hotspot from './assets/hotspot';
import { gsap } from 'gsap'; // Import gsap for animations

const status = tunnel();

export default function App() {
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0.5, 3));

  // Toggle the visibility of the Product component when hotspot is clicked
  const handleHotspotClick = (targetPosition) => {
    setCameraTarget(targetPosition); // Update camera target position
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
        
        <CameraMovement target={cameraTarget} />

        <group position={[0, -3, -3]}>
          <Suspense fallback={null}>
            <Model url='./assets/artgallery.gltf' onHotspotClick={handleHotspotClick} />
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

function CameraMovement({ target }) {
  const { camera, gl } = useThree();

  // Ensure camera movement when the target changes
  useState(() => {
    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.5, // Duration of the movement
      ease: 'power2.out', // Ease for smooth movement
    });
    gl.render(camera, camera); // Force render after animation to avoid issues
  }, [target, camera, gl]);

  return null;
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

  // When hotspot is clicked, move camera to the shirt object
  const onClick = () => {
    const position = new THREE.Vector3().setFromMatrixPosition(shirtObject.matrixWorld);
    onHotspotClick(position); // Pass the position of the shirt as the target
  };

  return (
    <>
      <primitive object={scene} {...props} />

      {/* Hotspot for Shirt */}
      {shirtObject && (
        <mesh
          position={new THREE.Vector3().setFromMatrixPosition(shirtObject.matrixWorld)}
          rotation={shirtObject.rotation}
          scale={shirtObject.scale}
          onClick={onClick}
        >
          <Html>
            <Hotspot />
          </Html>
        </mesh>
      )}
    </>
  );
}
