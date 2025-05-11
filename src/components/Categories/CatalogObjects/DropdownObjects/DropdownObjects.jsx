import React from 'react';
import s from './DropdownObjects.module.css';
import ModelList from "./ModelList";

const DropdownObjects = (props) => {
    return (
        <div className={s.dropdownObjects}>
            <ModelList
                models={props.models}
                category={props.category}
                onSelectModelType={props.onSelectModelType}
            />
        </div>
    );
};

export default DropdownObjects;