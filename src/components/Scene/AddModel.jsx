import { useState } from "react";

export const AddModel = ( props ) => {
    const [models, setModels] = useState([]);

    const addModel = (category, type) => {
        if (!props.isGridCreated) return;
        setModels(prevModels => [
            ...prevModels, {
                type, category,
                id: Date.now(),
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                normalizedScale: [1, 1, 1],
                baseScale: props.state[category].models[type].scale,
            }
        ]);
    };

    const updateModel = (id, updates) => {
        setModels(prevModels =>
            prevModels.map(model =>model.id === id ? { ...model, ...updates } : model)
        );
    };

    return { models, addModel, updateModel };
};