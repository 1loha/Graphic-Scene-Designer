import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CustomGrid from './CustomGrid';
import DraggableModel from './DraggableModel';
import { TransformWrapper } from './TransformWrapper';
import { isPointInPolygon } from './isPointInPolygon';

// Главный компонент сцены, управляющий 3D-рендерингом
const Scene = (props) => {
    // Состояние для отслеживания перетаскивания объектов
    const isDragging = useRef(false);
    // Ссылка на управление камерой (OrbitControls)
    const orbitControlRef = useRef();
    // Ссылка на выбранный объект для трансформации
    const [selectedRef, setSelectedRef] = useState(null);
    // Режим трансформации: 'translate' (перетаскивание), 'rotate' (вращение), 'scale' (масштабирование)
    const [transformMode, setTransformMode] = useState('translate'); // По умолчанию — перетаскивание
    // Активность трансформации
    const [isTransformActive, setIsTransformActive] = useState(false);
    // Флаг завершения формы полигона
    const [isShapeClosed, setIsShapeClosed] = useState(false);

    // Сбрасывает флаг завершения полигона при начале нового рисования
    useEffect(() => {
        if (props.resetDrawing) {
            setIsShapeClosed(false);
        }
    }, [props.resetDrawing]);

    // Обработчик завершения формы полигона
    const handleShapeComplete = (isComplete) => {
        if (isComplete) {
            props.onGridCreated(true); // Уведомляет, что полигон создан
        }
    };

    // Компонент для обработки мыши (рисование точек и размещение моделей)
    const DrawingHandler = () => {
        // Получает доступ к камере и WebGL-контексту
        const { camera, gl } = useThree();
        // Луч для определения точки пересечения мыши с плоскостью
        const raycaster = useRef(new THREE.Raycaster());
        // Плоскость XZ для пересечения (y=0)
        const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

        // Проверяет самопересечение полигона при добавлении новой точки
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
                    return true; // Обнаружено пересечение
                }
            }
            return false;
        };

        // Проверяет пересечение двух отрезков (для самопересечения)
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

            return t >= 0 && t <= 1 && u >= 0 && u <= 1; // True, если отрезки пересекаются
        };

        // Обработчик событий мыши
        useEffect(() => {
            // Обработка нажатия мыши (ЛКМ для добавления точек или моделей)
            const handleMouseDown = (event) => {
                if (isDragging.current || event.button !== 0) return; // Игнорирует, если не ЛКМ или идет перетаскивание

                const rect = gl.domElement.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersection = new THREE.Vector3();
                raycaster.current.ray.intersectPlane(plane.current, intersection);

                if (!intersection) return; // Нет пересечения с плоскостью

                if (props.isDrawing && !isShapeClosed) {
                    // Режим рисования: добавление точки полигона
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const newPoint = [snappedX, 0, snappedZ];

                    // Проверка на дублирование последней точки
                    const lastPoint = props.gridPoints[props.gridPoints.length - 1];
                    if (
                        lastPoint &&
                        newPoint[0] === lastPoint[0] &&
                        newPoint[2] === lastPoint[2]
                    ) {
                        return;
                    }

                    // Проверка закрытия полигона
                    if (props.gridPoints.length >= 3) {
                        const firstPoint = props.gridPoints[0];
                        const distance = Math.sqrt(
                            (newPoint[0] - firstPoint[0]) ** 2 +
                            (newPoint[2] - firstPoint[2]) ** 2
                        );
                        if (distance < 0.5) {
                            setIsShapeClosed(true); // Закрывает полигон
                            return;
                        }
                    }

                    // Проверка самопересечения
                    if (checkSelfIntersection(props.gridPoints, newPoint)) {
                        return;
                    }

                    props.onPointAdded(newPoint); // Добавляет новую точку
                } else if (props.isGridCreated && props.selectedModelType) {
                    // Режим размещения моделей
                    const snappedX = Math.round(intersection.x);
                    const snappedZ = Math.round(intersection.z);
                    const point = [snappedX, 0, snappedZ];
                    if (isPointInPolygon(point, props.gridPoints)) {
                        if (typeof props.addModel === 'function') {
                            props.addModel(
                                props.selectedModelType.category,
                                props.selectedModelType.type,
                                { position: point }
                            );
                            if (typeof props.onModelPlaced === 'function') {
                                props.onModelPlaced(); // Уведомляет о размещении модели
                            }
                        }
                    }
                }
            };

            // Обработка клика ПКМ (удаление последней точки полигона)
            const handleRightClick = (event) => {
                if (!props.isDrawing || event.button !== 2 || isShapeClosed) return;
                event.preventDefault();
                if (props.gridPoints.length > 0) {
                    const newPoints = props.gridPoints.slice(0, -1);
                    props.onPointAdded(newPoints); // Удаляет последнюю точку
                }
            };

            // Регистрация обработчиков событий
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

        return null; // Компонент не рендерит визуальных элементов
    };

    // Настройка управления камерой
    useEffect(() => {
        if (orbitControlRef.current) {
            orbitControlRef.current.enableRotate = !props.isDrawing; // Отключает вращение в режиме рисования
            orbitControlRef.current.enablePan = !props.isDrawing; // Отключает панорамирование в режиме рисования
            orbitControlRef.current.enableZoom = true; // Масштабирование всегда активно
        }
    }, [props.isDrawing]);

    // Обработка клавиш для управления трансформацией
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                props.onModelSelect(null); // Сбрасывает выбор модели
                setSelectedRef(null); // Очищает ссылку на объект
                setTransformMode('translate'); // Устанавливает режим перетаскивания
                setIsTransformActive(false); // Деактивирует трансформацию
                setIsShapeClosed(false); // Сбрасывает закрытие полигона
            }
            if (e.key === 'w' || e.key === 'ц') {
                setTransformMode('translate'); // Активирует режим перетаскивания
                setIsTransformActive(!!selectedRef); // Активно, только если есть выбранный объект
            }
            if (e.key === 'r' || e.key === 'к') {
                setTransformMode('rotate'); // Активирует режим вращения
                setIsTransformActive(!!selectedRef);
            }
            if (e.key === 's' || e.key === 'ы') {
                setTransformMode('scale'); // Активирует режим масштабирования
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
                        props.onModelSelect(null); // Сбрасывает выбор модели
                        setSelectedRef(null); // Очищает ссылку на объект
                        setTransformMode('translate'); // Сбрасывает режим на перетаскивание
                        setIsTransformActive(false); // Деактивирует трансформацию
                    }
                }}            >
                <ambientLight intensity={0.5 * Math.PI} /> {/* Окружающее освещение */}
                <pointLight position={[10, 10, -5]} /> {/* Точечный источник света */}
                <gridHelper args={[100, 100, 0x888888, 0x888888]} /> {/* Сетка 100x100 */}
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
                                // Вычисление масштаба модели
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
                                                setSelectedRef(ref); // Устанавливает ссылку на выбранную модель
                                                setIsTransformActive(transformMode !== 'translate'); // Активирует трансформацию, если не translate
                                            }
                                        }}
                                        onClick={() => {
                                            props.onModelSelect(model.id); // Выбирает модель
                                            setTransformMode('translate'); // Устанавливает режим перетаскивания
                                            setIsTransformActive(false); // Деактивирует трансформацию при выборе
                                        }}
                                        onDrag={(newPosition) => {
                                            props.onModelUpdate(model.id, { position: newPosition }); // Обновляет позицию
                                            if (model.id !== props.selectedModelId)
                                                props.onModelSelect(model.id); // Выбирает модель, если не выбрана
                                        }}
                                        gridScale={props.gridScale}
                                        gridDivisions={props.gridDivisions}
                                        isGridCreated={props.isGridCreated}
                                        selectedModelType={props.selectedModelType}
                                        gridPoints={props.gridPoints}
                                        transformMode={transformMode} // Передает режим трансформации
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
                        isDragging.current = true; // Начинает трансформацию
                    }}
                    onChangeEnd={() => {
                        setTimeout(() => {
                            isDragging.current = false; // Завершает трансформацию
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
                                props.onModelUpdate(props.selectedModelId, { normalizedScale }); // Обновляет масштаб
                            }
                        }
                    }}
                    onRotateChange={(newRotation) => {
                        if (props.selectedModelId) {
                            props.onModelUpdate(props.selectedModelId, { rotation: newRotation }); // Обновляет вращение
                        }
                    }}
                />
                <OrbitControls ref={orbitControlRef} makeDefault /> {/* Управление камерой */}
                {props.isDrawing && <DrawingHandler />} {/* Обработчик рисования */}
                {props.isGridCreated && <DrawingHandler />} {/* Обработчик размещения моделей */}
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