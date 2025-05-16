const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
};

const getUserId = () => {
    return localStorage.getItem('userId') || 'user-id-placeholder';
};

export const register = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка регистрации: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка входа: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

export const saveProject = async (projectData) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка сохранения: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при сохранении проекта:', error);
        throw error;
    }
};

export const updateProject = async (projectId, projectData) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка обновления: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении проекта:', error);
        throw error;
    }
};

export const loadProject = async (projectId) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка загрузки: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке проекта:', error);
        throw error;
    }
};

export const getUserProjects = async () => {
    try {
        const token = getAuthToken();
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/projects/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка получения проектов: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении проектов пользователя:', error);
        throw error;
    }
};