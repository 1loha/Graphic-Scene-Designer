import { Vector3, Plane } from 'three';
import { useThree } from '@react-three/fiber';
import {useRef, useCallback, useEffect} from 'react';
import * as THREE from "three";


// Хук для обработки перетаскивания
export function useDrag(onDrag) {
    const v = new Vector3();
    const p = new Plane(new Vector3(0, 1, 0), 0);
    const { gl, camera, controls } = useThree();
    const isDragging = useRef(false);
    const raycaster = useRef(new THREE.Raycaster());

    // Начало перетаскивания
    const down = useCallback(
        (e) => {
            e.stopPropagation();
            isDragging.current = true;
            if (controls?.enabled !== undefined) controls.enabled = false;
            e.target.setPointerCapture(e.pointerId);
        },
        [controls]
    );

    // Завершение перетаскивания
    const up = useCallback(
        (e) => {
            isDragging.current = false;
            if (controls?.enabled !== undefined) controls.enabled = true;
            e.target.releasePointerCapture(e.pointerId);
        },
        [controls]
    );

    // Обработка движения мыши
    const move = useCallback((e) => {
            if (!isDragging.current) return;
            e.stopPropagation();

            const rect = gl.domElement.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
            if (raycaster.current.ray.intersectPlane(p, v)) {
                onDrag({ x: v.x, z: v.z });
            }
        },
        [onDrag, gl, camera]
    );

    // Регистрация событий мыши
    useEffect(() => {
        gl.domElement.addEventListener('pointermove', move);
        gl.domElement.addEventListener('pointerup', up);
        return () => {
            gl.domElement.removeEventListener('pointermove', move);
            gl.domElement.removeEventListener('pointerup', up);
        };
    }, [move, up, gl]);

    return [{ onPointerDown: down, onPointerUp: up, onPointerMove: move }];
}

// Компонент для создания сетки
export function Grid({ children, gridScale, gridDivisions, ...props }) {
    const grid = useRef();
    const plane = useRef();

    return (
        <group {...props}>
            <group scale={gridScale}>
                <gridHelper
                    ref={grid}
                    args={[1, gridDivisions, '#888', '#bbb']}
                    userData={{ isGrid: true }}
                />
                <mesh
                    ref={plane}
                    rotation-x={-Math.PI / 2}
                    userData={{ isGrid: true }}
                >
                    <planeGeometry />
                    <meshStandardMaterial visible={false} />
                </mesh>
            </group>
            {children}
        </group>
    );
}