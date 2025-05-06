import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Grid } from './Grid';
import DraggableModel from "./DraggableModel";

const Scene = ({ objects, models, selectedModelId, onModelSelect, onModelUpdate }) => {
    const gridScale = 20;
    const gridDivisions = 40;

    // Если клик не по объекту - снимаем выделение
    const handleCanvasClick = (e) => {
        // Проверяем наличие пересечений
        if (!e.intersections || e.intersections.length === 0) {
            // Клик по пустой области
            onModelSelect(null);
            return;
        }

        // Проверяем первый объект в пересечениях
        if (!e.intersections[0] || e.intersections[0].object.userData?.isGrid) {
            onModelSelect(null);
        }

    };

    return (
        <Canvas orthographic
                camera={{ position: [10, 10, 10], zoom: 50, near: 0.1 }}
                onClick={handleCanvasClick}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, -5]} />
            <Grid gridScale={gridScale} gridDivisions={gridDivisions}>
                {models.map(model => (
                    <DraggableModel
                        key={model.id}
                        modelPath={objects[model.type].path}
                        scale={model.scale}
                        position={model.position}
                        rotation={model.rotation}
                        isSelected={model.id === selectedModelId}
                        onClick={() => onModelSelect(model.id)}
                        onDrag={(newPosition) => {
                            onModelUpdate(model.id, { position: newPosition });
                            // При перемещении автоматически выбираем модель
                            if (model.id !== selectedModelId) {
                                onModelSelect(model.id);
                            }
                        }}

                    />
                ))}
            </Grid>
            <OrbitControls makeDefault />
        </Canvas>
    );
};

export default Scene;