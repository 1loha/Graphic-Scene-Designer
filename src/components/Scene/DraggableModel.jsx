import { Clone, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "./Grid";
import { isPointInPolygon } from "./isPointInPolygon";

// Компонент для перетаскиваемой 3D-модели
export default function DraggableModel(props) {
    // Ссылка на объект модели
    const ref = useRef();
    // Текущие позиция и масштаб
    const pos = useRef(props.position || [0, 0, 0]);
    const scl = useRef(props.scale || [1, 1, 1]);

    // Загрузка 3D-модели из GLTF-файла
    const { scene } = useGLTF(props.modelPath);

    // Клонирование сцены для предотвращения изменений оригинала
    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.geometry = child.geometry.clone();
                child.material = child.material.clone();
                child.material.transparent = true;
            }
        });
        return clone;
    }, [scene]);

    // Обновление масштаба при изменении пропса
    useEffect(() => {
        scl.current = props.scale || [1, 1, 1];
    }, [props.scale]);

    // Управление прозрачностью и передача ссылки на выбранную модель
    useEffect(() => {
        if (!ref.current) return;
        ref.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = props.isSelected ? 0.5 : 1.0; // Полупрозрачность для выбранной модели
            }
        });
        if (props.isSelected && props.onRefReady) {
            props.onRefReady(ref.current); // Передает ссылку родителю
        }
    }, [props.isSelected, props.onRefReady]);

    // Обработчик перетаскивания
    const handleDrag = ({ x, z }) => {
        if (props.transformMode !== 'translate') return; // Перетаскивание только в режиме translate
        const newX = Math.round(x);
        const newZ = Math.round(z);
        const newPosition = [newX, props.position[1] || 0, newZ];
        console.log('Attempting drag to:', newPosition);
        if (isPointInPolygon(newPosition, props.gridPoints)) {
            console.log('Position valid, updating to:', newPosition);
            pos.current = newPosition;
            props.onDrag(newPosition); // Обновляет позицию
        } else {
            console.log('Position outside polygon, keeping last position:', pos.current);
        }
    };

    // Настройка перетаскивания с помощью useDrag
    const [events] = useDrag(handleDrag, {
        enabled: props.isSelected && props.transformMode === 'translate' // Активирует перетаскивание только в нужном режиме
    });

    // Условное применение событий мыши
    const isTranslateMode = props.transformMode === 'translate';
    const clickHandler = isTranslateMode
        ? (e) => {
            if (!props.isGridCreated || !props.selectedModelType) {
                e.stopPropagation();
                props.onClick(); // Выбирает модель при клике
            }
        }
        : undefined;
    const dragEvents = isTranslateMode ? events : {};

    return (
        <Clone
            ref={ref}
            object={clonedScene}
            {...dragEvents}
            position={props.position || [0, 0, 0]}
            rotation={props.rotation || [0, 0, 0]}
            scale={props.scale || [1, 1, 1]}
            onClick={clickHandler}
        />
    );
}