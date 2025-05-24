import React, { useState, useMemo } from 'react';
import s from './Categories.module.css';
import CatalogObjects from './CatalogObjects/CatalogObjects';

// Компонент для отображения категорий объектов
const Categories = (props) => {
    // Состояние для активной категории
    const [activeCategory, setActiveCategory] = useState(null);

    // Переключение активной категории
    const handleCategoryToggle = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    // Мемоизация списка категорий
    const categoryKeys = useMemo(() => Object.keys(props.state), [props.state]);

    // Рендеринг списка категорий
    return (
        <div className={s.catalogCategory}>
            {categoryKeys.map((category) => (
                <CatalogObjects
                    key={category}
                    nameCategory={props.state[category].displayName}
                    isOpen={activeCategory === category}
                    onToggle={() => handleCategoryToggle(category)}
                    addModel={props.addModel}
                    models={props.state[category].models}
                    buttonLabel={props.state[category].models.label}
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