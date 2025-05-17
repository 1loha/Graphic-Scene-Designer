import React from 'react';
import s from './Navbar.module.css';
import settingsIcon from '../../../images/settings_white.png';
import supportIcon from '../../../images/support_white.png';
import userProfileIcon from '../../../images/user-profile_white.png';
import saveIcon from '../../../images/save_white.png';
import ProjectSelector from './ProjectSelector';

// Навигационная панель приложения
const Navbar = ({ onUserProfileClick, onSaveProject, onLoadProject, isAuthenticated, onLogout }) => {
    // Обработчик клика по кнопке настроек
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    // Обработчик клика по кнопке поддержки
    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    // Рендеринг навигационной панели
    return (
        <nav className={s.navbar}>
            <ul>
                {/* Кнопка сохранения проекта */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={onSaveProject}
                        aria-label="Save Project"
                        title="Сохранить проект"
                    >
                        <img src={saveIcon} alt="save" />
                    </button>
                </li>
                {/* Селектор проектов */}
                <li>
                    <ProjectSelector onLoadProject={onLoadProject} />
                </li>
                {/* Кнопка профиля или выхода */}
                <li>
                    {isAuthenticated ? (
                        // Действие пользователя: Нажать для выхода из аккаунта
                        <button
                            className={s.navButton}
                            onClick={onLogout}
                            aria-label="Logout"
                            title="Выйти"
                        >
                            Выйти
                        </button>
                    ) : (
                        // Действие пользователя: Открыть форму авторизации/регистрации
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
                {/* Кнопка поддержки */}
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
                {/* Кнопка настроек */}
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