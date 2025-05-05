import { useState } from "react";

export const AddModel = ( { objects } ) => {
    const [models, setModels] = useState([]);

    const addModel = (type) => {
        setModels(prevModels => [
            ...prevModels,
            {
                type,
                id: Date.now(),
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: objects[type].scale,
            }
        ]);
    };

    const updateModel = (id, updates) => {
        setModels(prevModels =>
            prevModels.map(model =>
                model.id === id ? { ...model, ...updates } : model
            )
        );
    };

    return { models, addModel, updateModel };
};