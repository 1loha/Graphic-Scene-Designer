import React from 'react';
import s from './CatalogObjects.module.css';
import downArrow from '../../../images/down_white.png';
import rightArrow from '../../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";

const CatalogObjects = (props)  => {
    const handleDropdownClick = () => props.onToggle(props.nameCategory);
    return (
        <div className={s.catalogObjects}>
            <button onClick={handleDropdownClick}>
                <span className={s.buttonText}>{props.nameCategory}</span>
                <span className={s.buttonIcon}>
                    {/*смена картинки в зависимости от состояния выпадающего списка*/}
                    <img className={s.arrowIcon} src={props.isOpen ? rightArrow : downArrow} alt=">"/>
                </span>
            </button>
            {/*если на список нажали, то открыть список*/}
            {props.isOpen && <DropdownObjects addModel={props.addModel}
                                              models={props.models}
                                              category={props.category}/>}
        </div>
    )
}

export default CatalogObjects;