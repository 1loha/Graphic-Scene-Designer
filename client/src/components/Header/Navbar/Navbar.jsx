import React from 'react';
import s from './Navbar.module.css';
import settingsIcon from '../../../images/settings_white.png';
import supportIcon from '../../../images/support_white.png';
import userProfileIcon from '../../../images/user-profile_white.png';
import saveIcon from '../../../images/save_white.png';
import ProjectSelector from './ProjectSelector';

const Navbar = ({ onUserProfileClick, onSaveProject, onLoadProject }) => {
    const handleSettingsClick = () => {
        console.log('Settings button clicked');
    };

    const handleSupportClick = () => {
        console.log('Support button clicked');
    };

    return (
        <nav className={s.navbar}>
            <ul>
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
                <li>
                    <ProjectSelector onLoadProject={onLoadProject} />
                </li>
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