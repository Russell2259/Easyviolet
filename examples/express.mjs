import Easyviolet from '../index.js';
import express from 'express';

const app = express();

const server = app.listen(8080, () => {
  console.log(`Your easyviolet demo is running on port ${server.address().port}`);
});

new Easyviolet().httpServer(server);