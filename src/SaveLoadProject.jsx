import { v4 as uuidv4 } from 'uuid';

const SaveLoadProject = ({
                                   projectId,
                                   setProjectId,
                                   projectName,
                                   setProjectName,
                                   gridPoints,
                                   setGridPoints,
                                   isGridCreated,
                                   setIsGridCreated,
                                   isDrawingGrid,
                                   setIsDrawingGrid,
                                   resetDrawing,
                                   setResetDrawing,
                                   models,
                                   setModels,
                                   gridScale,
                                   gridDivisions
                               }) => {
    // Сохранение проекта в JSON
    const saveProject = () => {
        const projectData = {
            projectId: projectId || uuidv4(),
            userId: 'user-id-placeholder', // Заменить на реальный ID после авторизации
            createdAt: projectId ? new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: projectName,
            grid: {
                points: gridPoints,
                isShapeClosed: isGridCreated
            },
            models: models.map(model => ({
                id: model.id,
                category: model.category,
                type: model.type,
                position: model.position,
                rotation: model.rotation,
                normalizedScale: model.normalizedScale,
                baseScale: model.baseScale
            })),
            scene: {
                gridScale: gridScale || 20,
                gridDivisions: gridDivisions || 40
            }
        };
        const jsonString = JSON.stringify(projectData, null, 2);
        console.log('Сохраненный проект:', jsonString);
        return jsonString;
    };

    // Загрузка проекта из JSON
    const loadProject = (jsonData) => {
        try {
            const projectData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            setProjectId(projectData.projectId);
            setProjectName(projectData.name);
            setGridPoints(projectData.grid.points);
            setIsGridCreated(projectData.grid.isShapeClosed);
            setIsDrawingGrid(false);
            setResetDrawing(false);
            setModels(projectData.models);
        } catch (error) {
            console.error('Ошибка загрузки проекта:', error);
        }
    };

    return { saveProject, loadProject };
};

export default SaveLoadProject;