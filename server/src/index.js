const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Подключено к MongoDB'))
    .catch(err => console.error('Ошибка подключения:', err));

// Схема пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Схема проекта
const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    name: { type: String, required: true },
    grid: {
        points: [[Number]],
        isShapeClosed: Boolean
    },
    models: [{
        id: Number,
        category: String,
        type: String,
        position: [Number],
        rotation: [Number],
        normalizedScale: [Number],
        baseScale: [Number]
    }]
});
const Project = mongoose.model('Project', projectSchema);

// Middleware для проверки токена
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

// Регистрация
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Логин
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API для сохранения проекта
app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        const projectData = { ...req.body, userId: req.userId };
        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API для обновления проекта
app.put('/api/projects/:projectId', authMiddleware, async (req, res) => {
    try {
        const projectData = { ...req.body, userId: req.userId };
        const project = await Project.findOneAndUpdate(
            { projectId: req.params.projectId, userId: req.userId },
            projectData,
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API для загрузки проекта
app.get('/api/projects/:projectId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({ projectId: req.params.projectId, userId: req.userId });
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API для получения всех проектов пользователя
app.get('/api/projects/user/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }
        const projects = await Project.find({ userId: req.userId });
        res.json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});