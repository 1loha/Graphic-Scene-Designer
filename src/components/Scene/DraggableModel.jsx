import { Clone, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "./Grid";
import { useFrame } from "@react-three/fiber";

export default function DraggableModel(props) {
    const ref = useRef();
    const pos = useRef(props.position || [0, 0, 0]);
    const rot = useRef(props.rotation || [0, 0, 0]);
    const scl = useRef(props.scale || [1, 1, 1]);

    const { scene } = useGLTF(props.modelPath);

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

    useEffect(() => {
        scl.current = props.scale || [1, 1, 1];
    }, [props.scale]);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.traverse((child) => {
            if (child.isMesh && child.material) child.material.opacity = props.isSelected ? 0.5 : 1.0;
        });
        if (props.isSelected && props.onRefReady) props.onRefReady(ref.current);
        const handleTransform = () => {
            if (ref.current && props.isSelected && props.onTransform) {
                const newRotation = [
                    ref.current.rotation.x,
                    ref.current.rotation.y,
                    ref.current.rotation.z
                ];
                rot.current = newRotation;
                props.onTransform(newRotation);
            }
        };

        if (props.isSelected) ref.current.addEventListener('objectChange', handleTransform);

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('objectChange', handleTransform);
            }
        };
    }, [props.isSelected, props.onRefReady, props.onTransform]);

    const handleDrag = ({ x, z }) => {
        const newX = Math.round(x);
        const newZ = Math.round(z);
        const newPosition = [newX, props.position[1] || 0, newZ];
        pos.current = newPosition;
        props.onDrag(newPosition);
    };

    const [events] = useDrag(handleDrag);

    useFrame((_, delta) => {
        if (!ref.current) return;

        if (props.isSelected && props.onTransform) {
            const newRotation = [
                ref.current.rotation.x,
                ref.current.rotation.y,
                ref.current.rotation.z
            ];
            props.onTransform(newRotation);
        }
    });

    return (
        <Clone
            ref={ref}
            object={clonedScene}
            {...events}
            position={props.position || [0, 0, 0]}
            rotation={props.rotation || [0, 0, 0]}
            scale={props.scale || [1, 1, 1]}
            onClick={(e) => {
                if (!props.isGridCreated || !props.selectedModelType) {
                    e.stopPropagation();
                    props.onClick();
                }
            }}
        />
    );
}