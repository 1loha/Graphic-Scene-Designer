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
        // Временное отключение блокировки для тестирования
        const isTestMode = true; // Установите false для возврата к исходной логике
        const isDisabled = (!props.isGridCreated && !props.isGridDropdown && !isTestMode) || (props.isDrawingGrid && !props.isGridDropdown);
        console.log('Button props:', { category: props.category, isDisabled, isGridCreated: props.isGridCreated, isDrawingGrid: props.isDrawingGrid, isTestMode });
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
            {props.isOpen && (
                <div style={{ display: props.isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>
                    {props.isGridDropdown ? (
                        <GridCreationDropdown
                            onCreateGrid={props.onCreateGrid}
                            isDrawingGrid={props.isDrawingGrid}
                            isOpen={props.isOpen}
                        />
                    ) : (
                        <DropdownObjects
                            addModel={props.addModel}
                            models={props.models}
                            category={props.category}
                            onSelectModelType={props.onSelectModelType}
                            selectedModelType={props.selectedModelType}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogObjects;