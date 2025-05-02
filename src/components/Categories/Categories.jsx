import React from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = ({ onAddModel }) => {

    return (
        <div className={s.catalogCategory}>
            <CatalogObjects nameCategory="Мебель"
                            onAddModel={onAddModel} />
            <CatalogObjects nameCategory="Освещение"
                            onAddModel={onAddModel} />
            <CatalogObjects nameCategory="Сантехника"
                            onAddModel={onAddModel} />
        </div>
    )
}

export default Categories;