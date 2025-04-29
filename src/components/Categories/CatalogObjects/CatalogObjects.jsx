import React, { useState } from 'react';
import s from './CatalogObjects.module.css';
import downArrow from './../../images/down_white.png';
import rightArrow from './../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = (props) => {
    const [dropdownState, setDropdownState] = useState({ open: false });
    const handleDropdownClick = ()=> setDropdownState({ open: !dropdownState.open });

    return (
        <div className={s.catalogObjects}>
            <button className={s.button} type="button" onClick={handleDropdownClick}>
                {props.name}
                <img src={downArrow} alt=">"/>
            </button>
            {dropdownState.open && <DropdownObjects />}
        </div>
    )
}

export default CatalogObjects;