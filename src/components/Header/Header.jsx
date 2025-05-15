import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";
import logo from '../../images/plan_white.png'

const Header = (props) => {
    return (
        <header className={s.header}>
            {/*логотип*/}
            <img className={s.logo} src={logo} alt="logo"/>
            {/*название приложения*/}
            <span>3D Planer</span>
            {/*навигационная панель*/}
            <Navbar onUserProfileClick={props.onUserProfileClick} />
        </header>
    )
}

export default Header;