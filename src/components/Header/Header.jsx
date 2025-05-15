import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";
import logo from '../../images/plan_white.png';

// Компонент заголовка приложения
const Header = (props) => {
    // Рендеринг заголовка
    return (
        <header className={s.header}>
            {/* Логотип приложения */}
            <img className={s.logo} src={logo} alt="logo"/>
            {/* Название приложения */}
            <span>3D Planer</span>
            {/* Навигационная панель */}
            <Navbar onUserProfileClick={props.onUserProfileClick} />
        </header>
    );
};

export default Header;