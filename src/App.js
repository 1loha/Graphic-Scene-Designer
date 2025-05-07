import React, { useState } from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';
import { AddModel } from "./components/Scene/AddModel";

const objects = {
    steve: {
        path: '/models/steve/source/model.gltf',
        scale: [1,1,1],},
    loona: {
        path: '/models/shameless_loona_pose/scene.gltf',
        scale: [0.5,0.5,0.5],},
    chair: {
        path: '/models/chair/scene.gltf',
        scale: [1,1,1],},
    table: {
        path: '/models/table/scene.gltf',
        scale: [1,1,1],},
    sofa: {
        path: '/models/sofa/scene.gltf',
        scale: [0.05,0.05,0.05],},
}

const App = () => {
    const { models, addModel, updateModel } = AddModel({objects});
    const [selectedModelId, setSelectedModelId] = useState(null);

    // Обработчик обновления модели
    const handleModelUpdate = (id, updates) => {
        updateModel(id, updates);
    };

    const selectedModel = models.find(model => model.id === selectedModelId);

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories addModel={addModel} />
            <Scene
                objects={objects}
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
                onScaleChange={(axis, value) => {
                    if (!selectedModel) return;
                    const newScale = [...selectedModel.scale];
                    newScale[axis] = value;
                    handleModelUpdate(selectedModelId, { scale: newScale });
                }}
            />
        </div>
    );
};

export default App;