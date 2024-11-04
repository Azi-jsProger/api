const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Определение схемы и модели
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// CRUD операции

// Получить все элементы
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Добавить новый элемент
app.post('/api/items', async (req, res) => {
    const { name, value } = req.body;

    const newItem = new Item({ name, value });
    
    try {
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: 'Error saving item' });
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
        res.status(500).json({ message: 'Server error' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
