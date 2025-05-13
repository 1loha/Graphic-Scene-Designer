export const isPointInPolygon = (point, vertices) => {
    let inside = false;
    const x = point[0], z = point[2];
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i][0], zi = vertices[i][2];
        const xj = vertices[j][0], zj = vertices[j][2];
        const intersect = ((zi > z) !== (zj > z)) &&
            (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
    }
    return inside; // True, если точка внутри полигона
};