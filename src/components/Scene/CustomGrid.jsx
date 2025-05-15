import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import floor from '../../images/floor.jpg';
import wall from '../../images/wall.jpg';

// Компонент для рендеринга пользовательской сетки, пола и стен
const CustomGrid = ({ gridPoints, isShapeClosed, onShapeComplete, children }) => {
    const groupRef = useRef(new THREE.Group());
    const pointsGeometryRef = useRef(new THREE.BufferGeometry());
    const linesGeometryRef = useRef(new THREE.BufferGeometry());
    const floorMeshRef = useRef(null);
    const wallsGroupRef = useRef(new THREE.Group());

    // Материалы для точек и линий
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 5, sizeAttenuation: false });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // Загрузка текстур (заглушки: цвета, можно заменить на реальные текстуры)
    const floorTexture = useLoader(THREE.TextureLoader, floor);
    const wallTexture = useLoader(THREE.TextureLoader, wall);

    // Материалы для пола и стен
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture || null,
        color: floorTexture ? 0xffffff : 0xcccccc, // Серый, если нет текстуры
        side: THREE.DoubleSide,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture || null,
        color: wallTexture ? 0xffffff : 0x888888, // Темно-серый, если нет текстуры
        side: THREE.DoubleSide,
    });

    // Инициализация объектов сцены
    useEffect(() => {
        const group = groupRef.current;

        // Точки
        const points = new THREE.Points(pointsGeometryRef.current, pointMaterial);
        group.add(points);

        // Линии
        const lines = new THREE.Line(linesGeometryRef.current, lineMaterial);
        group.add(lines);

        // Группа для стен
        group.add(wallsGroupRef.current);

        // Установка начальной пустой геометрии
        pointsGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute([], 3)
        );
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute([], 3)
        );

        return () => {
            group.remove(points, lines, wallsGroupRef.current);
            if (floorMeshRef.current) group.remove(floorMeshRef.current);
        };
    }, []);

    // Обновление точек, линий, пола и стен
    useEffect(() => {
        const points = gridPoints.flat();

        if (points.length > 0 && points.length % 3 !== 0) {
            return;
        }

        // Обновление геометрии точек
        pointsGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(points, 3)
        );
        pointsGeometryRef.current.needsUpdate = true;

        // Обновление геометрии линий
        const linePoints = isShapeClosed && points.length >= 9
            ? [...points, points[0], points[1], points[2]]
            : points;
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePoints, 3)
        );
        linesGeometryRef.current.needsUpdate = true;

        // Создание пола и стен при закрытом полигоне
        if (isShapeClosed && gridPoints.length >= 3) {
            // Защита от пустого gridPoints
            if (gridPoints.length === 0) return;

            // Создание пола
            const shape = new THREE.Shape();
            gridPoints.forEach(([x, , z], i) => {
                if (i === 0) {
                    shape.moveTo(x, z);
                } else {
                    shape.lineTo(x, z);
                }
            });

            const floorGeometry = new THREE.ShapeGeometry(shape);
            const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
            floorMesh.rotation.x = Math.PI / 2;
            groupRef.current.add(floorMesh);
            if (floorMeshRef.current) {
                groupRef.current.remove(floorMeshRef.current);
            }
            floorMeshRef.current = floorMesh;

            // Создание стен
            wallsGroupRef.current.children.forEach((child) => {
                wallsGroupRef.current.remove(child);
            });

            const wallHeight = 3; // Высота стен
            const wallThickness = 0.2; // Толщина стен

            for (let i = 0; i < gridPoints.length; i++) {
                const p1 = gridPoints[i];
                const p2 = gridPoints[(i + 1) % gridPoints.length];

                const x1 = p1[0], z1 = p1[2];
                const x2 = p2[0], z2 = p2[2];

                // Вычисление длины стены и позиции
                const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
                const centerX = (x1 + x2) / 2;
                const centerZ = (z1 + z2) / 2;

                // Вычисление угла поворота
                const angle = -Math.atan2(z2 - z1, x2 - x1);

                // Создание геометрии стены
                const wallGeometry = new THREE.BoxGeometry(length, wallHeight, wallThickness);
                const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

                // Позиционирование и поворот стены
                wallMesh.position.set(centerX, wallHeight / 2, centerZ);
                wallMesh.rotation.y = angle;
                wallsGroupRef.current.add(wallMesh);
            }

            onShapeComplete(true);
        }
    }, [gridPoints, isShapeClosed, onShapeComplete]);

    return <primitive object={groupRef.current}>{children}</primitive>;
};

export default CustomGrid;