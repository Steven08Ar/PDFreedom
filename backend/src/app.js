const express = require('express');
const cors = require('cors');
const path = require('path');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('PDFreedom Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
