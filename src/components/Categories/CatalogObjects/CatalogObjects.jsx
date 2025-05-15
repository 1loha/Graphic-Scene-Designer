import React from 'react';
import s from './CatalogObjects.module.css';
import downArrow from '../../../images/down_white.png';
import rightArrow from '../../../images/right_white.png';
import DropdownObjects from "./DropdownObjects/DropdownObjects";
import GridCreationDropdown from './GridCreationDropdown';

// Компонент для отображения категории объектов
const CatalogObjects = (props) => {
    // Обработчик клика по выпадающему меню
    const handleDropdownClick = () => props.onToggle(props.nameCategory);

    // Получение свойств кнопки (disabled и className)
    const getButtonProps = () => {
        const isDisabled =
            (!props.isGridCreated && !props.isGridDropdown) ||
            (props.isDrawingGrid && !props.isGridDropdown);
        return {
            disabled: isDisabled,
            className: isDisabled ? s.disabledButton : ''
        };
    };

    // Рендеринг категории
    const { disabled, className } = getButtonProps();

    return (
        <div className={s.catalogObjects}>
            {/* Кнопка категории */}
            <button
                onClick={handleDropdownClick}
                disabled={disabled}
                className={className}
            >
                <span className={s.buttonText}>{props.nameCategory}</span>
                <span className={s.buttonIcon}>
                    <img
                        className={s.arrowIcon}
                        src={props.isOpen ? rightArrow : downArrow}
                        alt=">"
                    />
                </span>
            </button>
            {/* Выпадающее меню */}
            {props.isOpen &&
                (props.isGridDropdown ? (
                    <GridCreationDropdown
                        onCreateGrid={props.onCreateGrid}
                        isDrawingGrid={props.isDrawingGrid}
                    />
                ) : (
                    <DropdownObjects
                        addModel={props.addModel}
                        models={props.models}
                        category={props.category}
                        onSelectModelType={props.onSelectModelType}
                        selectedModelType={props.selectedModelType}
                    />
                ))}
        </div>
    );
};

export default CatalogObjects;