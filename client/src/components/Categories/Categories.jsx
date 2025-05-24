import React, {useState, useMemo, useRef} from 'react';
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

    // Ссылка на input для выбора файла
    const fileInputRef = useRef(null);

    // Обработчик клика по кнопке импорта
    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    // Обработчик выбора файла
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.glb') && props.onImportModel) {
            props.onImportModel(file, 'imported');
        }
        // Сбрасываем input, чтобы можно было выбрать тот же файл снова
        event.target.value = null;
    };

    // Рендеринг списка категорий
    return (
        <div className={s.catalogCategory}>
            {categoryKeys.map((category) => (
                <div key={category}>
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
                        onImportModel={props.onImportModel}
                    />
            </div>
            ))}
            <button onClick={handleImportClick} disabled={!props.isGridCreated}
                className={`${s.importButton} ${!props.isGridCreated ? s.disabledButton : ''}`}
            >
                Импортировать
            </button>
            <input
                type="file"
                // accept=".gltf"
                accept=".glb"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Categories;