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

    // Log props for debugging
    console.log('Scene props:', {
        isGridCreated: props.isGridCreated,
        selectedModelType: props.selectedModelType,
        models: props.models,
        addModel: typeof props.addModel,
        onModelPlaced: typeof props.onModelPlaced
    });

    // Handle drawing mode and shape completion
    const handleShapeComplete = (isComplete) => {
        if (isComplete) {
            props.onGridCreated(true);
        }
    };

    // Mouse handler for drawing points and placing models
    const DrawingHandler = () => {
        const { camera, gl } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane at Y=0

        // Check for self-intersection
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

            if (Math.abs(rxs) < 0.0001) return false;

            const t = ((q[0] - p[0]) * s[1] - (q[2] - p[2]) * s[0]) / rxs;
            const u = ((q[0] - p[0]) * r[1] - (q[2] - p[2]) * r[0]) / rxs;

            return t >= 0 && t <= 1 && u >= 0 && u <= 1;
        };

        // Point-in-polygon test (ray-casting algorithm)
        const isPointInPolygon = (point, vertices) => {
            let inside = false;
            const x = point[0], z = point[2];
            for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
                const xi = vertices[i][0], zi = vertices[i][2];
                const xj = vertices[j][0], zj = vertices[j][2];
                const intersect = ((zi > z) !== (zj > z)) &&
                    (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        useEffect(() => {
            console.log('DrawingHandler mounted, isDrawing:', props.isDrawing, 'isGridCreated:', props.isGridCreated, 'selectedModelType:', props.selectedModelType);
            const handleMouseDown = (event) => {
                console.log('Mouse down, isDragging:', isDragging.current, 'button:', event.button);
                if (isDragging.current || event.button !== 0) return;

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                raycaster.current.ray.intersectPlane(plane.current, intersection);

                if (!intersection) {
                    console.log('No intersection with plane');
                    return;
                }

                if (props.isDrawing && !isShapeClosed) {
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

                    // Check if point closes the shape
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
                } else if (props.isGridCreated && props.selectedModelType) {
                    // Place model inside polygon with 1-unit grid snapping
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const point = [snappedX, 0, snappedZ];
                    console.log('Checking point:', point, 'in polygon with vertices:', props.gridPoints);
                    if (isPointInPolygon(point, props.gridPoints)) {
                        console.log('Placing model at:', point);
                        if (typeof props.addModel === 'function') {
                            props.addModel(
                                props.selectedModelType.category,
                                props.selectedModelType.type,
                                { position: point }
                            );
                            if (typeof props.onModelPlaced === 'function') {
                                props.onModelPlaced();
                            }
                        } else {
                            console.error('addModel is not a function:', props.addModel);
                        }
                    } else {
                        console.log('Click outside polygon, model not placed');
                    }
                } else {
                    console.log('Model placement skipped, isGridCreated:', props.isGridCreated, 'selectedModelType:', props.selectedModelType);
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
        }, [
            props.isDrawing,
            props.gridPoints,
            isShapeClosed,
            props.onPointAdded,
            props.isGridCreated,
            props.selectedModelType,
            props.addModel,
            props.onModelPlaced
        ]);

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
        <div style={{ position: 'relative' }}>
            <Canvas
                orthographic
                camera={{ position: [0, 10, 0], zoom: 30, near: 0.1 }} // Increased zoom
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
                                console.log('Rendering model:', model);
                                console.log('Model path:', props.state[model.category].models[model.type].path);
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
                                        isGridCreated={props.isGridCreated}
                                        selectedModelType={props.selectedModelType}
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
                {props.isGridCreated && <DrawingHandler />}
            </Canvas>
            {props.isGridCreated && (
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 5 }}>
                    Select a model in Categories, then left-click inside the polygon to place it. Reselect to place another.
                </div>
            )}
        </div>
    );
};

export default Scene;