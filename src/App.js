import React, {useState} from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';

const App = () => {
    const [sceneModels, setSceneModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);

    const handleAddModel = (path) => {
        setSelectedModel(path);
    };

    const handlePlaceModel = (position) => {
        if (selectedModel) {
            setSceneModels([...sceneModels, {
                path: selectedModel,
                position,
                scale: 0.5
            }]);
        }
    };

    const handleCancelSelection = () => {
        setSelectedModel(null);
    };

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories onAddModel={handleAddModel}/>
            <Scene
                models={sceneModels}
                selectedModel={selectedModel}
                onPlaceModel={handlePlaceModel}
                onCancelSelection={handleCancelSelection}
            />
            <Properties />
        </div>
    );
}

export default App;