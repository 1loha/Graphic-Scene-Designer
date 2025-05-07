import {Clone, useGLTF} from "@react-three/drei";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
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
                                           onDrag,}) {
    const ref = useRef();
    const pos = useRef([...position]);
    const rot = useRef([...rotation]);
    const scl = useRef([...scale]);

    const { scene } = useGLTF(modelPath);

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.geometry = child.geometry.clone();
                if (child.material) {
                    child.material = child.material.clone();
                    child.material.transparent = true; // для выделения
                }
            }
        });
        return clone;
    }, [scene]);

    useEffect(() => {
        scl.current = [...scale];
    }, [scale]);

    // Устанавливаем прозрачность для выделенного объекта
    useEffect(() => {
        if (ref.current) {
            ref.current.traverse((child) => {
                if (child.isMesh) {
                    //child.material.transparent = true;
                    child.material.opacity = isSelected ? 0.5 : 1.0;
                }
            });
        }
    }, [isSelected]);

    // перемещение
    const handleDrag = ({ x, z }) => {
        const cellSize = gridScale / gridDivisions;
        const newX = MathUtils.clamp(
            Math.round(x / cellSize) * cellSize + cellSize / 2,
            -gridScale / 2 + cellSize / 2,
            gridScale / 2 - cellSize / 2
        );
        const newZ = MathUtils.clamp(
            Math.round(z / cellSize) * cellSize + cellSize / 2,
            -gridScale / 2 + cellSize / 2,
            gridScale / 2 - cellSize / 2
        );
        const newPosition = [newX, position[1], newZ];
        pos.current = newPosition;
        onDrag(newPosition);
    };

    const [events] = useDrag(handleDrag);

    // обновляет позицию модели
    useFrame((_, delta) => {
        if (!ref.current) return;
        easing.damp3(ref.current.position, pos.current, 0.1, delta);
        easing.damp3(ref.current.rotation, rot.current, 0.1, delta);
        easing.damp3(ref.current.scale, scl.current, 0.1, delta);

    });

    return (
        <Clone ref={ref}
               object={clonedScene}
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
