import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = (props) => {

    return (
        <div className={s.dropdownObjects}>
            {/*список объектов*/}
            <ul>
                {Object.entries(props.models).map(([key]) => (
                    <li key={key}>
                        <button onClick={() => props.addModel(props.category, key)}>
                            {key}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default DropdownObjects;