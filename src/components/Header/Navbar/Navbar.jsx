import React from 'react';
import s from './Navbar.module.css';
import settings from '../../../images/settings_white.png';
import support from '../../../images/support_white.png';
import userProfile from '../../../images/user-profile_white.png';

const Navbar = (props) => {
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    return (
        <nav className={s.navbar}>
            <ul>
                {/* Профиль пользователя */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={props.onUserProfileClick}
                        aria-label="User Profile"
                    >
                        <img src={userProfile} alt="userProfile" />
                    </button>
                </li>
                {/* Справочник */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={handleSupportClick}
                        aria-label="Support"
                    >
                        <img src={support} alt="support" />
                    </button>
                </li>
                {/* Настройки */}
                <li>
                    <button
                        className={s.navButton}
                        onClick={handleSettingsClick}
                        aria-label="Settings"
                    >
                        <img src={settings} alt="settings" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;