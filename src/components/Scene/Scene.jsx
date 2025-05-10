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
    const [isShapeClosed, setIsShapeClosed] = useState(false);

    // Handle drawing mode and shape completion
    const handleShapeComplete = (isComplete) => {
        if (isComplete) {
            props.onGridCreated(true);
        }
    };

    // Mouse handler for drawing points
    const DrawingHandler = () => {
        const { camera, gl } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane at Y=0

        // Check for self-intersection (optional)
        const checkSelfIntersection = (points, newPoint) => {
            if (points.length < 3) return false;
            const newEdge = {
                start: points[points.length - 1],
                end: newPoint,
            };
            for (let i = 0; i < points.length - 2; i++) {
                const edge = {
                    start: points[i],
                    end: points[i + 1],
                };
                if (lineSegmentsIntersect(newEdge, edge)) {
                    console.warn('Self-intersection detected at point:', newPoint);
                    return true;
                }
            }
            return false;
        };

        // Line segment intersection test
        const lineSegmentsIntersect = (edge1, edge2) => {
            const p = edge1.start;
            const r = [edge1.end[0] - p[0], edge1.end[2] - p[2]];
            const q = edge2.start;
            const s = [edge2.end[0] - q[0], edge2.end[2] - q[2]];

            const rxs = r[0] * s[1] - r[1] * s[0];
            const qpxr = (q[0] - p[0]) * r[1] - (q[2] - p[2]) * r[0];

            if (Math.abs(rxs) < 0.0001) return false; // Parallel or collinear

            const t = ((q[0] - p[0]) * s[1] - (q[2] - p[2]) * s[0]) / rxs;
            const u = ((q[0] - p[0]) * r[1] - (q[2] - p[2]) * r[0]) / rxs;

            return t >= 0 && t <= 1 && u >= 0 && u <= 1;
        };

        useEffect(() => {
            console.log('DrawingHandler mounted, isDrawing:', props.isDrawing);
            const handleMouseDown = (event) => {
                if (!props.isDrawing || isDragging.current || isShapeClosed || event.button !== 0) return;

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                raycaster.current.ray.intersectPlane(plane.current, intersection);

                if (intersection) {
                    // Snap to 1-unit grid
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const newPoint = [snappedX, 0, snappedZ];

                    // Prevent duplicate points
                    const lastPoint = props.gridPoints[props.gridPoints.length - 1];
                    if (
                        lastPoint &&
                        newPoint[0] === lastPoint[0] &&
                        newPoint[2] === lastPoint[2]
                    ) {
                        console.log('Point ignored (duplicate)');
                        return;
                    }

                    // Check if point closes the shape (within 0.5 units of first point)
                    if (props.gridPoints.length >= 3) {
                        const firstPoint = props.gridPoints[0];
                        const distance = Math.sqrt(
                            (newPoint[0] - firstPoint[0]) ** 2 +
                            (newPoint[2] - firstPoint[2]) ** 2
                        );
                        if (distance < 0.5) {
                            console.log('Closing shape at first point');
                            setIsShapeClosed(true);
                            return;
                        }
                    }

                    // Check for self-intersection
                    if (checkSelfIntersection(props.gridPoints, newPoint)) {
                        console.warn('Point ignored due to self-intersection');
                        return;
                    }

                    console.log('Point added:', newPoint);
                    props.onPointAdded(newPoint);
                }
            };

            const handleRightClick = (event) => {
                if (!props.isDrawing || event.button !== 2 || isShapeClosed) return;
                event.preventDefault();
                if (props.gridPoints.length > 0) {
                    console.log('Removing last point');
                    const newPoints = props.gridPoints.slice(0, -1);
                    props.onPointAdded(newPoints);
                }
            };

            gl.domElement.addEventListener('mousedown', handleMouseDown);
            gl.domElement.addEventListener('contextmenu', handleRightClick);
            return () => {
                gl.domElement.removeEventListener('mousedown', handleMouseDown);
                gl.domElement.removeEventListener('contextmenu', handleRightClick);
            };
        }, [props.isDrawing, props.gridPoints, isShapeClosed, props.onPointAdded]);

        return null;
    };

    useEffect(() => {
        if (orbitControlRef.current) {
            orbitControlRef.current.enableRotate = !props.isDrawing;
            orbitControlRef.current.enablePan = !props.isDrawing;
            orbitControlRef.current.enableZoom = true;
        }
    }, [props.isDrawing]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                props.onModelSelect(null);
                setTransformMode('rotate');
                setIsTransformActive(false);
                setIsShapeClosed(false);
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
            camera={{ position: [0, 10, 0], zoom: 10, near: 0.1 }}
            onPointerMissed={() => !isDragging.current && !props.isDrawing && props.onModelSelect(null)}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <gridHelper args={[100, 100, 0x888888, 0x888888]} />
            {(props.isGridCreated || props.isDrawing) && (
                <CustomGrid
                    gridScale={props.gridScale}
                    gridDivisions={props.gridDivisions}
                    isDrawing={props.isDrawing}
                    gridPoints={props.gridPoints}
                    isShapeClosed={isShapeClosed}
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