import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, Environment, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, button, folder } from 'leva';
import Hotspot from './assets/hotspot';

const CAMERA_POSITIONS = {
  default: [0, 0, 12],
  hotspot: [0, -1, 6],
  Art001: [1, 0, 0.3],
  Art002: [-2, 0, 5],
  Art003: [1, 0, -5],
  Art004: [0, -2, 5],
  Art005: [1, 0.5, -7],
  Art006: [-1.5, -1.5, 6],
};

const CAMERA_ZOOMS = {
  default: 1,
  hotspot: 1.5,
  art: 1.2,
};

export default function App() {
  const handleHotspotClick = () => {
    console.log('Hotspot clicked!');
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
        <CameraManager />
        <ambientLight intensity={1} color="white" />
        <group position={[0, -3, -3]}>
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

const CameraManager = () => {
  const controls = useRef();
  const [cameraPosition, setCameraPosition] = useState(CAMERA_POSITIONS.default);
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0]);

  const updateCameraPosition = (x, y, z) => {
    setCameraPosition([x, y, z]);
    controls.current?.setPosition(x, y, z, true);
  };

  const updateCameraRotation = (rx, ry, rz) => {
    setCameraRotation([rx, ry, rz]);
    // Directly set the camera's rotation
    controls.current?.camera.rotation.set(rx, ry, rz);
  };

  useEffect(() => {
    controls.current?.setPosition(...cameraPosition, true);
    controls.current?.camera.rotation.set(...cameraRotation);
  }, [cameraPosition, cameraRotation]);

  useControls("Camera", {
    Default: button(() => updateCameraPosition(...CAMERA_POSITIONS.default)),
    Hotspot: button(() => updateCameraPosition(...CAMERA_POSITIONS.hotspot)),
    Art001: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art001)),
    Art002: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art002)),
    Art003: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art003)),
    Art004: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art004)),
    Art005: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art005)),
    Art006: button(() => updateCameraPosition(...CAMERA_POSITIONS.Art006)),
    CameraPosition: folder({
      x: {
        value: cameraPosition[0],
        min: -10,
        max: 10,
        step: 0.1,
        onChange: (x) => updateCameraPosition(x, cameraPosition[1], cameraPosition[2]),
      },
      y: {
        value: cameraPosition[1],
        min: -10,
        max: 10,
        step: 0.1,
        onChange: (y) => updateCameraPosition(cameraPosition[0], y, cameraPosition[2]),
      },
      z: {
        value: cameraPosition[2],
        min: 1,
        max: 20,
        step: 0.1,
        onChange: (z) => updateCameraPosition(cameraPosition[0], cameraPosition[1], z),
      },
    }),
    CameraRotation: folder({
      rotationX: {
        value: cameraRotation[0],
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        onChange: (rx) => updateCameraRotation(rx, cameraRotation[1], cameraRotation[2]),
      },
      rotationY: {
        value: cameraRotation[1],
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        onChange: (ry) => updateCameraRotation(cameraRotation[0], ry, cameraRotation[2]),
      },
      rotationZ: {
        value: cameraRotation[2],
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        onChange: (rz) => updateCameraRotation(cameraRotation[0], cameraRotation[1], rz),
      },
    }),
  });

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
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
