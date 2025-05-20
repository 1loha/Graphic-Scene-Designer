import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CustomGrid from './CustomGrid';
import DraggableModel from './DraggableModel';
import { TransformWrapper } from './TransformWrapper';
import { isPointInPolygon } from './isPointInPolygon';
import lineSegmentsIntersect from "./LineSegmentsIntersect";

// Главный компонент сцены для 3D-рендеринга
const Scene = (props) => {
    const isDragging = useRef(false);
    const orbitControlRef = useRef();
    const [selectedRef, setSelectedRef] = useState(null);
    const [transformMode, setTransformMode] = useState('translate');
    const [isTransformActive, setIsTransformActive] = useState(false);
    const [isShapeClosed, setIsShapeClosed] = useState(props.isGridCreated);

    // Синхронизация isShapeClosed с props.isGridCreated
    useEffect(() => {
        setIsShapeClosed(props.isGridCreated);
    }, [props.isGridCreated]);

    // Сброс полигона при новом рисовании
    useEffect(() => {
        if (props.resetDrawing) setIsShapeClosed(false);
    }, [props.resetDrawing]);

    // Логирование для диагностики
    useEffect(() => {
        console.log('Scene props:', { gridPoints: props.gridPoints, isGridCreated: props.isGridCreated, isShapeClosed });
    }, [props.gridPoints, props.isGridCreated, isShapeClosed]);

    // Обработка завершения формы полигона
    const handleShapeComplete = (isComplete) => {
        if (isComplete) {
            setIsShapeClosed(true);
            props.onGridCreated(true);
        }
    };

    // Компонент для обработки событий мыши
    const DrawingHandler = () => {
        const { camera, gl } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

        // Проверка самопересечения полигона
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
                if (lineSegmentsIntersect(newEdge, edge)) return true;
            }
            return false;
        };

        // Обработка событий мыши
        useEffect(() => {
            const handleMouseDown = (event) => {
                if (isDragging.current || event.button !== 0) return;

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                raycaster.current.ray.intersectPlane(plane.current, intersection);

                if (!intersection) return;

                if (props.isDrawing && !isShapeClosed) {
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const newPoint = [snappedX, 0, snappedZ];

                    const lastPoint = props.gridPoints[props.gridPoints.length - 1];
                    if (
                        lastPoint &&
                        newPoint[0] === lastPoint[0] &&
                        newPoint[2] === lastPoint[2]
                    ) return;

                    if (props.gridPoints.length >= 3) {
                        const firstPoint = props.gridPoints[0];
                        const distance = Math.sqrt(
                            (newPoint[0] - firstPoint[0]) ** 2 +
                            (newPoint[2] - firstPoint[2]) ** 2
                        );
                        if (distance < 0.5) {
                            setIsShapeClosed(true);
                            props.onGridCreated(true);
                            return;
                        }
                    }

                    if (checkSelfIntersection(props.gridPoints, newPoint)) return;

                    props.onPointAdded(newPoint);
                } else if (props.isGridCreated && props.selectedModelType) {
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const point = [snappedX, 0, snappedZ];
                    if (isPointInPolygon(point, props.gridPoints)) {
                        props.addModel(
                            props.selectedModelType.category,
                            props.selectedModelType.type,
                            { position: point }
                        );
                        if (typeof props.onModelPlaced === 'function') {
                            props.onModelPlaced();
                        }
                    }
                }
            };

            const handleRightClick = (event) => {
                if (!props.isDrawing || event.button !== 2 || isShapeClosed) return;
                event.preventDefault();
                if (props.gridPoints.length > 0) {
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

    // Настройка управления камерой
    useEffect(() => {
        if (orbitControlRef.current) {
            orbitControlRef.current.enableRotate = !props.isDrawing;
            orbitControlRef.current.enablePan = !props.isDrawing;
            orbitControlRef.current.enableZoom = true;
        }
    }, [props.isDrawing]);

    // Обработка клавиш для управления трансформацией объекта
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                props.onModelSelect(null);
                setSelectedRef(null);
                setTransformMode('translate');
                setIsTransformActive(false);
                setIsShapeClosed(false);
            }
            if (e.key === 'w' || e.key === 'ц') {
                setTransformMode('translate');
                setIsTransformActive(!!selectedRef);
            }
            if (e.key === 'r' || e.key === 'к') {
                setTransformMode('rotate');
                setIsTransformActive(!!selectedRef);
            }
            if (e.key === 's' || e.key === 'ы') {
                setTransformMode('scale');
                setIsTransformActive(!!selectedRef);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [props.onModelSelect, selectedRef]);

    // Рендеринг сцены
    return (
        <div style={{ position: 'relative' }}>
            <Canvas
                orthographic
                camera={{ position: [0, 100, 0], zoom: 30, near: 0.1 }}
                onPointerMissed={() => {
                    if (!isDragging.current && !props.isDrawing) {
                        props.onModelSelect(null);
                        setSelectedRef(null);
                        setTransformMode('translate');
                        setIsTransformActive(false);
                    }
                }}
            >
                <ambientLight intensity={1} />
                <directionalLight position={[0, 10, 0]} intensity={0.8} />
                {(!props.isGridCreated || props.isDrawing) && (
                    <gridHelper args={[100, 100, 0x888888, 0x888888]} />
                )}
                {(props.isGridCreated || props.isDrawing) && (
                    <CustomGrid
                        gridScale={props.gridScale}
                        gridDivisions={props.gridDivisions}
                        isDrawing={props.isDrawing}
                        gridPoints={props.gridPoints}
                        isShapeClosed={isShapeClosed}
                        onShapeComplete={handleShapeComplete}
                        isGridCreated={props.isGridCreated}
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
                                            if (model.id === props.selectedModelId) {
                                                setSelectedRef(ref);
                                                setIsTransformActive(transformMode !== 'translate');
                                            }
                                        }}
                                        onClick={() => {
                                            props.onModelSelect(model.id);
                                            setTransformMode('translate');
                                            setIsTransformActive(false);
                                        }}
                                        onDrag={(newPosition) => {
                                            props.onModelUpdate(model.id, { position: newPosition });
                                            if (model.id !== props.selectedModelId)
                                                props.onModelSelect(model.id);
                                        }}
                                        gridScale={props.gridScale}
                                        gridDivisions={props.gridDivisions}
                                        isGridCreated={props.isGridCreated}
                                        selectedModelType={props.selectedModelType}
                                        gridPoints={props.gridPoints}
                                        transformMode={transformMode}
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
                    onChangeStart={() => { isDragging.current = true; }}
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
                    onRotateChange={(newRotation) => {
                        if (props.selectedModelId) {
                            props.onModelUpdate(props.selectedModelId, { rotation: newRotation });
                        }
                    }}
                />
                <OrbitControls ref={orbitControlRef} makeDefault />
                {(props.isDrawing || props.isGridCreated) && <DrawingHandler />}
            </Canvas>
            {props.isGridCreated && (
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 5 }}>
                    Выберите объект из категорий и расположите внутри сцены
                </div>
            )}
        </div>
    );
};

export default Scene;