import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import floor from '../../images/floor.jpg';
import wall from '../../images/wall.png';

// Компонент для рендеринга пользовательской сетки, пола и стен
const CustomGrid = ({ gridPoints, isShapeClosed, onShapeComplete, children, isGridCreated, cursorPosition, isMouseDown }) => {
    const groupRef = useRef(new THREE.Group());
    const pointsGeometryRef = useRef(new THREE.BufferGeometry());
    const linesGeometryRef = useRef(new THREE.BufferGeometry());
    const floorMeshRef = useRef(null);
    const wallsGroupRef = useRef(new THREE.Group());
    const previewPointGeometryRef = useRef(new THREE.BufferGeometry());
    const previewLineGeometryRef = useRef(new THREE.BufferGeometry());

    // Создание материалов для точек, линий и предварительных элементов
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 5, sizeAttenuation: false });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const previewPointMaterial = new THREE.PointsMaterial({ color: 0x000000, size: 5, sizeAttenuation: false });
    const previewLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Загрузка текстур и создание материалов для пола и стен
    const floorTexture = useLoader(THREE.TextureLoader, floor);
    const wallTexture = useLoader(THREE.TextureLoader, wall);

    // Настройка текстур: повторение и смещение
    if (floorTexture) {
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(0.1, 0.1);
    }
    if (wallTexture) {
        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(2, 2);
    }

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture || null,
        color: 0xffffff,
        side: THREE.DoubleSide,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture || null,
        color: 0xffffff,
        side: THREE.DoubleSide,
    });

    // Инициализация объектов сцены
    useEffect(() => {
        const group = groupRef.current;
        const points = new THREE.Points(pointsGeometryRef.current, pointMaterial);
        const lines = new THREE.Line(linesGeometryRef.current, lineMaterial);
        const previewPoint = new THREE.Points(previewPointGeometryRef.current, previewPointMaterial);
        const previewLine = new THREE.Line(previewLineGeometryRef.current, previewLineMaterial);
        group.add(points, lines, wallsGroupRef.current, previewPoint, previewLine);
        pointsGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        linesGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        previewPointGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        previewLineGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

        return () => {
            group.remove(points, lines, wallsGroupRef.current, previewPoint, previewLine);
            if (floorMeshRef.current) group.remove(floorMeshRef.current);
        };
    }, []);

    // Обновление точек, линий, пола, стен и предварительных элементов
    useEffect(() => {
        if (!Array.isArray(gridPoints) || gridPoints.length === 0) {
            pointsGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            linesGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            previewPointGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            previewLineGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            if (floorMeshRef.current) {
                groupRef.current.remove(floorMeshRef.current);
                floorMeshRef.current = null;
            }
            while (wallsGroupRef.current.children.length > 0) {
                wallsGroupRef.current.remove(wallsGroupRef.current.children[0]);
            }
            return;
        }

        // Обновление точек и линий
        if (isGridCreated && isShapeClosed) {
            // Скрываем точки и линии после создания планировки
            pointsGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            linesGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        } else {
            // Обновление точек
            const points = gridPoints.flat();
            pointsGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            pointsGeometryRef.current.needsUpdate = true;

            // Обновление линий
            const linePoints = isShapeClosed && gridPoints.length >= 3
                ? [...points, points[0], points[1], points[2]]
                : points;
            linesGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
            linesGeometryRef.current.needsUpdate = true;
        }

        // Обновление предварительной точки и линии
        if (isMouseDown && cursorPosition && gridPoints.length > 0 && !isShapeClosed) {
            const lastPoint = gridPoints[gridPoints.length - 1];
            const previewPoint = [cursorPosition[0], cursorPosition[1], cursorPosition[2]];
            const previewLinePoints = [lastPoint[0], lastPoint[1], lastPoint[2], cursorPosition[0], cursorPosition[1], cursorPosition[2]];
            previewPointGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(previewPoint, 3));
            previewLineGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(previewLinePoints, 3));
            previewPointGeometryRef.current.needsUpdate = true;
            previewLineGeometryRef.current.needsUpdate = true;
        } else {
            previewPointGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            previewLineGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
            previewPointGeometryRef.current.needsUpdate = true;
            previewLineGeometryRef.current.needsUpdate = true;
        }

        // Обновление пола и стен
        if (isShapeClosed && gridPoints.length >= 3) {
            // Создание пола
            const shape = new THREE.Shape();
            gridPoints.forEach(([x, , z], i) => {
                if (i === 0) shape.moveTo(x, z);
                else shape.lineTo(x, z);
            });

            const floorGeometry = new THREE.ShapeGeometry(shape);
            const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
            floorMesh.rotation.x = Math.PI / 2;
            groupRef.current.add(floorMesh);
            if (floorMeshRef.current) groupRef.current.remove(floorMeshRef.current);
            floorMeshRef.current = floorMesh;

            // Очистка старых стен
            while (wallsGroupRef.current.children.length > 0) {
                wallsGroupRef.current.remove(wallsGroupRef.current.children[0]);
            }

            // Создание стен
            const wallHeight = 10;
            const wallThickness = 0.4;
            for (let i = 0; i < gridPoints.length; i++) {
                const p1 = gridPoints[i];
                const p2 = gridPoints[(i + 1) % gridPoints.length];

                const x1 = p1[0], z1 = p1[2];
                const x2 = p2[0], z2 = p2[2];

                const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
                const centerX = (x1 + x2) / 2;
                const centerZ = (z1 + z2) / 2;
                const angle = -Math.atan2(z2 - z1, x2 - x1);

                const wallGeometry = new THREE.BoxGeometry(length, wallHeight, wallThickness);
                const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
                wallMesh.position.set(centerX, wallHeight / 2, centerZ);
                wallMesh.rotation.y = angle;
                wallsGroupRef.current.add(wallMesh);
            }

            // Вызов onShapeComplete только при первом создании
            if (!floorMeshRef.current) onShapeComplete(true);
        } else {
            // Очистка пола и стен, если форма не замкнута
            if (floorMeshRef.current) {
                groupRef.current.remove(floorMeshRef.current);
                floorMeshRef.current = null;
            }
            while (wallsGroupRef.current.children.length > 0) {
                wallsGroupRef.current.remove(wallsGroupRef.current.children[0]);
            }
        }
    }, [gridPoints, isShapeClosed, isGridCreated, onShapeComplete, cursorPosition, isMouseDown]);

    return <primitive object={groupRef.current}>{children}</primitive>;
};

export default CustomGrid;