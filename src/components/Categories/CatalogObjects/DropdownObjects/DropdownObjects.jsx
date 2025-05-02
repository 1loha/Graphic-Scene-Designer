import React from 'react';
import s from './DropdownObjects.module.css';

const DropdownObjects = ({ onAddModel }) => {
    const handleAddModel = (path) => {
        onAddModel(path);
    }

    return (
        <div className={s.dropdownObjects}>
            <ul>
                <li>
                    <button type="button" onClick={() => handleAddModel('/steve/source/model.gltf')}>
                        steve
                    </button>
                </li>
                <li>
                    <button type="button" onClick={() => handleAddModel('/shameless_loona_pose/scene.gltf')}>
                        loona
                    </button>
                </li>
                <li>Item 3</li>
                <li>Item 4</li>
            </ul>
        </div>
    )
}
export default DropdownObjects;