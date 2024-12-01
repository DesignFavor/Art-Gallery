import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, Environment, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, button, folder } from 'leva';
import Hotspot from './assets/hotspot';

const CAMERA_POSITIONS = {
  default: [0, 0, 12],
  hotspot: [0, -1, 8],
  Art001: [0.5, -0.005, 0.01],
  Art002: [-0.5, -0.005, -0.01],
  Art003: [0.5, 0.005, -8],
  Art004: [-1.5, -1.5, -10],
};

export default function App() {
  const [cameraPosition, setCameraPosition] = useState(CAMERA_POSITIONS.default);

  const handleHotspotClick = () => {
    console.log('Hotspot clicked!');
    setCameraPosition(CAMERA_POSITIONS.hotspot);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        gl={{
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.AgxToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <CameraManager cameraPosition={cameraPosition} setCameraPosition={setCameraPosition} />
        <ambientLight intensity={1} color="white" />
        <group position={[0, -3, 1]}> {/* Model moved further into the scene */}
  <Suspense fallback={null}>
    <Model url="./assets/artgallery.gltf" onHotspotClick={handleHotspotClick} />
  </Suspense>
  <Environment files="./envy.hdr" />
</group>
      </Canvas>
    </div>
  );
}

function Model({ url, onHotspotClick, ...props }) {
  const { scene, animations } = useGLTF(url);
  const mixer = new THREE.AnimationMixer(scene);

  useEffect(() => {
    if (animations.length > 0) {
      const action = mixer.clipAction(animations[0]);
      action.play();
    }

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      mixer.update(delta);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mixer.stopAllAction();
    };
  }, [animations, mixer]);

  const hotspotObject = scene.getObjectByName('Plant004');

  return (
    <>
      <primitive object={scene} {...props} />
      {hotspotObject && (
        <mesh
          position={new THREE.Vector3().setFromMatrixPosition(hotspotObject.matrixWorld)}
          rotation={hotspotObject.rotation}
          scale={hotspotObject.scale}
        >
          <Html>
            <Hotspot onClick={onHotspotClick} />
          </Html>
        </mesh>
      )}
    </>
  );
}

const CameraManager = ({ cameraPosition, setCameraPosition }) => {
  const controls = useRef();

  const updateCameraPosition = (x, y, z) => {
    console.log('Camera Position:', [x, y, z]);
    setCameraPosition([x, y, z]);
    controls.current?.setPosition(x, y, z, true);
  };

  useEffect(() => {
    controls.current?.setPosition(...cameraPosition, true);
  }, [cameraPosition]);

  useControls("Camera", {
    Default: button(() => updateCameraPosition(...CAMERA_POSITIONS.default)),
    Hotspot: button(() => updateCameraPosition(...CAMERA_POSITIONS.hotspot)),
    Art001: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art001)),
    Art002: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art002)),
    Art003: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art003)),
    Art004: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art004)),
  });

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
   

      mouseButtons={{
        left: 1,
        wheel: 16,
      }}
      touches={{
        one: 32,
        two: 512,
      }}
    />
  );
};
