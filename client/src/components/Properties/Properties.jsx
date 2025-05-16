import React from 'react';
import s from './Properties.module.css';
import PropertyInput from './PropertyInput';

const Properties = ({ selectedModel, onPositionChange, onRotationChange, onScaleChange, onDelete }) => {
    if (!selectedModel) return <div className={s.properties}>Выберите объект</div>;

    const positionAxes = [
        { label: 'По оси X', unit: 'px', index: 0 },
        { label: 'По оси Y', unit: 'px', index: 1 },
        { label: 'По оси Z', unit: 'px', index: 2 },
    ];
    const scaleAxes = [
        { label: 'Длина', index: 0 },
        { label: 'Высота', index: 1 },
        { label: 'Ширина', index: 2 },
    ];

    return (
        <div className={s.properties}>
            <div>
                Перемещение
                <div className={s.position}>
                    {positionAxes.map(({ label, unit, index }) => (
                        <PropertyInput
                            key={label}
                            label={label}
                            value={selectedModel.position[index]}
                            onChange={(value) => onPositionChange(index, value)}
                            unit={unit}
                        />
                    ))}
                </div>
            </div>
            <div>
                Угол поворота
                <div className={s.rotation}>
                    <PropertyInput
                        label="Угол"
                        value={selectedModel.rotation[1]}
                        onChange={(value) => onRotationChange(1, value)}
                    />
                </div>
            </div>
            <div>
                Размер
                <div className={s.scale}>
                    {scaleAxes.map(({ label, index }) => (
                        <PropertyInput
                            key={label}
                            label={label}
                            value={selectedModel.normalizedScale[index]}
                            onChange={(value) => onScaleChange(index, value)}
                        />
                    ))}
                </div>
            </div>
            <div>
                <button onClick={() => onDelete(selectedModel.id)} className={s.deleteButton}>
                    Удалить
                </button>
            </div>
        </div>
    );
};

export default Properties;