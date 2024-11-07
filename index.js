const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { connectTimeoutMS: 10000 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Определение схемы и модели для элемента
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
});

// Добавление индекса для быстрого поиска по полю name
itemSchema.index({ name: 1 });

const Item = mongoose.model('Item', itemSchema);

// CRUD операции

// Получить все элементы
app.get('/api/items', async (req, res) => {
    try {
        console.log('Fetching items from DB...');
        const items = await Item.find();
        console.log('Fetched items:', items);
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Добавить новый элемент
app.post('/api/items', async (req, res) => {
    const { name, value } = req.body;

    // Валидация данных
    if (!name || !value) {
        return res.status(400).json({ message: 'Name and value are required' });
    }

    const newItem = new Item({ name, value });

    try {
        console.log('Saving new item:', newItem);
        await newItem.save();
        console.log('New item saved:', newItem);
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
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Экспортируем для Vercel
module.exports = app;
