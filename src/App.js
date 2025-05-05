import React, { useState } from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';
import { AddModel } from "./components/Scene/AddModel";

const App = () => {
    const { models, addModel, updateModel } = AddModel(); // Добавляем updateModel
    const [selectedModelId, setSelectedModelId] = useState(null);

    // Обработчик обновления модели
    const handleModelUpdate = (id, updates) => {
        updateModel(id, updates); // Используем updateModel из AddModel
    };

    const selectedModel = models.find(model => model.id === selectedModelId);

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories addModel={addModel} />
            <Scene
                models={models}
                selectedModelId={selectedModelId}
                onModelSelect={setSelectedModelId}
                onModelUpdate={handleModelUpdate}
            />
            <Properties
                selectedModel={selectedModel}
                onPositionChange={(axis, value) => {
                    if (!selectedModel) return;
                    const newPosition = [...selectedModel.position];
                    newPosition[axis] = value;
                    handleModelUpdate(selectedModelId, { position: newPosition });
                }}
                onRotationChange={(axis, value) => {
                    if (!selectedModel) return;
                    const newRotation = [...selectedModel.rotation];
                    newRotation[axis] = value;
                    handleModelUpdate(selectedModelId, { rotation: newRotation });
                }}
            />
        </div>
    );
};

export default App;