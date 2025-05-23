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
                                setModels,
                                openAuthModal
                            }) => {
    // Получение userId из localStorage
    const getUserId = () => {
        return localStorage.getItem('userId') || null;
    };

    // Функция сохранения проекта
    const saveProject = async (newProjectName = projectName) => {
        try {
            // Формирование данных проекта
            const projectData = {
                projectId: projectId || uuidv4(),
                userId: getUserId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                name: newProjectName || 'Без названия',
                grid: {
                    points: Array.isArray(gridPoints) ? gridPoints : [],
                    isShapeClosed: isGridCreated && gridPoints.length > 0
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
            // Проверка userId
            if (!projectData.userId) {
                openAuthModal();
                return null;
            }
            // Обновление или создание проекта
            const response = projectId
                ? await updateProject(projectId, projectData)
                : await saveProjectApi(projectData);
            if (!projectId) setProjectId(response.projectId);
            setProjectName(newProjectName);
            console.log('Проект сохранен:', response);
            return response;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            if (error.message.includes('401') || error.message.includes('403')) {
                openAuthModal();
                return null;
            }
            throw error;
        }
    };

    // Функция загрузки проекта
    const loadProject = async (projectId) => {
        try {
            const projectData = await loadProjectApi(projectId);
            // Логирование загруженных данных
            console.log('Загруженные данные проекта:', JSON.stringify(projectData, null, 2));
            // Обновление состояния приложения
            setProjectId(projectData.projectId);
            setProjectName(projectData.name);
            const points = Array.isArray(projectData.grid?.points) ? projectData.grid.points : [];
            setGridPoints(points);
            setIsGridCreated(projectData.grid?.isShapeClosed || false);
            setIsDrawingGrid(false);
            setResetDrawing(false);
            setModels(projectData.models || []);
            console.log('Установлены gridPoints:', points, 'isGridCreated:', projectData.grid?.isShapeClosed);
            return projectData;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            if (error.message.includes('401') || error.message.includes('403')) {
                openAuthModal();
                return null;
            }
            throw error;
        }
    };

    return { saveProject, loadProject };
};

export default useSaveLoadProject;