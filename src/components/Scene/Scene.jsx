import React, {useEffect, useRef} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Grid } from './Grid';
import DraggableModel from "./DraggableModel";

const Scene = ({ objects, models, selectedModelId, onModelSelect, onModelUpdate }) => {
    const gridScale = 20;
    const gridDivisions = 40;
    const isDragging = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onModelSelect(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onModelSelect]);

    return (
        <Canvas orthographic
                camera={{ position: [10, 5, -10], zoom: 50, near: 0.1 }}
                onPointerMissed={(e) => {
                    if (!isDragging.current) onModelSelect(null);
                }}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <Grid gridScale={gridScale} gridDivisions={gridDivisions}>
                {models.map(model => (
                    <DraggableModel
                        key={model.id}
                        modelPath={objects[model.type].path}
                        scale={model.scale}
                        position={model.position}
                        rotation={model.rotation}
                        isSelected={model.id === selectedModelId}
                        onClick={() => onModelSelect(model.id)}
                        onDrag={(newPosition) => {
                            onModelUpdate(model.id, { position: newPosition });
                            if (model.id !== selectedModelId)
                                onModelSelect(model.id);
                        }}
                    />
                ))}
            </Grid>
            <OrbitControls makeDefault />
        </Canvas>
    );
};

export default Scene;