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

    // Создание материалов для точек и линий
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 5, sizeAttenuation: false });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // Загрузка текстур и создание материалов для пола и стен
    const floorTexture = useLoader(THREE.TextureLoader, floor);
    const wallTexture = useLoader(THREE.TextureLoader, wall);
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture || null,
        color: floorTexture ? 0xffffff : 0xcccccc,
        side: THREE.DoubleSide,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture || null,
        color: wallTexture ? 0xffffff : 0x888888,
        side: THREE.DoubleSide,
    });

    // Инициализация объектов сцены
    useEffect(() => {
        const group = groupRef.current;
        const points = new THREE.Points(pointsGeometryRef.current, pointMaterial);
        group.add(points);
        const lines = new THREE.Line(linesGeometryRef.current, lineMaterial);
        group.add(lines);
        group.add(wallsGroupRef.current);
        pointsGeometryRef.current.setAttribute('position',
            new THREE.Float32BufferAttribute([], 3)
        );
        linesGeometryRef.current.setAttribute('position',
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
        if (points.length > 0 && points.length % 3 !== 0) return;

        pointsGeometryRef.current.setAttribute('position',
            new THREE.Float32BufferAttribute(points, 3)
        );
        pointsGeometryRef.current.needsUpdate = true;

        const linePoints = isShapeClosed && points.length >= 9 ?
            [...points, points[0], points[1], points[2]]: points;
        linesGeometryRef.current.setAttribute('position',
            new THREE.Float32BufferAttribute(linePoints, 3)
        );
        linesGeometryRef.current.needsUpdate = true;

        if (isShapeClosed && gridPoints.length >= 3) {
            if (gridPoints.length === 0) return;

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

            wallsGroupRef.current.children.forEach((child) => {
                wallsGroupRef.current.remove(child);
            });

            const wallHeight = 3;
            const wallThickness = 0.2;

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

            onShapeComplete(true);
        }
    }, [gridPoints, isShapeClosed, onShapeComplete]);

    return <primitive object={groupRef.current}>{children}</primitive>;
};

export default CustomGrid;