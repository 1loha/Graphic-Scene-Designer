import React from 'react';
import s from './CatalogObjects.module.css';
import downArrow from './../../images/down_white.png';
import rightArrow from './../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = ({ nameCategory, isOpen, onToggle, onAddModel }) => {
    const handleDropdownClick = () => onToggle(nameCategory);
    return (
        <div className={s.catalogObjects}>
            <button onClick={handleDropdownClick}>
                <span className={s.buttonText}>{nameCategory}</span>
                <span className={s.buttonIcon}>
                    {/*смена картинки в зависимости от состояния выпадающего списка*/}
                    <img className={s.arrowIcon} src={isOpen ? rightArrow : downArrow} alt=">"/>
                </span>
            </button>
            {/*если на список нажали, то открыть список*/}
            {isOpen && <DropdownObjects onAddModel={onAddModel}/>}
        </div>
    )
}

export default CatalogObjects;