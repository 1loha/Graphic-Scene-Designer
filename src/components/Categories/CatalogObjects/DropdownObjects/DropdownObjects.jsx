import React from 'react';
import s from './DropdownObjects.module.css';
import ModelList from "./ModelList";

const DropdownObjects = (props) => {
    return (
        <div className={s.dropdownObjects}>
            {/*список объектов*/}
            <ModelList models={props.models} category={props.category} onAddModel={props.addModel}/>
        </div>
    )
}
export default DropdownObjects;