// Базовый URL для API-запросов
const API_BASE_URL = 'http://localhost:5000/api';

// Получение токена авторизации из localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
};

// Получение ID пользователя из localStorage
const getUserId = () => {
    return localStorage.getItem('userId') || null;
};

// Функция регистрации пользователя
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
        if (error.message.includes('400')) {
            throw error; // Ожидаемая ошибка (например, дубликат пользователя)
        }
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

// Функция входа пользователя
export const login = async (username, password) => {
    try {
        console.log('Отправка запроса login:', { username, password });
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const responseData = await response.json();
        console.log('Ответ сервера:', response.status, responseData);
        if (!response.ok) {
            throw new Error(responseData.error || `Ошибка входа: ${response.status}`);
        }
        return responseData;
    } catch (error) {
        if (error.message.includes('401')) {
            throw error; // Ожидаемая ошибка (неверные учетные данные)
        }
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

// Функция сохранения проекта
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
        if (error.message.includes('401')) {
            throw error; // Ожидаемая ошибка (токен не предоставлен)
        }
        console.error('Ошибка при сохранении проекта:', error);
        throw error;
    }
};

// Функция обновления проекта
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
        if (error.message.includes('401')) {
            throw error; // Ожидаемая ошибка (токен не предоставлен)
        }
        console.error('Ошибка при обновлении проекта:', error);
        throw error;
    }
};

// Функция загрузки проекта
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
        if (error.message.includes('401')) {
            throw error; // Ожидаемая ошибка (токен не предоставлен)
        }
        console.error('Ошибка при загрузке проекта:', error);
        throw error;
    }
};

// Функция получения всех проектов пользователя
export const getUserProjects = async () => {
    try {
        const token = getAuthToken();
        const userId = getUserId();
        console.log('Fetching projects for userId:', userId); // Диагностика
        if (!userId) {
            throw new Error('401: Пользователь не авторизован');
        }
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
        const projects = await response.json();
        console.log('Projects received:', projects); // Диагностика
        return projects;
    } catch (error) {
        console.error('Ошибка при получении проектов пользователя:', error);
        throw error;
    }
};