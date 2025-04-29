import React from 'react';
import s from './Navbar.module.css';
import settings from '../../images/settings_white.png'
import support from '../../images/support_white.png'
import userProfile from '../../images/user-profile_white.png'

const Navbar = () => {
    return (
        <nav className={s.navbar}>
            <ul>
                <li><img src={settings} alt="settings"/></li>
                <li><img src={support} alt="support"/></li>
                <li><img src={userProfile} alt="userProfile"/></li>
            </ul>
        </nav>
    )
}

export default Navbar;