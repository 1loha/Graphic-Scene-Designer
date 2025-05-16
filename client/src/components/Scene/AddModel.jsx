import { useState } from "react";

// Хук для управления моделями
export const AddModel = (props) => {
    // Состояние для хранения списка моделей
    const [models, setModels] = useState([]);

    // Добавление новой модели
    const addModel = (category, type, options = {}) => {
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

    // Обновление модели
    const updateModel = (id, updates) => {
        setModels(prevModels =>
            prevModels.map(model => model.id === id ? { ...model, ...updates } : model)
        );
    };

    // Удаление модели
    const deleteModel = (id) => {
        setModels(prevModels => prevModels.filter(model => model.id !== id));
    };

    // Возврат функций управления моделями
    return { models, addModel, updateModel, deleteModel, setModels };
};