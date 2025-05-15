import React, { useState } from "react";
import s from "./AuthModal.module.css";

// Компонент модального окна для авторизации и регистрации
const AuthModal = ({ onClick }) => {
    // Состояние для переключения между формами
    const [isRegisterForm, setIsRegisterForm] = useState(false);
    // Состояние для полей формы
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // Состояние для ошибок валидации
    const [errors, setErrors] = useState({});

    // Переключение между формами
    const handleToggleForm = () => {
        setIsRegisterForm(!isRegisterForm);
        setErrors({});
        setFormData({ login: '', email: '', password: '', confirmPassword: '' });
    };

    // Обработка изменения полей
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Валидация и отправка формы
    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.login) newErrors.login = 'Логин обязателен';
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        if (isRegisterForm) {
            if (!formData.email) newErrors.email = 'Почта обязательна';
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Пароли не совпадают';
            }
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Отправка данных:', formData);
            // Здесь можно добавить вызов API для авторизации/регистрации
        }
    };

    // Рендеринг модального окна
    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                {/* Кнопка закрытия окна */}
                <button
                    className={s.closeButton}
                    onClick={onClick}
                    aria-label="Закрыть"
                >
                    X
                </button>
                <div className={s.form}>
                    {/* Заголовок формы */}
                    <h2>{isRegisterForm ? "Регистрация" : "Авторизация"}</h2>

                    {/* Поле для ввода логина */}
                    <label className={s.inputGroup}>
                        <span className={s.label}>Логин</span>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleInputChange}
                            className={s.input}
                        />
                        {errors.login && <span className={s.error}>{errors.login}</span>}
                    </label>

                    {/* Поле для ввода почты (только для регистрации) */}
                    {isRegisterForm && (
                        <label className={s.inputGroup}>
                            <span className={s.label}>Почта</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={s.input}
                            />
                            {errors.email && <span className={s.error}>{errors.email}</span>}
                        </label>
                    )}

                    {/* Поле для ввода пароля */}
                    <label className={s.inputGroup}>
                        <span className={s.label}>Пароль</span>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={s.input}
                        />
                        {errors.password && <span className={s.error}>{errors.password}</span>}
                    </label>

                    {/* Поле для повтора пароля (только для регистрации) */}
                    {isRegisterForm && (
                        <label className={s.inputGroup}>
                            <span className={s.label}>Повтор пароля</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={s.input}
                            />
                            {errors.confirmPassword && (
                                <span className={s.error}>{errors.confirmPassword}</span>
                            )}
                        </label>
                    )}

                    {/* Кнопка отправки формы */}
                    <div>
                        <button className={s.authButton} onClick={handleSubmit}>
                            {isRegisterForm ? "Зарегистрироваться" : "Войти"}
                        </button>
                    </div>

                    {/* Кнопка переключения формы */}
                    <div>
                        <button className={s.authButton} onClick={handleToggleForm}>
                            {isRegisterForm ? "Авторизация" : "Регистрация"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;