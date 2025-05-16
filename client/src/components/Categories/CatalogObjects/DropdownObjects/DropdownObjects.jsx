import React from 'react';
import s from './DropdownObjects.module.css';
import ModelList from "./ModelList";

// Компонент выпадающего списка объектов
const DropdownObjects = (props) => {
    // Рендеринг списка моделей
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