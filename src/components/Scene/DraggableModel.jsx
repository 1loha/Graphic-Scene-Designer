import {Clone, useGLTF} from "@react-three/drei";
import React, {useCallback, useEffect, useRef} from "react";
import {MathUtils} from "three";
import {useDrag} from "./Grid";
import {useFrame} from "@react-three/fiber";
import {easing} from "maath";

export default function DraggableModel({modelPath,
                                           position = [0, 0, 0],
                                           rotation = [0, 0, 0],
                                           scale = [1, 1, 1],
                                           gridScale = 20,
                                           gridDivisions = 40,
                                           isSelected,
                                           onClick,
                                           onDrag, }) {
    const ref = useRef();
    const pos = useRef([...position]);
    const rot = useRef([...rotation]);
    const scl = useRef([...scale]);
    const { scene } = useGLTF(modelPath);
    const baseSize = 0.5;

    useEffect(() => {
        scl.current = [...scale];
    }, [scale]);

    // Устанавливаем прозрачность для выделенного объекта
    useEffect(() => {
        if (ref.current) {
            ref.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = isSelected ? 0.5 : 1.0;
                    // if (!child.userData.originalMaterial) {
                    //     child.userData.originalMaterial = child.material.clone();
                    // }
                }
            });
        }
    }, [isSelected]);

    // перемещение
    const handleDrag = useCallback(({ x, z }) => {
        const cellSize = gridScale / gridDivisions;
        const halfGrid = gridScale / 2;
        const minBound = -halfGrid + baseSize;
        const maxBound = halfGrid - baseSize;

        const newPosition = [
            MathUtils.clamp(
                Math.round(x / cellSize) * cellSize + cellSize / 2,
                minBound + cellSize / 2,
                maxBound - cellSize / 2
            ),
            position[1],
            MathUtils.clamp(
                Math.round(z / cellSize) * cellSize + cellSize / 2,
                minBound + cellSize / 2,
                maxBound - cellSize / 2
            )
        ];

        pos.current = newPosition;
        onDrag(newPosition);
    }, [gridScale, gridDivisions, position, baseSize, onDrag]);

    const [events] = useDrag(handleDrag);

    // обновляет позицию модели
    useFrame((state, delta) => {
        easing.damp3(ref.current.position, pos.current, 0.1, delta);
        easing.damp3(ref.current.rotation, rot.current, 0.1, delta);
        easing.damp3(ref.current.scale, scl.current, 0.1, delta);

    });

    return (
        <Clone ref={ref}
               object={scene}
               {...events}
               position={position}
               rotation={rotation}
               scale={scale}
               onClick={(e) => {
                   e.stopPropagation();
                   onClick();
               }}
        />
    );

}
