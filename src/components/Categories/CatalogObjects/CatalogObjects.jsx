import React, { useState } from 'react';
import s from './CatalogObjects.module.css';
import downArrow from './../../images/down_white.png';
import rightArrow from './../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = ({ nameCategory, onAddModel }) => {
    const [dropdownState, setDropdownState] = useState({ open: false });
    const handleDropdownClick = ()=> setDropdownState({ open: !dropdownState.open });

    return (
        <div className={s.catalogObjects}>
            <button type="button" onClick={handleDropdownClick}>
                <span className={s.buttonText}>
                    {nameCategory}
                </span>
                <span className={s.iconContainer}>
                    <img className={s.arrowIcon} src={dropdownState.open ? rightArrow : downArrow} alt=">"/>
                </span>
            </button>
            {dropdownState.open && <DropdownObjects onAddModel={onAddModel} />}
        </div>
    )
}

export default CatalogObjects;