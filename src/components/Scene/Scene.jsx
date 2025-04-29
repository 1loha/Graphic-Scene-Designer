// import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import s from './Scene.module.css';

function Box() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

const Scene = () => {
    return (
        <Canvas className={s.scene}>
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Box />
            <OrbitControls /> {/* Позволяет вращать сцену мышкой */}
        </Canvas>
    );
};

export default Scene;