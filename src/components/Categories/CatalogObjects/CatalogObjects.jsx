import React, { useState } from 'react';
import s from './CatalogObjects.module.css';
import downArrow from './../../images/down_white.png';
import rightArrow from './../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = ({ nameCategory, isOpen, onToggle }) => {
    const handleDropdownClick = () => onToggle(nameCategory);
    return (
        <div className={s.catalogObjects}>
            <button type="button" onClick={handleDropdownClick}>
                <span className={s.buttonText}>
                    {nameCategory}
                </span>
                <span className={s.iconContainer}>
                    <img className={s.arrowIcon} src={isOpen ? rightArrow : downArrow} alt=">"/>
                </span>
            </button>
            {isOpen && <DropdownObjects />}
        </div>
    )
}

export default CatalogObjects;