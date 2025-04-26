import React from 'react';
import s from './Navbar.module.css';

const Navbar = () => {
    return (
        <div className={s.navbar}>
            <span>Help</span>
            <span>Profile</span>
            <span>Settings</span>
        </div>
    )
}

export default Navbar;