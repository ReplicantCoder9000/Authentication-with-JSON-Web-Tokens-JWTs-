const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/', routes);

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
