require('dotenv').config();
const express = require('express');
const rotas = require('./src/rotas');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

let port = process.env.PORT || 3000;
app.listen(port);