import { Clone, useGLTF } from "@react-three/drei";
import React, {useEffect, useMemo, useRef, useState} from "react";
import { MathUtils } from "three";
import { useDrag } from "./Grid";
import { useFrame } from "@react-three/fiber";

export default function DraggableModel({modelPath,
                                           position = [0, 0, 0],
                                           rotation = [0, 0, 0],
                                           scale = [1, 1, 1],
                                           gridScale = 20,
                                           gridDivisions = 40,
                                           isSelected,
                                           onClick,
                                           onDrag,
                                           onRefReady,
                                           onTransform}) {
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
                child.material = child.material.clone();
                child.material.transparent = true; // для выделения
            }
        });
        return clone;
    }, [scene]);

    useEffect(() => {
        scl.current = [...scale];
    }, [scale]);

    useEffect(() => {
        if (!ref.current) return;
        // Устанавливаем прозрачность для выделенного объекта
        ref.current.traverse((child) => {
            if (child.isMesh && child.material) child.material.opacity = isSelected ? 0.5 : 1.0;
        });
        // Уведомляем родительский компонент о готовности ref
        if (isSelected && onRefReady) onRefReady(ref.current);
        // Слушаем изменения трансформации
        const handleTransform = () => {
            if (ref.current && isSelected && onTransform) {
                const newRotation = [
                    ref.current.rotation.x,
                    ref.current.rotation.y,
                    ref.current.rotation.z
                ];
                rot.current = newRotation;
                onTransform(newRotation);
            }
        };

        if (isSelected) ref.current.addEventListener('objectChange', handleTransform);

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('objectChange', handleTransform);
            }
        };
    }, [isSelected, onRefReady, onTransform]);

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

        if (isSelected && onTransform) {
            const newRotation = [
                ref.current.rotation.x,
                ref.current.rotation.y,
                ref.current.rotation.z
            ];
            onTransform(newRotation);
        }
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
