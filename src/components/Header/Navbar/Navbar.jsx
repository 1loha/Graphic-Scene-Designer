import React from 'react';
import s from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={s.navbar}>
            <span>Help</span>
            <span>Profile</span>
            <span>Settings</span>
        </nav>
    )
}

export default Navbar;