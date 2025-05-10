import React from 'react';
import s from './DropdownObjects/DropdownObjects.module.css';

const GridCreationDropdown = ({ onCreateGrid }) => {
    return (
        <div className={s.dropdownObjects}>
            <ul>
                <li>
                    <button onClick={onCreateGrid}>Создать сетку</button>
                </li>
            </ul>
        </div>
    );
};

export default GridCreationDropdown;