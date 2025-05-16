import { v4 as uuidv4 } from 'uuid';
import { saveProject as saveProjectApi, updateProject, loadProject as loadProjectApi } from './api';

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
    const getUserId = () => {
        return localStorage.getItem('userId') || 'user-id-placeholder';
    };

    const saveProject = async () => {
        try {
            const projectData = {
                projectId: projectId || uuidv4(),
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

    const loadProject = async (projectId) => {
        try {
            const projectData = await loadProjectApi(projectId);
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