import React, {useState} from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';

const App = () => {
    const [models, setModels] = useState([]);

    const addModel = (type) => {
        setModels([...models, {
            type,
            id: Date.now(),
            position: [0, 0, 0] }]);
    };

    // основная структура приложения
    return (
        <div className={s.appWrapper}>
            {/*4 основные компоненты на странице*/}
            {/*навигационно-информационная панель*/}
            <Header />
            {/*список категорий с выпадающим списком*/}
            <Categories onAddModel={addModel}/>
            {/*основная часть приложения для управления сценой*/}
            <Scene models={models} />
            {/*панель управления свойствами объектов*/}
            <Properties />
        </div>
    );
}

export default App;