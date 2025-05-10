import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Categories from './components/Categories/Categories';
import Scene from './components/Scene/Scene';
import Properties from './components/Properties/Properties';
import s from './App.module.css';
import { AddModel } from './components/Scene/AddModel';

const App = (props) => {
    const { models, addModel, updateModel } = AddModel(props);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [isGridCreated, setIsGridCreated] = useState(false);
    const [isDrawingGrid, setIsDrawingGrid] = useState(false);
    const [gridPoints, setGridPoints] = useState([]);

    const handleModelUpdate = (id, updates) => {
        updateModel(id, updates);
    };

    const handleCreateGrid = () => {
        console.log('handleCreateGrid called');
        setIsDrawingGrid(true);
        setGridPoints([]);
    };

    const handleGridCreated = (isCreated) => {
        setIsGridCreated(isCreated);
        setIsDrawingGrid(false);
    };

    const handlePointAdded = (point) => {
        console.log('handlePointAdded:', point);
        setGridPoints((prev) => [...prev, point]);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isDrawingGrid) {
                console.log('Escape pressed, canceling drawing');
                setIsDrawingGrid(false);
                setGridPoints([]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawingGrid]);

    const selectedModel = models.find((model) => model.id === selectedModelId);

    return (
        <div className={s.appWrapper}>
            <Header />
            <Categories
                addModel={addModel}
                state={props.state}
                onCreateGrid={handleCreateGrid}
                isGridCreated={isGridCreated}
                isDrawingGrid={isDrawingGrid}
            />
            <Scene
                state={props.state}
                models={models}
                selectedModelId={selectedModelId}
                onModelSelect={setSelectedModelId}
                onModelUpdate={handleModelUpdate}
                isGridCreated={isGridCreated}
                gridScale={20}
                gridDivisions={40}
                isDrawing={isDrawingGrid}
                onGridCreated={handleGridCreated}
                onPointAdded={handlePointAdded}
                gridPoints={gridPoints}
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
                    const newScale = [...selectedModel.normalizedScale];
                    newScale[axis] = value;
                    handleModelUpdate(selectedModelId, { normalizedScale: newScale });
                }}
            />
        </div>
    );
};

export default App;