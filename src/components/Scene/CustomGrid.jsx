import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CustomGrid = ({ gridScale, gridDivisions, isDrawing, gridPoints, onShapeComplete, children }) => {
    const groupRef = useRef(new THREE.Group());
    const pointsGeometryRef = useRef(new THREE.BufferGeometry());
    const linesGeometryRef = useRef(new THREE.BufferGeometry());
    const shapeMeshRef = useRef(null);
    const isShapeClosedRef = useRef(false);

    // Material for points and lines
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.5 }); // Increased size
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

        return () => {
            group.remove(points, lines);
            if (shapeMeshRef.current) group.remove(shapeMeshRef.current);
        };
    }, []);

    // Update points and lines when gridPoints change
    useEffect(() => {
        console.log('gridPoints:', gridPoints);
        const points = gridPoints.flat();
        console.log('Flattened points:', points);

        // Update points geometry
        pointsGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(points, 3)
        );
        pointsGeometryRef.current.needsUpdate = true;

        // Update lines geometry
        const linePoints = isShapeClosedRef.current && points.length >= 9
            ? [...points, points[0], points[1], points[2]]
            : points;
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePoints, 3)
        );
        linesGeometryRef.current.needsUpdate = true;

        // Create filled shape when closed
        if (isShapeClosedRef.current && gridPoints.length >= 3) {
            console.log('Creating shape with points:', gridPoints);
            const shape = new THREE.Shape();
            gridPoints.forEach(([x, , z], i) => {
                console.log(`Point ${i}: [${x}, ${z}]`);
                shape.lineTo(x, z);
            });

            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2; // Align with XZ plane
            groupRef.current.add(mesh);
            shapeMeshRef.current = mesh;

            console.log('Shape mesh added');
            onShapeComplete(true); // Signal grid is created
        }
    }, [gridPoints, isDrawing]);

    // Handle keypress to close shape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isDrawing && gridPoints.length >= 3 && !isShapeClosedRef.current) {
                console.log('Enter pressed, closing shape');
                isShapeClosedRef.current = true;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawing, gridPoints]);

    return <primitive object={groupRef.current}>{children}</primitive>;
};

export default CustomGrid;