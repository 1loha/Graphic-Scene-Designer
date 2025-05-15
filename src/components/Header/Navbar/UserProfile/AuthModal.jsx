import React, { useState } from "react";
import s from "./AuthModal.module.css";

const AuthModal = ({ onClick }) => {
    const [isRegisterForm, setIsRegisterForm] = useState(false);

    const handleToggleForm = () => {
        setIsRegisterForm(!isRegisterForm);
    };

    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <button
                    className={s.closeButton}
                    onClick={onClick}
                    aria-label="Закрыть"
                >
                    X
                </button>
                <div className={s.form}>

                    <h2>{isRegisterForm ? "Регистрация" : "Авторизация"}</h2>

                    <label className={s.inputGroup}>
                        <span className={s.label}>Логин</span>
                        <input type="text" className={s.input} />
                    </label>

                    {isRegisterForm && (
                        <label className={s.inputGroup}>
                            <span className={s.label}>Почта</span>
                            <input type="email" className={s.input} />
                        </label>
                    )}

                    <label className={s.inputGroup}>
                        <span className={s.label}>Пароль</span>
                        <input type="password" className={s.input} />
                    </label>

                    {isRegisterForm && (
                        <label className={s.inputGroup}>
                            <span className={s.label}>Повтор пароля</span>
                            <input type="password" className={s.input} />
                        </label>
                    )}

                    <div>
                        <button className={s.authButton}>
                            {isRegisterForm ? "Зарегистрироваться" : "Войти"}
                        </button>
                    </div>

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