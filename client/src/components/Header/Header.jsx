import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";
import logo from '../../images/plan_white.png';

// Компонент заголовка приложения
const Header = ({ onUserProfileClick, onSaveProject, onLoadProject, isAuthenticated, onLogout }) => {
    // Рендеринг заголовка
    return (
        <header className={s.header}>
            {/* Логотип приложения */}
            <img className={s.logo} src={logo} alt="logo"/>
            {/* Название приложения */}
            <span>3D Planer</span>
            {/* Навигационная панель */}
            <Navbar
                onUserProfileClick={onUserProfileClick}
                onSaveProject={onSaveProject}
                onLoadProject={onLoadProject}
                isAuthenticated={isAuthenticated}
                onLogout={onLogout}
            />
        </header>
    );
};

export default Header;