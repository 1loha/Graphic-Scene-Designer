import React, {useState} from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = () => {
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
            />
            <CatalogObjects
                nameCategory="Освещение"
                isOpen={activeCategory === "Освещение"}
                onToggle={handleCategoryToggle}
            />
            <CatalogObjects
                nameCategory="Сантехника"
                isOpen={activeCategory === "Сантехника"}
                onToggle={handleCategoryToggle}
            />
        </div>
    )
}

export default Categories;