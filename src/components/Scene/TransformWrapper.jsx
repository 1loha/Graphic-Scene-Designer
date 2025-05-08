import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export const TransformWrapper = ({selectedObject,
                                     mode,
                                     orbitControlRef,
                                     onChangeStart,
                                     onChangeEnd
                                 }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();

    useEffect(() => {
        if (!controlsRef.current || !selectedObject) return;
        const controls = controlsRef.current;

        // Настройка осей вращения
        controls.setMode(mode);
        controls.showX = mode === 'translate' || mode === 'scale';
        controls.showY = true;
        controls.showZ = mode === 'translate' || mode === 'scale';

        // Для вращения - только ось Y
        if (mode === 'rotate') {
            controls.showX = false;
            controls.showZ = false;
        }

        const handleChange = () => {
            if (orbitControlRef.current) orbitControlRef.current.enabled = !controls.dragging;
            if (controls.dragging) onChangeStart?.();
            else onChangeEnd?.();
        };
        const handleObjectChange = () => {
            if (controls.dragging) {
                onChangeStart?.();
            } else {
                onChangeEnd?.();
            }
            // if (controls.dragging) {
            //     onChangeStart?.();
            // } else {
            //     const newRotation = [
            //         selectedObject.rotation.x,
            //         selectedObject.rotation.y,
            //         selectedObject.rotation.z
            //     ];
            //     onChangeEnd?.(newRotation);
            // }
        };
        controls.addEventListener('dragging-changed', handleChange);
        controls.addEventListener('objectChange', handleObjectChange);
        return () => {
            controls.removeEventListener('dragging-changed', handleChange);
            controls.removeEventListener('objectChange', handleObjectChange);
        };
    }, [mode, selectedObject, orbitControlRef, onChangeStart, onChangeEnd]);

    if (!selectedObject) return null;

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