import {useGLTF} from "@react-three/drei";
import React, {useCallback, useRef} from "react";
import {MathUtils} from "three";
import {useDrag} from "./Grid";
import {useFrame} from "@react-three/fiber";
import {easing} from "maath";

// function Model({ modelPath, position }) {
//     const { scene } = useGLTF(modelPath);
//     return <primitive object={scene} position={position} />;
// }
// function DraggableModel({position = [0, 0, 0],
//                             gridScale = 20,
//                             gridDivisions = 40,
//                             modelPath,
//                             ...props}) {
//     const ref = useRef();
//     const pos = useRef(position);
//     const { scene } = useGLTF(modelPath);
//     const baseSize = 0.5;
//
//     const onDrag = useCallback(({ x, z }) => {
//         const cellSize = gridScale / gridDivisions;
//         const halfGrid = gridScale / 2;
//         const minBound = -halfGrid + baseSize;
//         const maxBound = halfGrid - baseSize;
//
//         pos.current = [
//             // X-координата с привязкой к сетке и ограничениями
//             MathUtils.clamp(
//                 Math.round(x / cellSize) * cellSize + cellSize/2,
//                 minBound + cellSize/2,
//                 maxBound - cellSize/2
//             ),
//             // Y не изменяется
//             position[1],
//             // Z-координата с привязкой к сетке и ограничениями
//             MathUtils.clamp(
//                 Math.round(z / cellSize) * cellSize + cellSize/2,
//                 minBound + cellSize/2,
//                 maxBound - cellSize/2
//             )
//         ];
//     }, [gridScale, gridDivisions, position, baseSize]);
//
//     const [events] = useDrag(onDrag);
//
//     // обновляет позицию модели
//     useFrame((state, delta) => {
//         easing.damp3(ref.current.position, pos.current, 0.1, delta);
//     });
//
//     return <primitive ref={ref} object={scene} {...events} {...props} />;
// }

export default function Model({ modelPath, position = [0, 0, 0], gridScale = 20, gridDivisions = 40 }) {
    const ref = useRef();
    const pos = useRef(position);
    const { scene } = useGLTF(modelPath);
    const baseSize = 0.5;

    const onDrag = useCallback(({ x, z }) => {
        const cellSize = gridScale / gridDivisions;
        const halfGrid = gridScale / 2;
        const minBound = -halfGrid + baseSize;
        const maxBound = halfGrid - baseSize;

        pos.current = [
            // X-координата с привязкой к сетке и ограничениями
            MathUtils.clamp(
                Math.round(x / cellSize) * cellSize + cellSize/2,
                minBound + cellSize/2,
                maxBound - cellSize/2
            ),
            // Y не изменяется
            position[1],
            // Z-координата с привязкой к сетке и ограничениями
            MathUtils.clamp(
                Math.round(z / cellSize) * cellSize + cellSize/2,
                minBound + cellSize/2,
                maxBound - cellSize/2
            )
        ];
    }, [gridScale, gridDivisions, position, baseSize]);

    const [events] = useDrag(onDrag);

    useFrame((state, delta) => {
        easing.damp3(ref.current.position, pos.current, 0.1, delta);
    });

    return <primitive ref={ref} object={scene} {...events} position={position} />;
}
