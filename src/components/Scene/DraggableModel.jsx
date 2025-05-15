import { Clone, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "./Grid";
import { isPointInPolygon } from "./isPointInPolygon";

// Компонент для перетаскиваемой 3D-модели
export default function DraggableModel(props) {
    // Ссылка на объект модели
    const ref = useRef();
    // Текущая позиция модели
    const pos = useRef(props.position || [0, 0, 0]);

    // Синхронизация позиции с пропсами
    useEffect(() => {
        pos.current = props.position || [0, 0, 0];
    }, [props.position]);

    // Загрузка 3D-модели GLTF
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

    // Управление прозрачностью и передача ссылки на выбранную модель
    useEffect(() => {
        if (!ref.current) return;
        ref.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = props.isSelected ? 0.5 : 1.0;
            }
        });
        if (props.isSelected && props.onRefReady) {
            props.onRefReady(ref.current);
        }
    }, [props.isSelected, props.onRefReady]);

    // Обработка перетаскивания модели
    const handleDrag = ({ x, z }) => {
        if (props.transformMode !== 'translate') return;
        const newX = Math.round(x);
        const newZ = Math.round(z);
        const newPosition = [newX, props.position[1] || 0, newZ];
        if (isPointInPolygon(newPosition, props.gridPoints)) {
            pos.current = newPosition;
            props.onDrag(newPosition);
        }
    };

    // Настройка перетаскивания
    const [events] = useDrag(handleDrag, {
        enabled: props.isSelected && props.transformMode === 'translate'
    });

    // Условное применение событий мыши для режима перетаскивания
    const isTranslateMode = props.transformMode === 'translate';
    const clickHandler = isTranslateMode? (e) => {
            if (!props.isGridCreated || !props.selectedModelType) {
                e.stopPropagation();
                props.onClick();
            }
        } : undefined;
    const dragEvents = isTranslateMode ? events : {};

    // Рендеринг модели
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