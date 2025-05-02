import React, {useState} from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';

const App = () => {
    const [sceneModels, setSceneModels] = useState([]);
    const random = Math.random() * 4 - 2;
    const handleAddModel = (path) => {
        const newPosition = [random, 0, random];

        setSceneModels([...sceneModels, { path, position: newPosition, scale: 0.5 }]);
    };
    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories onAddModel={handleAddModel}/>
            <Scene models={sceneModels}/>
            <Properties />
        </div>
    );
}

export default App;
