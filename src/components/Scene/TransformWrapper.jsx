import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

// Компонент для управления трансформацией объектов
export const TransformWrapper = ({ selectedObject,
                                     mode, isActive,
                                     orbitControlRef,
                                     onChangeStart,
                                     onChangeEnd,
                                     onScaleChange,
                                     onRotateChange,}) => {
    // Доступ к сцене и ссылка на управление
    const { camera, gl } = useThree();
    const controlsRef = useRef();

    // Настройка TransformControls
    useEffect(() => {
        if (!controlsRef.current || !selectedObject) return;
        const controls = controlsRef.current;

        if (!isActive || (mode !== 'rotate' && mode !== 'scale')) {
            controls.detach();
            if (orbitControlRef.current) orbitControlRef.current.enabled = true;
            return;
        }

        controls.setMode(mode);
        controls.showX = mode === 'scale';
        controls.showY = mode === 'scale';
        controls.showZ = mode === 'scale';
        if (mode === 'rotate') {
            controls.showX = false;
            controls.showY = true;
            controls.showZ = false;
        }

        const handleChange = () => {
            if (orbitControlRef.current) {orbitControlRef.current.enabled = !controls.dragging;}
            if (controls.dragging) {onChangeStart?.();} else {onChangeEnd?.();}
        };

        const handleObjectChange = () => {
            if (controls.dragging && selectedObject) {
                onChangeStart?.();
                if (mode === 'scale' && onScaleChange) {
                    const newScale = [
                        selectedObject.scale.x,
                        selectedObject.scale.y,
                        selectedObject.scale.z,
                    ];
                    onScaleChange(newScale);
                }
                if (mode === 'rotate' && onRotateChange) {
                    const newRotation = [
                        selectedObject.rotation.x,
                        selectedObject.rotation.y,
                        selectedObject.rotation.z,
                    ];
                    onRotateChange(newRotation);
                }
            } else onChangeEnd?.();
        };

        controls.addEventListener('dragging-changed', handleChange);
        controls.addEventListener('objectChange', handleObjectChange);
        return () => {
            controls.removeEventListener('dragging-changed', handleChange);
            controls.removeEventListener('objectChange', handleObjectChange);
            if (orbitControlRef.current) orbitControlRef.current.enabled = true;
        };
    }, [mode, selectedObject, isActive, orbitControlRef, onChangeStart, onChangeEnd, onScaleChange, onRotateChange]);

    // Рендеринг TransformControls
    if (!selectedObject || !isActive || (mode !== 'rotate' && mode !== 'scale')) return null;

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