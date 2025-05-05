import React from 'react';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";
import s from './App.module.css';
import { AddModel } from "./components/Scene/AddModel";

const App = () => {
    // создание модели и добавление в models
    const { models, addModel } = AddModel();
    // основная структура приложения
    return (
        <div className={s.appWrapper}>
            {/*4 основные компоненты на странице*/}
            {/*навигационно-информационная панель*/}
            <Header />
            {/*список категорий с выпадающим списком*/}
            <Categories addModel={addModel}/>
            {/*основная часть приложения для управления сценой*/}
            <Scene models={models} />
            {/*панель управления свойствами объектов*/}
            <Properties />
        </div>
    );
}

export default App;