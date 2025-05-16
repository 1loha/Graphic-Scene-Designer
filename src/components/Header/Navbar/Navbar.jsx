import React from 'react';
import s from './Navbar.module.css';
import settingsIcon from '../../../images/settings_white.png';
import supportIcon from '../../../images/support_white.png';
import userProfileIcon from '../../../images/user-profile_white.png';
import saveIcon from '../../../images/save_white.png';
import uploadIcon from '../../../images/upload_white.png';

// Компонент навигационной панели
const Navbar = ({ onUserProfileClick, onSaveProject, onLoadProject }) => {
    // Обработчик клика по кнопке настроек
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    // Обработчик клика по кнопке поддержки
    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    // Обработчик загрузки файла
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onLoadProject(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    // Рендеринг панели навигации
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
                {/* Кнопка загрузки проекта */}
                <li>
                    <label className={s.navButton} title="Загрузить проект">
                        <img src={uploadIcon} alt="load" />
                        <input
                            type="file"
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </label>
                </li>
                {/* Кнопка профиля пользователя */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={onUserProfileClick}
                        aria-label="User Profile"
                        title="Открыть профиль"
                    >
                        <img src={userProfileIcon} alt="userProfile" />
                    </button>
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