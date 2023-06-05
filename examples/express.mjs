import Easyviolet from 'easyviolet';
import express from 'express';

const app = express();

app.use(new Easyviolet().express(app));

const server = app.listen(8080, () => {
  console.log(`Your easyviolet demo is running on port ${server.address().port}`);
});