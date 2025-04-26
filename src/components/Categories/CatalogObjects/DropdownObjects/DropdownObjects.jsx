import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = (props) => {

    return (
        <div className={s.dropdownObjects}>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
            </ul>
        </div>
    )
}
export default DropdownObjects;