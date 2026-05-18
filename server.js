require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const connectDB = require('./db/connection');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/contacts', contactsRouter);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Contacts API is running',
        documentation: '/api-docs',
        endpoints: {
            getAllContacts: 'GET /contacts',
            getSingleContact: 'GET /contacts/:id',
            createContact: 'POST /contacts',
            updateContact: 'PUT /contacts/:id',
            deleteContact: 'DELETE /contacts/:id',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
