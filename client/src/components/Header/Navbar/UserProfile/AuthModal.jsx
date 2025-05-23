import React, { useState } from "react";
import s from "./AuthModal.module.css";
import { register, login } from "../../../../api"; // Импорт API-функций

// Модальное окно для авторизации и регистрации пользователей
const AuthModal = ({ onClick, onLoginSuccess }) => {
    // Состояние для переключения между формами регистрации и авторизации
    const [isRegisterForm, setIsRegisterForm] = useState(false);
    // Состояние для хранения данных формы (логин, пароль, подтверждение пароля)
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    });
    // Состояние для хранения ошибок валидации и сообщений API
    const [errors, setErrors] = useState({});

    // Переключение между формами регистрации и авторизации
    const handleToggleForm = () => {
        setIsRegisterForm(!isRegisterForm);
        setErrors({});
        setFormData({ login: '', password: '', confirmPassword: '' });
    };

    // Обработка изменения полей ввода
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработка отправки формы (регистрация или вход)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Валидация полей
        const newErrors = {};
        if (!formData.login) newErrors.login = 'Логин обязателен';
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        if (isRegisterForm && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }
        setErrors(newErrors);

        // Если ошибок нет, отправляем запрос к API
        if (Object.keys(newErrors).length === 0) {
            try {
                if (isRegisterForm) {
                    // Действие пользователя: Заполнить логин, пароль, подтвердить пароль и нажать "Зарегистрироваться"
                    await register(formData.login, formData.password);
                    setIsRegisterForm(false); // Переключиться на форму входа
                    setErrors({ success: 'Регистрация успешна. Пожалуйста, войдите.' });
                } else {
                    // Действие пользователя: Заполнить логин и пароль, нажать "Войти"
                    const { token, userId } = await login(formData.login, formData.password);
                    localStorage.setItem('authToken', token); // Сохранить токен
                    localStorage.setItem('userId', userId); // Сохранить ID пользователя
                    onLoginSuccess(); // Уведомить о входе
                }
            } catch (error) {
                setErrors({ api: error.message }); // Показать ошибку от API
            }
        }
    };

    // Рендеринг UI модального окна
    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                {/* Кнопка закрытия модального окна */}
                <button
                    className={s.closeButton}
                    onClick={onClick}
                    aria-label="Закрыть"
                >
                    X
                </button>
                <div className={s.form}>
                    <h2>{isRegisterForm ? "Регистрация" : "Авторизация"}</h2>
                    {/* Сообщения об успехе или ошибке */}
                    {errors.success && <span className={s.success}>{errors.success}</span>}
                    {errors.api && <span className={s.error}>{errors.api}</span>}
                    {/* Поле логина */}
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
                    {/* Поле пароля */}
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
                    {/* Поле подтверждения пароля (только для регистрации) */}
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