import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Categories from './components/Categories/Categories';
import Scene from './components/Scene/Scene';
import Properties from './components/Properties/Properties';
import s from './App.module.css';
import { AddModel } from './components/Scene/AddModel';
import AuthModal from "./components/Header/Navbar/UserProfile/AuthModal";
import useSaveLoadProject from './hooks/useSaveLoadProject';

// Главный компонент приложения, управляет состоянием и рендерингом
const App = (props) => {
    // Состояние для выбранной модели
    const [selectedModelId, setSelectedModelId] = useState(null);
    // Флаг создания сетки
    const [isGridCreated, setIsGridCreated] = useState(false);
    // Флаг рисования сетки
    const [isDrawingGrid, setIsDrawingGrid] = useState(false);
    // Точки сетки
    const [gridPoints, setGridPoints] = useState([]);
    // Тип выбранной модели
    const [selectedModelType, setSelectedModelType] = useState(null);
    // Флаг сброса рисования
    const [resetDrawing, setResetDrawing] = useState(false);
    // Показ модального окна авторизации
    const [showAuthModal, setShowAuthModal] = useState(false);
    // Callback'и для авторизации
    const [authCallbacks, setAuthCallbacks] = useState({ onSuccess: null, onFailure: null });
    // ID проекта
    const [projectId, setProjectId] = useState(null);
    // Название проекта
    const [projectName, setProjectName] = useState('My Project');
    // Флаг авторизации
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    // Хук для управления моделями
    const { models, addModel, updateModel, deleteModel, setModels } = AddModel({ state: props.state, isGridCreated });

    // Хук для сохранения/загрузки проектов
    const { saveProject, loadProject } = useSaveLoadProject({
        projectId,
        setProjectId,
        projectName,
        setProjectName,
        gridPoints,
        setGridPoints,
        isGridCreated,
        setIsGridCreated,
        isDrawingGrid,
        setIsDrawingGrid,
        resetDrawing,
        setResetDrawing,
        models,
        setModels,
        // Открытие модального окна авторизации
        openAuthModal: ({ onSuccess, onFailure } = {}) => {
            setAuthCallbacks({ onSuccess, onFailure });
            setShowAuthModal(true);
        }
    });

    // Обновление модели
    const handleModelUpdate = (id, updates) => { updateModel(id, updates); };

    // Начало создания сетки
    const handleCreateGrid = () => {
        setIsDrawingGrid(true);
        setGridPoints([]);
        setIsGridCreated(false);
        setResetDrawing(true);
    };

    // Завершение создания сетки
    const handleGridCreated = (isCreated) => {
        console.log('Grid created:', isCreated);
        setIsGridCreated(isCreated);
        setIsDrawingGrid(false);
        setResetDrawing(false);
    };

    // Добавление точки сетки
    const handlePointAdded = (data) => {
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            setGridPoints(data);
        } else if (Array.isArray(data) && data.length === 3 && data.every(num => typeof num === 'number')) {
            setGridPoints((prev) => [...prev, data]);
        }
    };

    // Выбор типа модели
    const handleSelectModelType = (category, type) => {
        setSelectedModelType({ category, type });
    };

    // Размещение модели
    const handleModelPlaced = () => { setSelectedModelType(null); };

    // Удаление модели
    const handleDeleteModel = (id) => {
        deleteModel(id);
        if (selectedModelId === id) setSelectedModelId(null);
    };

    // Открытие профиля/авторизации
    const handleUserProfileClick = () => { setShowAuthModal(true); };

    // Закрытие модального окна
    const handleCloseModal = () => {
        setShowAuthModal(false);
        if (authCallbacks.onFailure) {
            authCallbacks.onFailure();
        }
        setAuthCallbacks({ onSuccess: null, onFailure: null });
    };

    // Успешная авторизация
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        if (authCallbacks.onSuccess) {
            authCallbacks.onSuccess();
        }
        setAuthCallbacks({ onSuccess: null, onFailure: null });
    };

    // Выход из аккаунта
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    // Обработка нажатия Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isDrawingGrid) {
                    setIsDrawingGrid(false);
                    setGridPoints([]);
                    setResetDrawing(true);
                }
                if (showAuthModal) setShowAuthModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawingGrid, showAuthModal]);

    // Логирование состояния сетки
    useEffect(() => {
        console.log('App state:', { gridPoints, isGridCreated });
    }, [gridPoints, isGridCreated]);

    // Выбранная модель
    const selectedModel = models.find((model) => model.id === selectedModelId);

    // Рендеринг компонентов
    return (
        <div className={s.appWrapper}>
            <Header
                onUserProfileClick={handleUserProfileClick}
                onSaveProject={saveProject}
                onLoadProject={loadProject}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
            />
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
                resetDrawing={resetDrawing}
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
                onDelete={handleDeleteModel}
            />
            {showAuthModal && <AuthModal onClick={handleCloseModal} onLoginSuccess={handleLoginSuccess} />}
        </div>
    );
};

export default App;