import React, {useEffect, useRef, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Grid } from './Grid';
import DraggableModel from "./DraggableModel";
import { TransformWrapper } from "./TransformWrapper";

const Scene = (props) => {
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
                props.onModelSelect(null);
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
    }, [props.onModelSelect]);
    return (
        <Canvas orthographic
                camera={{ position: [10, 5, -10], zoom: 50, near: 0.1 }}
                onPointerMissed={() => !isDragging.current && props.onModelSelect(null)}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <Grid gridScale={gridScale} gridDivisions={gridDivisions}>
                {props.models.map(model => (
                    <DraggableModel
                        key={model.id}
                        modelPath={props.state[model.category].models[model.type].path}                        scale={model.scale}
                        position={model.position}
                        rotation={model.rotation}
                        isSelected={model.id === props.selectedModelId}
                        onRefReady={(ref) => { if (model.id === props.selectedModelId) setSelectedRef(ref); }}
                        onClick={() => props.onModelSelect(model.id)}
                        onDrag={(newPosition) => {
                            props.onModelUpdate(model.id, { position: newPosition });
                            if (model.id !== props.selectedModelId) props.onModelSelect(model.id);
                        }}
                        onTransform={(newRotation) => {
                            props.onModelUpdate(model.id, { rotation: newRotation });
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
                onScaleChange={(newScale) => {if (props.selectedModelId) props.onModelUpdate(props.selectedModelId, { scale: newScale });}}
            />
            <OrbitControls ref={orbitControlRef}
                           makeDefault
                           enabled={!selectedRef}/>
        </Canvas>
    );
};

export default Scene;