import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

// Компонент для управления трансформацией (вращение и масштабирование)
export const TransformWrapper = ({
                                     selectedObject,
                                     mode,
                                     isActive,
                                     orbitControlRef,
                                     onChangeStart,
                                     onChangeEnd,
                                     onScaleChange,
                                     onRotateChange,
                                 }) => {
    // Доступ к камере и WebGL-контексту
    const { camera, gl } = useThree();
    // Ссылка на TransformControls
    const controlsRef = useRef();

    // Настройка TransformControls при изменении режима, объекта или активности
    useEffect(() => {
        if (!controlsRef.current || !selectedObject) return;
        const controls = controlsRef.current;

        if (!isActive || (mode !== 'rotate' && mode !== 'scale')) {
            controls.detach(); // Отключает управление, если неактивно или режим translate
            if (orbitControlRef.current) orbitControlRef.current.enabled = true;
            return;
        }

        // Настройка режима трансформации
        controls.setMode(mode);
        // Показ осей для масштабирования
        controls.showX = mode === 'scale';
        controls.showY = mode === 'scale';
        controls.showZ = mode === 'scale';
        // Для вращения — только ось Y
        if (mode === 'rotate') {
            controls.showX = false;
            controls.showY = true;
            controls.showZ = false;
        }

        // Обработчики событий трансформации
        const handleChange = () => {
            if (orbitControlRef.current) {
                orbitControlRef.current.enabled = !controls.dragging; // Отключает OrbitControls во время трансформации
            }
            if (controls.dragging) {
                console.log('TransformControls dragging:', mode); // Отладка
                onChangeStart?.(); // Сигнализирует о начале трансформации
            } else {
                onChangeEnd?.(); // Сигнализирует о завершении
            }
        };

        const handleObjectChange = () => {
            if (controls.dragging && selectedObject) {
                console.log('TransformControls objectChange:', mode, selectedObject.rotation.toArray(), selectedObject.scale.toArray()); // Отладка
                onChangeStart?.();
                if (mode === 'scale' && onScaleChange) {
                    const newScale = [
                        selectedObject.scale.x,
                        selectedObject.scale.y,
                        selectedObject.scale.z,
                    ];
                    onScaleChange(newScale); // Обновляет масштаб
                }
                if (mode === 'rotate' && onRotateChange) {
                    const newRotation = [
                        selectedObject.rotation.x,
                        selectedObject.rotation.y,
                        selectedObject.rotation.z,
                    ];
                    onRotateChange(newRotation); // Обновляет вращение
                }
            } else {
                onChangeEnd?.();
            }
        };

        controls.addEventListener('dragging-changed', handleChange);
        controls.addEventListener('objectChange', handleObjectChange);
        return () => {
            controls.removeEventListener('dragging-changed', handleChange);
            controls.removeEventListener('objectChange', handleObjectChange);
            if (orbitControlRef.current) orbitControlRef.current.enabled = true;
        };
    }, [mode, selectedObject, isActive, orbitControlRef, onChangeStart, onChangeEnd, onScaleChange, onRotateChange]);

    // Рендеринг TransformControls только для rotate и scale с активным объектом
    if (!selectedObject || !isActive || (mode !== 'rotate' && mode !== 'scale')) {
        return null;
    }

    return (
        <TransformControls
            ref={controlsRef}
            object={selectedObject}
            mode={mode}
            camera={camera}
            domElement={gl.domElement}
        />
    );
};