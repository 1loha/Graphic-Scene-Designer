import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Categories from './components/Categories/Categories';
import Scene from './components/Scene/Scene';
import Properties from './components/Properties/Properties';
import s from './App.module.css';
import { AddModel } from './components/Scene/AddModel';
import AuthModal from "./components/Header/Navbar/UserProfile/AuthModal";
import useSaveLoadProject from './hooks/useSaveLoadProject';

// Главный компонент приложения
const App = (props) => {
    // Состояния для управления сценой и моделями
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [isGridCreated, setIsGridCreated] = useState(false);
    const [isDrawingGrid, setIsDrawingGrid] = useState(false);
    const [gridPoints, setGridPoints] = useState([]);
    const [selectedModelType, setSelectedModelType] = useState(null);
    const [resetDrawing, setResetDrawing] = useState(false);
    // Состояние для управления модальным окном авторизации
    const [showAuthModal, setShowAuthModal] = useState(false);
    // Состояния для управления проектом
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState('My Project');
    // Состояние для отслеживания авторизации
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    // Хук для управления моделями
    const { models, addModel, updateModel, deleteModel, setModels } = AddModel({ state: props.state, isGridCreated });

    // Хук для сохранения и загрузки проектов
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
        setModels
    });

    // Обновление параметров модели
    const handleModelUpdate = (id, updates) => { updateModel(id, updates); };

    // Создание новой сетки
    const handleCreateGrid = () => {
        setIsDrawingGrid(true);
        setGridPoints([]);
        setIsGridCreated(false);
        setResetDrawing(true);
    };

    // Завершение создания сетки
    const handleGridCreated = (isCreated) => {
        setIsGridCreated(isCreated);
        setIsDrawingGrid(false);
        setResetDrawing(false);
    };

    // Добавление точки к сетке
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

    // Завершение размещения модели
    const handleModelPlaced = () => { setSelectedModelType(null); };

    // Удаление модели
    const handleDeleteModel = (id) => {
        deleteModel(id);
        if (selectedModelId === id) setSelectedModelId(null);
    };

    // Действие пользователя: Открытие формы авторизации/регистрации
    const handleUserProfileClick = () => { setShowAuthModal(true); };

    // Закрытие формы авторизации/регистрации
    const handleCloseModal = () => { setShowAuthModal(false); };

    // Обработка успешного входа
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
    };

    // Обработка выхода
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    // Обработка нажатия клавиши Escape
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

    // Поиск выбранной модели
    const selectedModel = models.find((model) => model.id === selectedModelId);

    // Рендеринг компонентов приложения
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