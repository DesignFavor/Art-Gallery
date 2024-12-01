import { CameraControls, Environment } from "@react-three/drei";
import { Artgallery } from "../Artgallery";
import { useRef, useEffect } from "react";

export const Experience = () => {
  const controls = useRef();

  const meshFitCameraStore = useRef ();

  const intro = async () => {
    controls.current.dolly(-10);
    controls.current.smoothTime = 1.6;
    controls.current.dolly(10, true);
  };


  const fitCamera = async () => {
  if (currentpage === "store") {


  }
};

  useEffect(() => {
    intro();
  }, []);

  return (
    <>
      <CameraControls ref={controls} />
      <Artgallery />
      <Environment preset="sunset" />
    </>
  );
};
