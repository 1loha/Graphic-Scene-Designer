import React from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = () => {

    return (
        <div className={s.catalogCategory}>
            <CatalogObjects name="Мебель"/>
            <CatalogObjects name="Освещение"/>
            <CatalogObjects name="Сантехника"/>
        </div>
    )
}

export default Categories;