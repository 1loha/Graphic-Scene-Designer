import React from 'react';
import s from './Properties.module.css';

const Properties = () => {
    return (
        <div className={s.properties}>
            Перемещение
            <div className={s.position}>
                <div>
                    По оси X: <input type="number"/> px
                </div>
                <div>
                    По оси Y: <input type="number" /> px
                </div>
                <div>
                    По оси Z: <input type="number" /> px
                </div>
            </div>
            Угол поворота
            <div className={s.rotation}>
                <div>
                    Угол: <input type="number" min="-180" max="180"/>
                </div>
            </div>
        </div>
    )
}

export default Properties;