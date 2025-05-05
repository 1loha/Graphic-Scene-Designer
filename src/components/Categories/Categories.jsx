import React, {useState} from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = ({ addModel }) => {
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCategoryToggle = (name) => {
        setActiveCategory(activeCategory === name ? null : name);
    };
    return (
        <div className={s.catalogCategory}>
            <CatalogObjects
                nameCategory="Мебель"
                isOpen={activeCategory === "Мебель"}
                onToggle={handleCategoryToggle}
                addModel={addModel}
            />
            <CatalogObjects
                nameCategory="Освещение"
                isOpen={activeCategory === "Освещение"}
                onToggle={handleCategoryToggle}
                addModel={addModel}
            />
            <CatalogObjects
                nameCategory="Сантехника"
                isOpen={activeCategory === "Сантехника"}
                onToggle={handleCategoryToggle}
                addModel={addModel}
            />
        </div>
    )
}

export default Categories;