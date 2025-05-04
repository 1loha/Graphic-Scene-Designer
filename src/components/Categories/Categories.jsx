import React, {useState} from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = ({ onAddModel }) => {
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
                onAddModel={onAddModel}
            />
            <CatalogObjects
                nameCategory="Освещение"
                isOpen={activeCategory === "Освещение"}
                onToggle={handleCategoryToggle}
                onAddModel={onAddModel}
            />
            <CatalogObjects
                nameCategory="Сантехника"
                isOpen={activeCategory === "Сантехника"}
                onToggle={handleCategoryToggle}
                onAddModel={onAddModel}
            />
        </div>
    )
}

export default Categories;