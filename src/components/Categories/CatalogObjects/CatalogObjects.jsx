import React, { useState } from 'react';
import s from './CatalogObjects.module.css';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = (props) => {
    const [dropdownState, setDropdownState] = useState({ open: false });
    const handleDropdownClick = ()=> setDropdownState({ open: !dropdownState.open });

    return (
        <div className={s.catalogObjects}>
            <button type="button" className={s.button} onClick={handleDropdownClick}>
                {props.name}
            </button>
            {dropdownState.open && <DropdownObjects />}
        </div>
    )
}

export default CatalogObjects;