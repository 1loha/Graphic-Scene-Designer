import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import Model from '../Model/Model';
import s from './Scene.module.css';

const Scene = ({ models }) => {
    return (
        <Canvas className={s.scene}
            camera={{fov: 80, position: [3, 5, 1]}}>
            <ambientLight intensity={.5} />
            <directionalLight position={[-2, 2, -2]} intensity={0.8} />
            <OrbitControls/>
            <Grid
                infiniteGrid // Бесконечная сетка
                cellSize={0.2} // Размер ячейки
                cellThickness={.6} // Толщина линий ячеек
                cellColor="#bababa" // Цвет линий ячеек
                sectionSize={5} // Размер секции
                sectionThickness={.5} // Толщина секций
                sectionColor="#777777" // Цвет секций
                fadeDistance={30} // Расстояние исчезновения
                fadeStrength={0} // Интенсивность исчезновения
            />
            {models.map((model, index) => (
                <Model
                    key={index}
                    path={model.path}
                    scale={model.scale}
                    position={model.position}
                />
            ))}
        </Canvas>
    );
};

export default Scene;