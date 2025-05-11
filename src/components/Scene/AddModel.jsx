import { useState } from "react";

export const AddModel = (props) => {
    const [models, setModels] = useState([]);

    const addModel = (category, type, options = {}) => {
        if (!props.isGridCreated) return;
        console.log('Adding model:', category, type, options);
        try {
            const modelData = props.state[category]?.models[type];
            if (!modelData || !modelData.scale) {
                throw new Error(`Invalid model data for ${category}/${type}`);
            }
            setModels(prevModels => [
                ...prevModels, {
                    type,
                    category,
                    id: Date.now(),
                    position: options.position || [0, 0, 0],
                    rotation: [0, 0, 0],
                    normalizedScale: [1, 1, 1],
                    baseScale: modelData.scale,
                }
            ]);
        } catch (error) {
            console.error('Error adding model:', error);
        }
    };

    const updateModel = (id, updates) => {
        setModels(prevModels =>
            prevModels.map(model => model.id === id ? { ...model, ...updates } : model)
        );
    };

    return { models, addModel, updateModel };
};