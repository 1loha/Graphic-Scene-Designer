import React from 'react';
import s from './DropdownObjects/DropdownObjects.module.css';

// Компонент выпадающего меню для создания сетки
const GridCreationDropdown = ({ onCreateGrid, isDrawingGrid, isOpen }) => {
    // Обработчик клика по кнопке создания сетки
    const handleClick = () => {
        onCreateGrid();
    };

    // Рендеринг кнопки создания сетки
    return (
        <div className={s.dropdownObjects} style={{ visibility: isOpen ? 'visible' : 'hidden', padding: '10px' }}>
            <ul>
                <li>
                    <button onClick={handleClick} disabled={isDrawingGrid}>
                        Создать сетку
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default GridCreationDropdown;