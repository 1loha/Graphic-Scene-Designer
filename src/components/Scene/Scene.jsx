// import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import texture from "./../images/grass.jpg";
import s from './Scene.module.css';

function Box() {
    return (
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[10, .01, 10]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function Sphere() {
    const textureMap = useLoader(TextureLoader, texture);
    return (
        <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[2, 32]} />
            {/*<meshStandardMaterial color={0x00ff00} />*/}
            <meshStandardMaterial map={textureMap} />
        </mesh>
    );
}

const Scene = () => {
    return (
        <Canvas
            className={s.scene}
            camera={{fov: 80, position: [3, 5, 0]}}>
            <ambientLight intensity={.1} />
            <directionalLight position={[-2, 2, -2]} intensity={0.8} />
            <Box />
            <Sphere />
            <OrbitControls /> {/* Позволяет вращать сцену мышкой */}
        </Canvas>
    );
};

export default Scene;