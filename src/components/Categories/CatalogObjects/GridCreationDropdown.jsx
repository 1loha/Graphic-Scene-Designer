import React from 'react';
import s from './DropdownObjects/DropdownObjects.module.css';

const GridCreationDropdown = ({ onCreateGrid, isDrawingGrid }) => {
    const handleClick = () => {
        onCreateGrid();
    };

    return (
        <div className={s.dropdownObjects}>
            <ul>
                <li>
                    <button onClick={handleClick} disabled={isDrawingGrid}>
                        Создать сетку
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default GridCreationDropdown;