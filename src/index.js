import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from "./redux/state";
import App from './App';
import reportWebVitals from './reportWebVitals';

// Инициализация корневого элемента приложения
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендеринг главного компонента приложения
root.render(
    <React.StrictMode>
        <App state={store.getState()}/>
    </React.StrictMode>
);

reportWebVitals();