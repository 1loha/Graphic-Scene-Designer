import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";
import logo from '../../images/plan_white.png'

const Header = () => {
    return (
        <header className={s.header}>
            {/*логотип*/}
            <img className={s.logo} src={logo} alt="logo"/>
            {/*название приложения*/}
            <span>3D Planer</span>
            {/*навигационная панель*/}
            <Navbar />
        </header>
    )
}

export default Header;