import React, { useState } from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';
import { AddModel } from "./components/Scene/AddModel";

const App = (props) => {
    const { models, addModel, updateModel } = AddModel(props);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [isGridCreated, setIsGridCreated] = useState(false);

    // Обработчик обновления модели
    const handleModelUpdate = (id, updates) => {updateModel(id, updates);};
    // Обработчик создания сетки
    const handleCreateGrid = () => {setIsGridCreated(true);};

    const selectedModel = models.find(model => model.id === selectedModelId);

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories addModel={addModel}
                        state={props.state}
                        onCreateGrid={handleCreateGrid}
            />
            <Scene state={props.state}
                   models={models}
                   selectedModelId={selectedModelId}
                   onModelSelect={setSelectedModelId}
                   onModelUpdate={handleModelUpdate}
                   isGridCreated={isGridCreated}
                   gridScale={20}
                   gridDivisions={40}
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