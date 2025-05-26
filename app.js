
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 8000;


// Middleware
app.use(bodyParser.json());
app.use('/', schoolRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));