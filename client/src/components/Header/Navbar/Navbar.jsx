import React, { useState } from 'react';
import s from './Navbar.module.css';
import settingsIcon from '../../../images/settings_white.png';
import supportIcon from '../../../images/support_white.png';
import userProfileIcon from '../../../images/user-profile_white.png';
import saveIcon from '../../../images/save_white.png';
import logoutIcon from '../../../images/logout_white.png';
import ProjectSelector from './ProjectSelector';

// Навигационная панель приложения
const Navbar = ({ onUserProfileClick, onSaveProject, onLoadProject, isAuthenticated, onLogout }) => {
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);
    const [projectName, setProjectName] = useState('');

    // Отладка состояния
    console.log('isSaveFormOpen:', isSaveFormOpen);

    const handleNameChange = (e) => {
        setProjectName(e.target.value);
    };

    const handleSaveConfirm = () => {
        if (projectName.trim()) {
            console.log('Saving project with name:', projectName);
            onSaveProject(projectName);
            setIsSaveFormOpen(false);
            setProjectName('');
        } else {
            console.log('Project name is empty');
        }
    };

    const handleCancel = () => {
        setIsSaveFormOpen(false);
        setProjectName('');
    };

    return (
        <nav className={s.navbar}>
            <ul>
                <li>
                    <button
                        className={s.navButton}
                        onClick={() => {
                            console.log('Save button clicked');
                            setIsSaveFormOpen(true);
                        }}
                        aria-label="Save Project"
                        title="Сохранить проект"
                    >
                        <img src={saveIcon} alt="save" />
                    </button>
                    {isSaveFormOpen && (
                        <div className={s.saveForm}>
                            <span>Введите название проекта</span>
                            <input
                                type="text"
                                value={projectName}
                                onChange={handleNameChange}
                                className={s.input}
                                placeholder="Название проекта"
                            />
                            <button className={s.ok} onClick={handleSaveConfirm}>
                                Подтвердить
                            </button>
                            <button className={s.cancel} onClick={handleCancel}>
                                Отмена
                            </button>
                        </div>
                    )}
                </li>
                <li>
                    <ProjectSelector
                        onLoadProject={onLoadProject}
                        onUserProfileClick={onUserProfileClick}
                        isAuthenticated={isAuthenticated}
                    />
                </li>
                <li>
                    {isAuthenticated ? (
                        <button
                            className={s.navButton}
                            onClick={onLogout}
                            aria-label="Logout"
                            title="Выйти"
                        >
                            <img src={logoutIcon} alt="logout" />
                        </button>
                    ) : (
                        <button
                            className={s.navButton}
                            onClick={onUserProfileClick}
                            aria-label="User Profile"
                            title="Открыть профиль"
                        >
                            <img src={userProfileIcon} alt="userProfile" />
                        </button>
                    )}
                </li>
                <li>
                    <button
                        className={s.navButton}
                        onClick={handleSupportClick}
                        aria-label="Support"
                        title="Справочник"
                    >
                        <img src={supportIcon} alt="support" />
                    </button>
                </li>
                <li>
                    <button
                        className={s.navButton}
                        onClick={handleSettingsClick}
                        aria-label="Settings"
                        title="Настройки"
                    >
                        <img src={settingsIcon} alt="settings" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;