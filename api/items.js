// api/items.js

const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    const { MONGO_URI } = process.env; // Используем строку подключения из переменных окружения

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

// Определение модели элемента
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

// Обработка API-запросов
export default async function handler(req, res) {
    await connectToDatabase(); // Подключаемся к базе данных

    if (req.method === 'GET') {
        // Получить все элементы
        try {
            const items = await Item.find();
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    } else if (req.method === 'POST') {
        // Добавить новый элемент
        const { name, value } = req.body;

        if (!name || !value) {
            return res.status(400).json({ message: 'Name and value are required' });
        }

        const newItem = new Item({ name, value });

        try {
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ message: 'Error saving item' });
        }
    } else {
        // Метод не разрешен
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
