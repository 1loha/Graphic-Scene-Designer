import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Plane, useOBJ, useGLTF } from '@react-three/drei';
import s from './Scene.module.css';

function Model(props) {
    // относительный путь public
    const { scene } = useGLTF(props.path);
    return <primitive object={scene} scale={props.scale}
                      position={props.position}
                      rotation={props.rotation}
    />;
}

const Scene = () => {

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
            <Model path='/steve/source/model.gltf'
                   scale={0.5}
                   position={[-1, 0, -2]}
            />
            <Model path='/shameless_loona_pose/scene.gltf'
                scale={0.5}
                position={[2, 0, 2]}
            />
            {/*<axesHelper args={[5]} />*/}

            {/*<Plane*/}
            {/*    // args={[30, 30]} // Размер*/}
            {/*    // rotation={[-Math.PI / 2, 0, 0]}*/}
            {/*    >*/}
            {/*    <meshStandardMaterial*/}
            {/*        color="#ffffff"*/}
            {/*        roughness={0.8}*/}
            {/*        metalness={0.2}*/}
            {/*    />*/}
            {/*</Plane>*/}
        </Canvas>
    );
};

export default Scene;