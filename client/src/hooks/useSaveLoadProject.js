import { v4 as uuidv4 } from 'uuid';
import { saveProject as saveProjectApi, updateProject, loadProject as loadProjectApi } from '../api';

// Хук для сохранения и загрузки проектов
const useSaveLoadProject = ({
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
                                setModels
                            }) => {
    // Получение userId из localStorage
    const getUserId = () => {
        return localStorage.getItem('userId') || 'user-id-placeholder';
    };

    // Функция сохранения проекта
    const saveProject = async () => {
        try {
            // Формирование данных проекта
            const projectData = {
                projectId: projectId || uuidv4(), // Генерация ID, если не существует
                userId: getUserId(),
                createdAt: new Date().toISOString(),
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
                }))
            };
            // Логирование данных для отладки
            console.log('Отправляемые данные проекта:', JSON.stringify(projectData, null, 2));
            // Обновление или создание проекта
            const response = projectId
                ? await updateProject(projectId, projectData)
                : await saveProjectApi(projectData);
            if (!projectId) setProjectId(response.projectId);
            console.log('Проект сохранен:', response);
            return response;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            throw error;
        }
    };

    // Функция загрузки проекта
    const loadProject = async (projectId) => {
        try {
            const projectData = await loadProjectApi(projectId);
            // Обновление состояния приложения
            setProjectId(projectData.projectId);
            setProjectName(projectData.name);
            setGridPoints(projectData.grid.points);
            setIsGridCreated(projectData.grid.isShapeClosed);
            setIsDrawingGrid(false);
            setResetDrawing(false);
            setModels(projectData.models);
            console.log('Проект загружен:', projectData);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            throw error;
        }
    };

    return { saveProject, loadProject };
};

export default useSaveLoadProject;