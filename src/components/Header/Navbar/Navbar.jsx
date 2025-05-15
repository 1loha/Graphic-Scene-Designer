import React from 'react';
import s from './Navbar.module.css';
import settings from '../../../images/settings_white.png';
import support from '../../../images/support_white.png';
import userProfile from '../../../images/user-profile_white.png';

// Компонент навигационной панели
const Navbar = (props) => {
    // Обработчик клика по кнопке настроек
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    // Обработчик клика по кнопке поддержки
    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    // Рендеринг панели навигации
    return (
        <nav className={s.navbar}>
            <ul>
                {/* Кнопка профиля пользователя */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={props.onUserProfileClick}
                        aria-label="User Profile"
                        title="Открыть профиль"
                    >
                        <img src={userProfile} alt="userProfile" />
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
                        <img src={support} alt="support" />
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
                        <img src={settings} alt="settings" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;