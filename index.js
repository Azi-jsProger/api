// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Загрузить переменные окружения из .env

const app = express();
const PORT = process.env.PORT || 8000;  // Используем порт из переменной окружения или 8000 по умолчанию

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB через строку подключения из переменной окружения
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Завершаем процесс, если подключение не удалось
});

// Определение схемы и модели для элемента
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
});

// Индекс для быстрого поиска по имени
itemSchema.index({ name: 1 });

const Item = mongoose.model('Item', itemSchema);

// CRUD операции

// Получить все элементы
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Добавить новый элемент
app.post('/api/items', async (req, res) => {
    const { name, value } = req.body;
    if (!name || !value) {
        return res.status(400).json({ message: 'Name and value are required' });
    }

    const newItem = new Item({ name, value });
    try {
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error saving item:', err);
        res.status(500).json({ message: 'Error saving item' });
    }
});

// Удалить элемент
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
