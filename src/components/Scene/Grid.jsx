import { Vector3, Plane } from 'three';
import { useThree } from '@react-three/fiber';
import {useRef, useCallback, useEffect} from 'react';
import * as THREE from "three";

const v = new Vector3(); // Helper vector for calculations
const p = new Plane(new Vector3(0, 1, 0), 0); // XZ plane at Y=0 for intersections

// Handle dragging events
export function useDrag(onDrag) {
    const { gl, camera, controls } = useThree();
    const isDragging = useRef(false);
    const raycaster = useRef(new THREE.Raycaster());

    // Start dragging (disable camera controls)
    const down = useCallback(
        (e) => {
            e.stopPropagation();
            console.log('useDrag: Pointer down');
            isDragging.current = true;
            if (controls) controls.enabled = false;
            e.target.setPointerCapture(e.pointerId);
        },
        [controls]
    );

    // End dragging
    const up = useCallback(
        (e) => {
            console.log('useDrag: Pointer up');
            isDragging.current = false;
            if (controls) controls.enabled = true;
            e.target.releasePointerCapture(e.pointerId);
        },
        [controls]
    );

    // Handle movement
    const move = useCallback(
        (e) => {
            if (!isDragging.current) return;
            e.stopPropagation();

            const rect = gl.domElement.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);
            if (raycaster.current.ray.intersectPlane(p, v)) {
                console.log('useDrag: Dragging to', { x: v.x, z: v.z });
                onDrag({ x: v.x, z: v.z });
            }
        },
        [onDrag, gl, camera]
    );

    // Attach move and up listeners to the canvas
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

// Create grid
export function Grid({ children, gridScale, gridDivisions, ...props }) {
    // References to grid and plane DOM elements
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