import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Grid } from './Grid';
import DraggableModel from "./DraggableModel";

const modelPaths = {
    steve: '/steve/source/model.gltf',
    loona: '/shameless_loona_pose/scene.gltf'
}

const Scene = ({ models }) => {
    const gridScale = 20;
    const gridDivisions = 40;

    return (
        <Canvas orthographic camera={{ position: [10, 10, 10], zoom: 50, near: 0.1 }}>
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <Grid gridScale={gridScale} gridDivisions={gridDivisions}>
                {models.map(model => (
                    <DraggableModel
                        key={model.id}
                        modelPath={modelPaths[model.type]}
                        position={model.position}
                        rotation={model.rotation}
                    />
                ))}
            </Grid>
            <OrbitControls makeDefault />
        </Canvas>
    );
};

export default Scene;