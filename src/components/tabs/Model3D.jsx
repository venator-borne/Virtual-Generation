import { Box } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { OrbitControls, useFBX, useGLTF } from "@react-three/drei";

function Model({url, format}) {
  let model;

  if (format === 'glb' || format === 'gltf') {
    model = useGLTF;
  } else if (format === 'fbx') {
    model = useFBX;
  } else {
    return <div>unsupported model format</div>
  }

  const s = model(url);
  return (
      <primitive object={s} scale={1}/>
  );
}

export default function Model3D() {
  const [url, setUrl] = useState(null);
  const [format, setFormat] = useState(null);

  return (
    <Box>
      <Canvas>
        <ambientLight intensity={0.5}/>
        <pointLight position={[10, 10, 10]} />
        <Model url={url} type={format} />
        <OrbitControls />
      </Canvas>
    </Box>
  );
}
