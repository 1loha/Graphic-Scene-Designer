import React, { useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { easing } from 'maath';
import { MathUtils } from 'three';
import { Grid, useDrag } from './Grid';

function DraggableModel({position = [0, 0, 0], gridScale = 20, gridDivisions = 40, modelPath, ...props}) {
    const ref = useRef();
    const pos = useRef(position);
    const { scene } = useGLTF(modelPath);
    const baseSize = 0.5;

    const onDrag = useCallback(({ x, z }) => {
        const cellSize = gridScale / gridDivisions;
        const halfGrid = gridScale / 2;
        const minBound = -halfGrid + baseSize;
        const maxBound = halfGrid - baseSize;

        pos.current = [
            MathUtils.clamp(
                Math.round(x / cellSize) * cellSize + cellSize/2,
                minBound + cellSize/2,
                maxBound - cellSize/2
            ),
            position[1],
            MathUtils.clamp(
                Math.round(z / cellSize) * cellSize + cellSize/2,
                minBound + cellSize/2,
                maxBound - cellSize/2
            )
        ];
    }, [gridScale, gridDivisions, position, baseSize]);

    const [events] = useDrag(onDrag);

    useFrame((state, delta) => {
        easing.damp3(ref.current.position, pos.current, 0.1, delta);
    });

    return <primitive ref={ref} object={scene} {...events} {...props} />;
}

const Scene = () => {
    const gridScale = 20;
    const gridDivisions = 40;

    return (
        <Canvas orthographic camera={{ position: [5, 5, 5], zoom: 50, near: 0.1 }}>
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <Grid gridScale={gridScale} gridDivisions={gridDivisions}>
                <DraggableModel modelPath="/steve/source/model.gltf" />
                <DraggableModel modelPath="/shameless_loona_pose/scene.gltf" />
            </Grid>
            <OrbitControls makeDefault />
        </Canvas>
    );
};

export default Scene;