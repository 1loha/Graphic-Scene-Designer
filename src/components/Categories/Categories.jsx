import React, { useState } from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = (props) => {
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCategoryToggle = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    return (
        <div className={s.catalogCategory}>
            {Object.keys(props.state).map((category) => (
                <CatalogObjects
                    key={category}
                    nameCategory={props.state[category].displayName}
                    isOpen={activeCategory === category}
                    onToggle={() => handleCategoryToggle(category)}
                    addModel={props.addModel}
                    models={props.state[category].models}
                    category={category}
                    isGridDropdown={category === 'createGrid'}
                    onCreateGrid={props.onCreateGrid}
                />
            ))}
        </div>
    );
};

export default Categories;