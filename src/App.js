import React, { useState } from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';
import { AddModel } from "./components/Scene/AddModel";

// const objects = {
//     furniture: {
//         chair: {path: '/models/chair/scene.gltf',
//             scale: [1,1,1],},
//         table: {path: '/models/table/scene.gltf',
//             scale: [1,1,1],},
//         sofa: {path: '/models/sofa/scene.gltf',
//             scale: [0.05,0.05,0.05],},
//     },
//     sanitary: {
//         steve: {path: '/models/steve/source/model.gltf',
//             scale: [1,1,1],},
//         bath: {path: '/models/bath_with_sink/scene.gltf',
//             scale: [1,1,1],},
//         shower: {path: '/models/shower/scene.gltf',
//             scale: [1,1,1],},
//     },
//     lighting: {path: 'public/models/office_lamp/scene.gltf',
//         scale: [1,1,1],},
// }

const App = (props) => {
    const { models, addModel, updateModel } = AddModel(props);
    const [selectedModelId, setSelectedModelId] = useState(null);

    // Обработчик обновления модели
    const handleModelUpdate = (id, updates) => {
        updateModel(id, updates);
    };

    const selectedModel = models.find(model => model.id === selectedModelId);

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories addModel={addModel}
                        state={props.state}/>
            <Scene state={props.state}
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