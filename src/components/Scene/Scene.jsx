import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CustomGrid from './CustomGrid';
import DraggableModel from './DraggableModel';
import { TransformWrapper } from './TransformWrapper';

const Scene = (props) => {
    const isDragging = useRef(false);
    const orbitControlRef = useRef();
    const [selectedRef, setSelectedRef] = useState(null);
    const [transformMode, setTransformMode] = useState('rotate');
    const [isTransformActive, setIsTransformActive] = useState(false);

    // Handle drawing mode and shape completion
    const handleShapeComplete = (isComplete) => {
        if (isComplete) {
            props.onGridCreated(true); // Update isGridCreated
        }
    };

    // Mouse click handler for drawing points
    const DrawingHandler = () => {
        const { camera, gl } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane at Y=0

        useEffect(() => {
            console.log('DrawingHandler mounted, isDrawing:', props.isDrawing);
            const handleClick = (event) => {
                if (!props.isDrawing || isDragging.current) return;

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                raycaster.current.ray.intersectPlane(plane.current, intersection);

                if (intersection) {
                    console.log('Point added:', [intersection.x, 0, intersection.z]);
                    props.onPointAdded([intersection.x, 0, intersection.z]);
                }
            };

            gl.domElement.addEventListener('click', handleClick);
            return () => gl.domElement.removeEventListener('click', handleClick);
        }, []);

        return null;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                props.onModelSelect(null);
                setTransformMode('rotate');
                setIsTransformActive(false);
            }
            if (e.key === 'r' || e.key === 'к') {
                setTransformMode('rotate');
                setIsTransformActive(true);
            }
            if (e.key === 's' || e.key === 'ы') {
                setTransformMode('scale');
                setIsTransformActive(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [props.onModelSelect]);

    return (
        <Canvas
            orthographic
            camera={{ position: [10, 5, -10], zoom: 50, near: 0.1 }}
            onPointerMissed={() => !isDragging.current && !props.isDrawing && props.onModelSelect(null)}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            {(props.isGridCreated || props.isDrawing) && (
                <CustomGrid
                    gridScale={props.gridScale}
                    gridDivisions={props.gridDivisions}
                    isDrawing={props.isDrawing}
                    gridPoints={props.gridPoints}
                    onShapeComplete={handleShapeComplete}
                >
                    {props.isGridCreated &&
                        props.models.map((model) => {
                            const finalScale = model.normalizedScale.map(
                                (val, i) => val * model.baseScale[i]
                            );
                            return (
                                <DraggableModel
                                    key={model.id}
                                    modelPath={props.state[model.category].models[model.type].path}
                                    scale={finalScale}
                                    position={model.position}
                                    rotation={model.rotation}
                                    isSelected={model.id === props.selectedModelId}
                                    onRefReady={(ref) => {
                                        if (model.id === props.selectedModelId) setSelectedRef(ref);
                                    }}
                                    onClick={() => props.onModelSelect(model.id)}
                                    onDrag={(newPosition) => {
                                        props.onModelUpdate(model.id, { position: newPosition });
                                        if (model.id !== props.selectedModelId)
                                            props.onModelSelect(model.id);
                                    }}
                                    onTransform={(newRotation) => {
                                        props.onModelUpdate(model.id, { rotation: newRotation });
                                    }}
                                    gridScale={props.gridScale}
                                    gridDivisions={props.gridDivisions}
                                />
                            );
                        })}
                </CustomGrid>
            )}
            <TransformWrapper
                selectedObject={selectedRef}
                mode={transformMode}
                isActive={isTransformActive}
                orbitControlRef={orbitControlRef}
                onChangeStart={() => {
                    isDragging.current = true;
                }}
                onChangeEnd={() => {
                    setTimeout(() => {
                        isDragging.current = false;
                    }, 50);
                }}
                onScaleChange={(newScale) => {
                    if (props.selectedModelId) {
                        const selectedModel = props.models.find(
                            (m) => m.id === props.selectedModelId
                        );
                        if (selectedModel) {
                            const normalizedScale = newScale.map(
                                (val, i) => val / selectedModel.baseScale[i]
                            );
                            props.onModelUpdate(props.selectedModelId, { normalizedScale });
                        }
                    }
                }}
            />
            <OrbitControls ref={orbitControlRef} makeDefault />
            {props.isDrawing && <DrawingHandler />}
        </Canvas>
    );
};

export default Scene;