import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Categories from './components/Categories/Categories';
import Scene from './components/Scene/Scene';
import Properties from './components/Properties/Properties';
import s from './App.module.css';
import { AddModel } from './components/Scene/AddModel';

const App = (props) => {
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [isGridCreated, setIsGridCreated] = useState(false);
    const [isDrawingGrid, setIsDrawingGrid] = useState(false);
    const [gridPoints, setGridPoints] = useState([]);
    const [selectedModelType, setSelectedModelType] = useState(null); // { category, type }

    // Pass state and isGridCreated to AddModel
    const { models, addModel, updateModel } = AddModel({ state: props.state, isGridCreated });

    const handleModelUpdate = (id, updates) => {
        console.log('handleModelUpdate:', id, updates);
        updateModel(id, updates);
    };

    const handleCreateGrid = () => {
        console.log('handleCreateGrid called');
        setIsDrawingGrid(true);
        setGridPoints([]);
    };

    const handleGridCreated = (isCreated) => {
        console.log('handleGridCreated:', isCreated);
        setIsGridCreated(isCreated);
        setIsDrawingGrid(false);
    };

    const handlePointAdded = (data) => {
        console.log('handlePointAdded:', data);
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            setGridPoints(data);
        } else if (Array.isArray(data) && data.length === 3 && data.every(num => typeof num === 'number')) {
            setGridPoints((prev) => [...prev, data]);
        } else {
            console.error('Invalid point data:', data);
        }
    };

    const handleSelectModelType = (category, type) => {
        console.log('Selected model type:', { category, type });
        setSelectedModelType({ category, type });
    };

    const handleModelPlaced = () => {
        console.log('handleModelPlaced: Clearing selectedModelType');
        setSelectedModelType(null);
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

    // Log state and models for debugging
    console.log('App state:', {
        state: props.state,
        models,
        isGridCreated,
        selectedModelType
    });

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
                onSelectModelType={handleSelectModelType}
            />
            <Scene
                state={props.state}
                models={models}
                selectedModelId={selectedModelId}
                onModelSelect={setSelectedModelId}
                onModelUpdate={handleModelUpdate}
                isGridCreated={isGridCreated}
                gridScale={props.gridScale || 20}
                gridDivisions={props.gridDivisions || 40}
                isDrawing={isDrawingGrid}
                onGridCreated={handleGridCreated}
                onPointAdded={handlePointAdded}
                gridPoints={gridPoints}
                addModel={addModel}
                selectedModelType={selectedModelType}
                onModelPlaced={handleModelPlaced}
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