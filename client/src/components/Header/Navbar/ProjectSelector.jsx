import React, { useState, useEffect } from 'react';
import s from './ProjectSelector.module.css';
import {getUserProjects} from "../../../api";

// Компонент для выбора и загрузки проектов пользователя
const ProjectSelector = ({ onLoadProject }) => {
    // Состояние для списка проектов
    const [projects, setProjects] = useState([]);
    // Состояние для выбранного проекта
    const [selectedProjectId, setSelectedProjectId] = useState('');

    // Загрузка проектов при монтировании компонента
    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId || userId === 'user-id-placeholder') return; // Пропуск, если пользователь не авторизован
            try {
                const userProjects = await getUserProjects();
                setProjects(userProjects);
            } catch (error) {
                console.error('Ошибка загрузки проектов:', error);
            }
        };
        fetchProjects();
    }, []);

    // Действие пользователя: Выбрать проект из списка и нажать "Загрузить"
    const handleLoad = () => {
        if (selectedProjectId) {
            onLoadProject(selectedProjectId);
        }
    };

    // Рендеринг селектора и кнопки
    return (
        <div className={s.projectSelector}>
            <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
            >
                <option value="">Выберите проект</option>
                {projects.map(project => (
                    <option key={project.projectId} value={project.projectId}>
                        {project.name}
                    </option>
                ))}
            </select>
            <button onClick={handleLoad} disabled={!selectedProjectId}>
                Загрузить
            </button>
        </div>
    );
};

export default ProjectSelector;