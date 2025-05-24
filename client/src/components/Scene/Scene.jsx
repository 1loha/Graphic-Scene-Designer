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
    const [cursorPosition, setCursorPosition] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [distanceInfo, setDistanceInfo] = useState({ visible: false, distance: '0.00', x: 0, y: 0 });

    useEffect(() => {
        setIsShapeClosed(props.isGridCreated);
    }, [props.isGridCreated]);

    // Сброс полигона при новом рисовании
    useEffect(() => {
        if (props.resetDrawing) setIsShapeClosed(false);
    }, [props.resetDrawing]);

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

        // Вычисление расстояния в метрах
        const calculateDistance = (point1, point2) => {
            if (!point1 || !point2) return null;
            const dx = point2[0] - point1[0];
            const dz = point2[2] - point1[2];
            const distance = Math.sqrt(dx * dx + dz * dz) * 0.1; // 1 единица = 0.1 м
            return distance.toFixed(2);
        };

        // Обработка событий мыши
        useEffect(() => {
            const handleMouseDown = (event) => {
                if (isDragging.current || event.button !== 0) return;
                setIsMouseDown(true);
            };

            const handleMouseUp = (event) => {
                if (event.button !== 0 || !isMouseDown) return;
                setIsMouseDown(false);

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                if (!raycaster.current.ray.intersectPlane(plane.current, intersection)) return;

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

            const handleMouseMove = (event) => {
                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                if (raycaster.current.ray.intersectPlane(plane.current, intersection)) {
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const newCursorPosition = [snappedX, 0, snappedZ];
                    setCursorPosition(newCursorPosition);
                    if (props.isDrawing) {
                        const distance = calculateDistance(props.gridPoints[props.gridPoints.length - 1], newCursorPosition);
                        setDistanceInfo({
                            visible: !!distance,
                            distance: distance || '0.00',
                            x: event.clientX,
                            y: event.clientY
                        });
                    } else {
                        setDistanceInfo({ visible: false, distance: '0.00', x: 0, y: 0 });
                    }
                } else {
                    setCursorPosition(null);
                    setDistanceInfo({ visible: false, distance: '0.00', x: 0, y: 0 });
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
            gl.domElement.addEventListener('mouseup', handleMouseUp);
            gl.domElement.addEventListener('mousemove', handleMouseMove);
            gl.domElement.addEventListener('contextmenu', handleRightClick);
            return () => {
                gl.domElement.removeEventListener('mousedown', handleMouseDown);
                gl.domElement.removeEventListener('mouseup', handleMouseUp);
                gl.domElement.removeEventListener('mousemove', handleMouseMove);
                gl.domElement.removeEventListener('contextmenu', handleRightClick);
            };
        }, [ props.isDrawing, props.gridPoints, isShapeClosed, props.onPointAdded, props.isGridCreated, props.selectedModelType, props.addModel, props.onModelPlaced, isMouseDown ]);

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
                setDistanceInfo({ visible: false, distance: '0.00', x: 0, y: 0 });
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
            <Canvas orthographic camera={{ position: [0, 100, 0], zoom: 30, near: 0.1 }}
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
                    <CustomGrid gridScale={props.gridScale} gridDivisions={props.gridDivisions} isDrawing={props.isDrawing}
                        gridPoints={props.gridPoints} isShapeClosed={isShapeClosed} onShapeComplete={handleShapeComplete}
                        isGridCreated={props.isGridCreated} cursorPosition={cursorPosition} isMouseDown={isMouseDown}
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
                <TransformWrapper selectedObject={selectedRef} mode={transformMode} isActive={isTransformActive}
                    orbitControlRef={orbitControlRef} onChangeStart={() => { isDragging.current = true; }}
                    onChangeEnd={() => {
                        setTimeout(() => {
                            isDragging.current = false;
                        }, 50);
                    }} onScaleChange={(newScale) => {
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
                    }} onRotateChange={(newRotation) => {
                        if (props.selectedModelId) {
                            props.onModelUpdate(props.selectedModelId, { rotation: newRotation });
                        }
                    }}
                />
                <OrbitControls ref={orbitControlRef} makeDefault />
                {(props.isDrawing || props.isGridCreated) && <DrawingHandler />}
            </Canvas>
            {!props.isGridCreated && !props.isDrawing && (
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 5 }}>
                    Начните проект с создания Планировки
                </div>
            )

            }
            {props.isGridCreated && (
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 5 }}>
                    Выберите объект из категорий и расположите внутри сцены
                </div>
            )}
            {props.isDrawing && (
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 5 }}>
                    Нажимайте ЛКМ по сетке, чтобы рисовать планировку, соедините первую и последнюю точки для завершения.
                    <p style={{marginBottom: 5}}>
                        ПКМ для сброса последней точки
                    </p>
                    <p style={{marginBottom: 5}}>
                        Ecs для сброса всей планировки
                    </p>
                </div>
            )}
            {distanceInfo.visible && (
                <div style={{ position: 'fixed', top: distanceInfo.y + 10, left: distanceInfo.x + 10, color: 'white', background: 'rgba(0,0,0,0.2)', padding: '5px', pointerEvents: 'none', zIndex: 1000 }} >
                    {distanceInfo.distance} м
                </div>
            )}
        </div>
    );
};

export default Scene;