import React, { useState, useEffect } from 'react';
import sn from './Navbar.module.css';
import s from './ProjectSelector.module.css';
import { getUserProjects } from "../../../api";
import loadIcon from '../../../images/upload_white.png';

// Компонент для выбора и загрузки проектов пользователя
const ProjectSelector = ({ onLoadProject, onUserProfileClick, isAuthenticated }) => {
    // Состояние для списка проектов
    const [projects, setProjects] = useState([]);
    // Состояние для отображения выпадающего списка
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Загрузка проектов при монтировании или изменении авторизации
    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('userId');
            console.log('Fetching projects for userId:', userId, 'isAuthenticated:', isAuthenticated); // Диагностика
            if (!userId || !isAuthenticated) {
                console.log('No userId or not authenticated, skipping fetch');
                setProjects([]);
                return;
            }
            try {
                const userProjects = await getUserProjects();
                console.log('Projects set:', userProjects); // Диагностика
                setProjects(userProjects);
            } catch (error) {
                console.error('Ошибка загрузки проектов:', error);
                if (error.message.includes('401') || error.message.includes('403')) {
                    console.log('Unauthorized or forbidden, opening AuthModal');
                    onUserProfileClick(); // Открыть AuthModal
                    setProjects([]);
                    return;
                }
            }
        };
        fetchProjects();
    }, [isAuthenticated, onUserProfileClick]);

    // Действие пользователя: Открыть/закрыть выпадающий список
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Действие пользователя: Выбрать проект для загрузки
    const handleProjectSelect = (projectId) => {
        if (projectId) {
            onLoadProject(projectId); // Автоматическая загрузка проекта
            setIsDropdownOpen(false); // Закрыть список
        }
    };

    // Рендеринг иконки и выпадающего списка
    return (
        <div className={s.projectSelector}>
            <button
                className={sn.navButton}
                onClick={toggleDropdown}
                aria-label="Load Project"
                title="Загрузить проект"
            >
                <img src={loadIcon} alt="load" />
            </button>
            {isDropdownOpen && (
                <div className={s.dropdown}>
                    {projects.length === 0 ? (
                        <div className={s.dropdownItem}>Нет доступных проектов</div>
                    ) : (
                        projects.map(project => (
                            <div
                                key={project.projectId}
                                className={s.dropdownItem}
                                onClick={() => handleProjectSelect(project.projectId)}
                            >
                                {project.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectSelector;