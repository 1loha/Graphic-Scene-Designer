import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CustomGrid = ({ gridScale, gridDivisions, isDrawing, gridPoints, isShapeClosed, onShapeComplete, children }) => {
    const groupRef = useRef(new THREE.Group());
    const pointsGeometryRef = useRef(new THREE.BufferGeometry());
    const linesGeometryRef = useRef(new THREE.BufferGeometry());
    const shapeMeshRef = useRef(null);

    // Material for points and lines
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 5, sizeAttenuation: false });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // Initialize scene objects
    useEffect(() => {
        const group = groupRef.current;

        // Points
        const points = new THREE.Points(pointsGeometryRef.current, pointMaterial);
        group.add(points);

        // Lines
        const lines = new THREE.Line(linesGeometryRef.current, lineMaterial);
        group.add(lines);

        // Set initial empty geometry
        pointsGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute([], 3)
        );
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute([], 3)
        );

        console.log('Group initialized with children:', group.children);

        return () => {
            group.remove(points, lines);
            if (shapeMeshRef.current) group.remove(shapeMeshRef.current);
        };
    }, []);

    // Update points, lines, and shape
    useEffect(() => {
        console.log('gridPoints:', gridPoints);
        const points = gridPoints.flat();
        console.log('Flattened points:', points);

        if (points.length > 0 && points.length % 3 !== 0) {
            console.error('Invalid gridPoints format, expected [x, y, z, ...]');
            return;
        }

        // Update points geometry
        pointsGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(points, 3)
        );
        pointsGeometryRef.current.needsUpdate = true;

        // Update lines geometry
        const linePoints = isShapeClosed && points.length >= 9
            ? [...points, points[0], points[1], points[2]]
            : points;
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePoints, 3)
        );
        linesGeometryRef.current.needsUpdate = true;

        // Create filled shape when closed
        if (isShapeClosed && gridPoints.length >= 3) {
            console.log('Creating shape with points:', gridPoints);
            const shape = new THREE.Shape();
            gridPoints.forEach(([x, , z], i) => {
                console.log(`Point ${i}: [${x}, ${z}]`);
                if (i === 0) {
                    shape.moveTo(x, z);
                } else {
                    shape.lineTo(x, z);
                }
            });

            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            groupRef.current.add(mesh);
            if (shapeMeshRef.current) {
                groupRef.current.remove(shapeMeshRef.current);
            }
            shapeMeshRef.current = mesh;

            console.log('Shape mesh added');
            onShapeComplete(true);
        }
    }, [gridPoints, isShapeClosed, onShapeComplete]);

    return <primitive object={groupRef.current}>{children}</primitive>;
};

export default CustomGrid;