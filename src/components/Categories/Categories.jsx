import React, { useState } from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

const Categories = (props) => {
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCategoryToggle = (category) => {
        if (!props.isGridCreated && category !== 'createGrid') return;
        if (props.isDrawingGrid && category !== 'createGrid') return;
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
                    isGridCreated={props.isGridCreated}
                    isDrawingGrid={props.isDrawingGrid}
                    onSelectModelType={props.onSelectModelType}
                />
            ))}
        </div>
    );
};

export default Categories;
