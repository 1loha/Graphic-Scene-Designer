import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = ({ addModel }) => {

    return (
        <div className={s.dropdownObjects}>
            {/*список объектов*/}
            <ul>
                <li><button onClick={() => addModel('steve')}>steve</button></li>
                <li><button onClick={() => addModel('loona')}>loona</button></li>
                <li><button>Item 3</button></li>
                <li><button>Item 4</button></li>
            </ul>
        </div>
    )
}
export default DropdownObjects;