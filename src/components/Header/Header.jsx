import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";

const Header = () => {
    return (
        <header className={s.header}>
            <img src="../images/plan_white.png" alt="logo"/>
            <span>3D Planer</span>
            <Navbar />
        </header>
    )
}

export default Header;