import Easyviolet from 'easyviolet';
import express from 'express';

const app = express();

const ultraviolet = new Easyviolet();

app.use(ultraviolet.express(app));

const server = app.listen(8080, () => {
  console.log(`Your easyviolet demo is running on port ${server.address().port}`);
});