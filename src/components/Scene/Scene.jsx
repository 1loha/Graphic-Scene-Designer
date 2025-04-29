import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import s from './Scene.module.css';

const Scene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Инициализация сцены, камеры и рендерера
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75, // угол обзора
            window.innerWidth / window.innerHeight, // соотношение сторон
            0.1, // ближняя плоскость отсечения
            1000 // дальняя плоскость отсечения
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xf0f0f0); // серый фон

        // Добавление куба
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Позиционирование камеры
        camera.position.z = 5;

        // Добавление рендерера в DOM
        mountRef.current.appendChild(renderer.domElement);

        // Обработчик изменения размера окна
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Анимация
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Очистка при размонтировании
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return ( <div className={s.scene} ref={mountRef} /> );
};

export default Scene;