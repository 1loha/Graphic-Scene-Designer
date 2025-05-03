import React from 'react';
import { useGLTF } from '@react-three/drei';

const Model = ({ path, scale, position }) => {
    const { scene } = useGLTF(path);
    return <primitive object={scene} scale={scale} position={position} />;
};

export default Model;