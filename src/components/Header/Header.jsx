import React from 'react';
import s from './Header.module.css';
import Navbar from "./Navbar/Navbar";
import logo from '../images/plan_white.png'

const Header = () => {
    return (
        <header className={s.header}>
            <img src={logo} alt="logo"/>
            <span>3D Planer</span>
            <Navbar />
        </header>
    )
}

export default Header;