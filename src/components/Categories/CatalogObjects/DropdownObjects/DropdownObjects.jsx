import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = ({ onAddModel }) => {

    return (
        <div className={s.dropdownObjects}>
            <ul>
                <li>
                    <button type="button" >
                        steve
                    </button>
                </li>
                <li>
                    <button type="button" >
                        loona
                    </button>
                </li>
                <li>Item 3</li>
                <li>Item 4</li>
            </ul>
        </div>
    )
}
export default DropdownObjects;