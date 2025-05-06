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
                <div> По оси X:
                    <input
                        type="number"
                        value={selectedModel.position[0]}
                        onChange={(e) => onPositionChange(0, parseFloat(e.target.value))}
                    /> px
                </div>
                <div> По оси Y:
                    <input
                        type="number"
                        value={selectedModel.position[1]}
                        onChange={(e) => onPositionChange(1, parseFloat(e.target.value))}
                    /> px
                </div>
                <div> По оси Z:
                    <input
                        type="number"
                        value={selectedModel.position[2]}
                        onChange={(e) => onPositionChange(2, parseFloat(e.target.value))}
                    /> px
                </div>
            </div>
            Угол поворота
            <div className={s.rotation}>
                <div>
                    Угол:
                    <input
                        type="number"
                        min="-180"
                        max="180"
                        value={selectedModel.rotation[1]}
                        onChange={(e) => onRotationChange(1, parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default Properties;