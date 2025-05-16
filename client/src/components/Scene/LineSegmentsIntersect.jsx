// Функция проверки пересечения двух отрезков
const lineSegmentsIntersect = (edge1, edge2) => {
    // Начальные точки и векторы отрезков
    const p = edge1.start;
    const r = [edge1.end[0] - p[0], edge1.end[2] - p[2]];
    const q = edge2.start;
    const s = [edge2.end[0] - q[0], edge2.end[2] - q[2]];

    // Вычисление векторного произведения
    const rxs = r[0] * s[1] - r[1] * s[0];

    // Проверка на параллельность отрезков
    if (Math.abs(rxs) < 0.0001) return false;

    // Вычисление параметров пересечения
    const t = ((q[0] - p[0]) * s[1] - (q[2] - p[2]) * s[0]) / rxs;
    const u = ((q[0] - p[0]) * r[1] - (q[2] - p[2]) * r[0]) / rxs;

    // Проверка, находятся ли точки пересечения на отрезках
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

export default lineSegmentsIntersect;