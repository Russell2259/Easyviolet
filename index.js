import Easyviolet from './lib/index.js';
import http from 'node:http';

const server = http.createServer();

new Easyviolet({
    server: server
});

server.listen(8080, () => {
    console.log(`Your easyviolet demo is running on port ${server.address().port}`);
});