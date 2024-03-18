const express = require('express');
const connectDB = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
