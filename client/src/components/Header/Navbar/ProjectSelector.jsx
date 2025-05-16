import React, { useState, useEffect } from 'react';
import s from './ProjectSelector.module.css';
import {getUserProjects} from "../../../api";

const ProjectSelector = ({ onLoadProject }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId || userId === 'user-id-placeholder') return;
            try {
                const userProjects = await getUserProjects();
                setProjects(userProjects);
            } catch (error) {
                console.error('Ошибка загрузки проектов:', error);
            }
        };
        fetchProjects();
    }, []);

    const handleLoad = () => {
        if (selectedProjectId) {
            onLoadProject(selectedProjectId);
        }
    };

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