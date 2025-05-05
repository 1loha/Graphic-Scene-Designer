import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = ({ addModel }) => {

    return (
        <div className={s.dropdownObjects}>
            {/*список объектов*/}
            <ul>
                <li><button onClick={() => addModel('steve')}>steve</button></li>
                <li><button onClick={() => addModel('loona')}>loona</button></li>
                <li><button onClick={() => addModel('chair')}>chair</button></li>
                <li><button onClick={() => addModel('table')}>table</button></li>
                <li><button onClick={() => addModel('sofa')}>sofa</button></li>
            </ul>
        </div>
    )
}
export default DropdownObjects;