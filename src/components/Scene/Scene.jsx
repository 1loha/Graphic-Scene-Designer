import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import Model from '../Model/Model';
import s from './Scene.module.css';
import { Raycaster, Vector2, Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';

const SceneContent = ({ models, selectedModel, onPlaceModel, onCancelSelection }) => {
    const { gl, camera, size } = useThree();
    const [groundPlane, setGroundPlane] = useState(null);

    useEffect(() => {
        // Создаем и сохраняем плоскость в состоянии
        const plane = new Mesh(
            new PlaneGeometry(1000, 1000),
            new MeshBasicMaterial({ visible: false })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0;
        setGroundPlane(plane);
    }, []);

    useEffect(() => {
        if (!selectedModel || !groundPlane) return;

        const handleClick = (event) => {
            if (event.button === 0) {
                const raycaster = new Raycaster();
                const mouse = new Vector2();

                const rect = gl.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObject(groundPlane);

                if (intersects.length > 0) {
                    const pos = intersects[0].point;
                    onPlaceModel([pos.x, pos.y, pos.z]);
                }
            } else if (event.button === 2) {
                onCancelSelection();
            }
        };

        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [selectedModel, gl, camera, onPlaceModel, onCancelSelection, groundPlane]);

    return (
        <>
            <ambientLight intensity={.5} />
            <directionalLight position={[-2, 2, -2]} intensity={0.8} />
            <OrbitControls/>
            <Grid
                infiniteGrid
                cellSize={0.2}
                cellThickness={.6}
                cellColor="#bababa"
                sectionSize={5}
                sectionThickness={.5}
                sectionColor="#777777"
                fadeDistance={30}
                fadeStrength={0}
            />
            {groundPlane && <primitive object={groundPlane} />}
            {models.map((model, index) => (
                <Model
                    key={index}
                    path={model.path}
                    scale={model.scale}
                    position={model.position}
                />
            ))}
        </>
    );
};

const Scene = ({ models, selectedModel, onPlaceModel, onCancelSelection }) => {
    return (
        <Canvas
            className={`${s.scene} ${selectedModel ? s.modelPlacing : ''}`}
            camera={{fov: 80, position: [3, 5, 1]}}
        >
            <SceneContent
                models={models}
                selectedModel={selectedModel}
                onPlaceModel={onPlaceModel}
                onCancelSelection={onCancelSelection}
            />
        </Canvas>
    );
};

export default Scene;