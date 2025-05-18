const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Инициализация Express-приложения
const app = express();
app.use(cors()); // Разрешение CORS-запросов
app.use(express.json()); // Парсинг JSON-тела запросов

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000 // Таймаут 20 секунд
})
    .then(() => console.log('Подключено к MongoDB'))
    .catch(err => {
        console.error('Ошибка подключения:', err.message);
        console.error('MONGODB_URI:', process.env.MONGODB_URI ? 'Установлен' : 'Не установлен');
    });

// Схема: Определение схемы пользователя (users)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Схема: Определение схемы проекта (projects)
const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    name: { type: String, required: true },
    grid: {
        points: { type: [[Number]], default: [] },
        isShapeClosed: { type: Boolean, required: true }
    },
    models: [{
        id: { type: Number, required: true },
        category: { type: String, required: true },
        type: { type: String, required: true },
        position: { type: [Number], required: true },
        rotation: { type: [Number], required: true },
        normalizedScale: { type: [Number], required: true },
        baseScale: { type: [Number], required: true }
    }]
});
const Project = mongoose.model('Project', projectSchema);

// Middleware для проверки JWT-токена
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Недействительный токен' });
    }
};

// Эндпоинт регистрации
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Регистрация:', { username }); // Логирование
        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log('Пользователь зарегистрирован:', username);
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (error) {
        console.error('Ошибка регистрации:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Эндпоинт входа
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Вход:', { username }); // Логирование
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Ошибка входа:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Эндпоинт сохранения проекта
app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        console.log('Сохранение проекта:', req.body); // Логирование
        const projectData = { ...req.body, userId: req.userId };
        // Убедимся, что grid.points есть, даже если пустой
        if (!projectData.grid || typeof projectData.grid !== 'object') {
            projectData.grid = { points: [], isShapeClosed: false };
        } else if (!Array.isArray(projectData.grid.points)) {
            projectData.grid.points = [];
        }
        const project = new Project(projectData);
        await project.save();
        console.log('Проект сохранен:', project.projectId);
        res.status(201).json(project);
    } catch (error) {
        console.error('Ошибка сохранения проекта:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Эндпоинт обновления проекта
app.put('/api/projects/:projectId', authMiddleware, async (req, res) => {
    try {
        console.log('Обновление проекта:', req.params.projectId, req.body); // Логирование
        const projectData = { ...req.body, userId: req.userId };
        // Убедимся, что grid.points есть
        if (!projectData.grid || typeof projectData.grid !== 'object') {
            projectData.grid = { points: [], isShapeClosed: false };
        } else if (!Array.isArray(projectData.grid.points)) {
            projectData.grid.points = [];
        }
        const project = await Project.findOneAndUpdate(
            { projectId: req.params.projectId, userId: req.userId },
            projectData,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        console.log('Проект обновлен:', project.projectId);
        res.json(project);
    } catch (error) {
        console.error('Ошибка обновления проекта:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Эндпоинт загрузки проекта
app.get('/api/projects/:projectId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ projectId: req.params.projectId, userId: req.userId });
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json(project);
    } catch (error) {
        console.error('Ошибка загрузки проекта:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Эндпоинт получения всех проектов пользователя
app.get('/api/projects/user/:userId', authMiddleware, async (req, res) => {
    try {
        console.log('Получение проектов для userId:', req.userId); // Диагностика
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }
        const projects = await Project.find({ userId: req.userId });
        res.json(projects);
    } catch (error) {
        console.error('Ошибка получения проектов:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});