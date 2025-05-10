import React from 'react';
import s from './CatalogObjects.module.css';
import downArrow from '../../../images/down_white.png';
import rightArrow from '../../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";
import GridCreationDropdown from './GridCreationDropdown';

const CatalogObjects = (props)  => {
    const handleDropdownClick = () => props.onToggle(props.nameCategory);
    return (
        <div className={s.catalogObjects}>
            <button
                onClick={handleDropdownClick}
                disabled={
                    (!props.isGridCreated && !props.isGridDropdown) ||
                    (props.isDrawingGrid && !props.isGridDropdown)
                }
                className={
                    (!props.isGridCreated && !props.isGridDropdown) ||
                    (props.isDrawingGrid && !props.isGridDropdown)
                        ? s.disabledButton
                        : ''
                }
            >
                <span className={s.buttonText}>{props.nameCategory}</span>
                <span className={s.buttonIcon}>
                    <img
                        className={s.arrowIcon}
                        src={props.isOpen ? rightArrow : downArrow}
                        alt=">"
                    />
                </span>
            </button>
            {props.isOpen &&
                (props.isGridDropdown ? (
                    <GridCreationDropdown
                        onCreateGrid={props.onCreateGrid}
                        isDrawingGrid={props.isDrawingGrid}
                    />
                ) : (
                    <DropdownObjects
                        addModel={props.addModel}
                        models={props.models}
                        category={props.category}
                    />
                ))}
        </div>
    )
}

export default CatalogObjects;