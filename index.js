const express = require('express');
const app = express();
const cors = require('cors'); // Import cors package
const PORT = 3000;

// Use middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// In-memory storage to simulate a database with multiple collections
let dataStore = {};

// Generate a unique ID for each entry
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Middleware to ensure the resource exists in the data store
app.use('/api/:resource', (req, res, next) => {
    const { resource } = req.params;
    // If the resource collection does not exist, initialize it as an empty array
    if (!dataStore[resource]) {
        dataStore[resource] = [];
    }
    next();
});

// Get all items in the specified resource collection
app.get('/api/:resource', (req, res) => {
    const { resource } = req.params;
    res.json(dataStore[resource]);
});

// Get a single item by ID from the specified resource collection
app.get('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const item = dataStore[resource].find(entry => entry.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Add a new item to the specified resource collection
app.post('/api/:resource', (req, res) => {
    const { resource } = req.params;
    const newItem = { id: generateId(), ...req.body };
    console.log(req.body);
    dataStore[resource].push(newItem);
    res.status(201).json(newItem);
});

// Update an existing item in the specified resource collection
app.put('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const itemIndex = dataStore[resource].findIndex(entry => entry.id === id);
    if (itemIndex !== -1) {
        dataStore[resource][itemIndex] = { id, ...req.body };
        res.json(dataStore[resource][itemIndex]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete an item from the specified resource collection
app.delete('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const itemIndex = dataStore[resource].findIndex(entry => entry.id === id);
    if (itemIndex !== -1) {
        const deletedItem = dataStore[resource].splice(itemIndex, 1);
        res.json(deletedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
