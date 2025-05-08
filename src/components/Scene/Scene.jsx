import React, {useEffect, useRef, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Grid } from './Grid';
import DraggableModel from "./DraggableModel";
import { TransformWrapper } from "./TransformWrapper";

const Scene = ({ objects, models, selectedModelId, onModelSelect, onModelUpdate }) => {
    const gridScale = 20;
    const gridDivisions = 40;
    const isDragging = useRef(false);
    const orbitControlRef = useRef();
    const [selectedRef, setSelectedRef] = useState(null);
    const [transformMode, setTransformMode] = useState('rotate');
    const [isTransformActive, setIsTransformActive] = useState(false);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onModelSelect(null);
                setTransformMode('rotate');
                setIsTransformActive(false);
            }
            if (e.key === 'r') {
                setTransformMode('rotate');
                setIsTransformActive(true);
            }
            if (e.key === 's') {
                setTransformMode('scale');
                setIsTransformActive(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onModelSelect]);

    return (
        <Canvas orthographic
                camera={{ position: [10, 5, -10], zoom: 50, near: 0.1 }}
                // onPointerMissed={(e) => {if (!isDragging.current) onModelSelect(null);}}
                onPointerMissed={() => !isDragging.current && onModelSelect(null)}
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
                        onRefReady={(ref) => { if (model.id === selectedModelId) setSelectedRef(ref); }}
                        onClick={() => onModelSelect(model.id)}
                        onDrag={(newPosition) => {
                            onModelUpdate(model.id, { position: newPosition });
                            if (model.id !== selectedModelId) onModelSelect(model.id);
                        }}
                        onTransform={(newRotation) => {
                            onModelUpdate(model.id, { rotation: newRotation });
                        }}
                    />
                ))}
            </Grid>
            <TransformWrapper
                selectedObject={selectedRef}
                mode={transformMode}
                isActive={isTransformActive}
                orbitControlRef={orbitControlRef}
                onChangeStart={() => { isDragging.current = true; }}
                onChangeEnd={() => { setTimeout(() => { isDragging.current = false; }, 50); }}
                onScaleChange={(newScale) => {if (selectedModelId) onModelUpdate(selectedModelId, { scale: newScale });}}
            />
            <OrbitControls ref={orbitControlRef}
                           makeDefault
                           enabled={!selectedRef}/>
        </Canvas>
    );
};

export default Scene;