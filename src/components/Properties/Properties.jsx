import React from 'react';
import s from './Properties.module.css';

const Properties = ({ selectedModel, onPositionChange, onRotationChange, onScaleChange }) => {
    if (!selectedModel) {
        return (
            <div className={s.properties}>
                Выберите объект
            </div>
        );
    }
    return (
        <div className={s.properties}>
            Перемещение
            <div className={s.position}>
                {/* позиция по оси x */}
                <div> По оси X:
                    <input type="number"
                           value={selectedModel.position[0]}
                           onChange={(e) => onPositionChange(0, parseFloat(e.target.value))}
                    /> px
                </div>
                {/* позиция по оси y */}
                <div> По оси Y:
                    <input type="number"
                           value={selectedModel.position[1]}
                           onChange={(e) => onPositionChange(1, parseFloat(e.target.value))}
                    /> px
                </div>
                {/* позиция по оси z */}
                <div> По оси Z:
                    <input type="number"
                           value={selectedModel.position[2]}
                           onChange={(e) => onPositionChange(2, parseFloat(e.target.value))}
                    /> px
                </div>
            </div>
            Угол поворота
            <div className={s.rotation}>
                {/* угол поворота вокруг оси Y */}
                <div>
                    Угол:
                    <input type="number"
                           min="-180"
                           max="180"
                           value={selectedModel.rotation[1]}
                           onChange={(e) => onRotationChange(1, parseFloat(e.target.value))}
                    />
                </div>
            </div>
            Размер
            <div className={s.scale}>
                {/* размер по длине */}
                <div> Длина
                    <input type="number"
                           value={selectedModel.scale[0]}
                           onChange={(e) => onScaleChange(0, parseFloat(e.target.value))}
                    />
                </div>
                {/* размер по высоте */}
                <div> Высота
                    <input type="number"
                           value={selectedModel.scale[1]}
                           onChange={(e) => onScaleChange(1, parseFloat(e.target.value))}
                    />
                </div>
                {/* размер по ширине */}
                <div> Ширина
                    <input type="number"
                           value={selectedModel.scale[2]}
                           onChange={(e) => onScaleChange(2, parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default Properties;