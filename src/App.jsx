import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, Environment, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './assets/hotspot';

const CAMERA_POSITIONS = {
  default: [0, 0, 12],
  hotspot: [0, -1, 8],
  Art001: [0.5, -0.005, 0.01],
  Art002: [-0.5, -0.005, -0.01],
  Art003: [0.5, 0.005, -8],
  Art004: [-1.5, -1.5, -10],
};

const CAMERA_NAMES = Object.keys(CAMERA_POSITIONS);

export default function App() {
  const [cameraIndex, setCameraIndex] = useState(0);

  const handleNext = () => {
    setCameraIndex((prevIndex) => (prevIndex + 1) % CAMERA_NAMES.length);
  };

  const handlePrevious = () => {
    setCameraIndex((prevIndex) =>
      prevIndex === 0 ? CAMERA_NAMES.length - 1 : prevIndex - 1
    );
  };

  const currentCameraName = CAMERA_NAMES[cameraIndex];
  const currentCameraPosition = CAMERA_POSITIONS[currentCameraName];

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
        <CameraManager cameraPosition={currentCameraPosition} />
        <ambientLight intensity={1} color="white" />
        <group position={[0, -3, 1]}>
          <Suspense fallback={null}>
            <Model url="./assets/artgallery.gltf" />
          </Suspense>
          <Environment files="./envy.hdr" />
        </group>
      </Canvas>
      <div style={styles.controls}>
        <button style={styles.button} onClick={handlePrevious}>
          Previous
        </button>
        <span style={styles.cameraName}>{currentCameraName}</span>
        <button style={styles.button} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

function Model({ url, ...props }) {
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

  return <primitive object={scene} {...props} />;
}

const CameraManager = ({ cameraPosition }) => {
  const controls = useRef();

  useEffect(() => {
    controls.current?.setPosition(...cameraPosition, true);
  }, [cameraPosition]);

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

const styles = {
  controls: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '10px 20px',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    background: 'white',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  cameraName: {
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
};
