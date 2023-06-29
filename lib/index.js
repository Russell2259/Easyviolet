import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class Easyviolet {
    /**
     * The configuration needed to run easyviolet
     * @param {object} config
     * @param {string} config.uvPrefix
     * @param {string} config.prefix
     * @param {string} config.bare
     * @param {string} config.codec
     * @param {object} config.server
     * @param {object} config.uv
     * @param {string} config.uv.handler
     * @param {string} config.uv.bundle
     * @param {string} config.uv.config
     * @param {string} config.uv.sw
     */
    constructor(config) {
        this.defaultConfig = {
            uvPrefix: '/uv/',
            prefix: 'service/',
            bare: '/bare/',
            codec: 'xor',
            uv: {
                handler: 'uv.handler.js',
                client: 'uv.client.js',
                bundle: 'uv.bundle.js',
                config: 'uv.config.js',
                sw: 'uv.sw.js'
            }
        };
        this.config = {
            ...this.defaultConfig,
            ...config
        };
        this.bare = createBareServer(this.config.bare, {
            maintainer: {
                email: 'russell2259@tuta.io'
            },
            project: {
                name: 'Easyviolet Instance',
                description: 'An easy way to use the ultraviolet proxy.',
                repository: 'https://github.com/Russell2259/Easyviolet',
                email: 'russell2259@tuta.io',
                website: 'https://github.com/Russell2259/Easyviolet',
                version: '1.0.1'
            },
            versions: []
        });
        this.uvFiles = {};
        this.uvRoutes = [];

        fs.readdirSync(uvPath).forEach(filename => {
            if (filename !== 'uv.config.js') {
                this.uvFiles[filename] = fs.readFileSync(path.join(uvPath, filename));
                this.uvRoutes.push(filename);
            }
        });

        this.requiredRoutes = [
            'ev.config',
            'ev.bundle.js',
            'ev.config.json',
            'uv.config.js',
            ...this.uvRoutes
        ];

        if (this.config.server) {
            this.httpServer(this.config.server);
        }
    }

    requiresRoute = (req) => {
        if (this.bare.shouldRoute(req)) {
            return this.bare.shouldRoute(req);
        } else if (req.url.startsWith(this.config.uvPrefix)) {
            if (this.requiredRoutes.includes(req.url.replace(this.config.uvPrefix, ''))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    express = (app) => {
        return (req, res, next) => {
            if (app) {
                if (this.bare.shouldRoute(req)) {
                    this.bare.routeRequest(req, res);
                } else {
                    this.handleRequest(req, res, next);
                }

                http.createServer(app).on('upgrade', (req, socket, head) => {
                    if (this.bare.shouldRoute(req)) {
                        this.bare.routeUpgrade(req, socket, head);
                    } else {
                        socket.end();
                    }
                });
            } else {
                console.log('Could not attach easyviolet');
            }
        }
    }

    httpServer = (server) => {
        try {
            server.on('request', (req, res) => {
                if (this.bare.shouldRoute(req)) {
                    this.bare.routeRequest(req, res);
                } else {
                    this.handleRequest(req, res);
                }
            });

            server.on('upgrade', (req, socket, head) => {
                if (this.bare.shouldRoute(req)) {
                    this.bare.routeUpgrade(req, socket, head);
                } else {
                    socket.end();
                }
            });
        } catch (e) {
            console.error('Could not attach the easyviolet server');
        }
    }

    handleRequest = (req, res, next) => {
        if (this.requiresRoute(req)) {
            const reqPath = req.url.replace(this.config.uvPrefix, '');

            if (req.method == 'GET') {
                if (Object.keys(this.uvFiles).includes(reqPath)) {
                    if (reqPath.endsWith('.js')) {
                        res.writeHead(200, {
                            'content-type': 'text/javascript'
                        });
                    }

                    res.end(this.uvFiles[reqPath]);
                } else if (reqPath === 'uv.config.js') {
                    res.writeHead(200, {
                        'content-type': 'text/javascript'
                    });

                    res.end(`/*This script is auto generated by easyviolet. https://github.com/Russell2259/Easyviolet*/\n\nself.__uv$config = {\n    prefix: '${this.config.uvPrefix + this.config.prefix}',\n    bare: '${this.config.bare}',\n    encodeUrl: Ultraviolet.codec.${this.config.codec}.encode,\n    decodeUrl: Ultraviolet.codec.${this.config.codec}.decode,\n    handler: '${this.config.uvPrefix + this.config.uv.handler}',\n    client: '${this.config.uvPrefix + this.config.uv.client}',\n    bundle: '${this.config.uvPrefix + this.config.uv.bundle}',\n    config: '${this.config.uvPrefix + this.config.uv.config}',\n    sw: '${this.config.uvPrefix + this.config.uv.sw}'\n};`);
                } else if (reqPath === 'ev.config.json') {
                    res.writeHead(200, {
                        'content-type': 'application/json'
                    });

                    res.end(JSON.stringify(this.config));
                } else if (reqPath === 'ev.bundle.js') {
                    res.writeHead(200, {
                        'content-type': 'text/javascript'
                    });

                    res.end(fs.readFileSync(path.join(__dirname, 'staticBundle.js')).toString().replace('{uvPath}', this.config.uvPrefix));
                } else {
                    if (next) {
                        next();
                    }
                }
            }/* else if (req.method == 'POST') {
                if (reqPath === 'ev.config') {
                    if (req.body) {
                        try {
                            processBody(JSON.parse(req.body));
                        } catch (e) {
                            if (!res.headersSent) {
                                res.end(JSON.stringify({
                                    success: false,
                                    msg: 'Failed to parse'
                                }));
                            }
                        }
                    } else {
                        const chunks = [];

                        req.on('data', chunk => chunks.push(chunk)).on('end', () => {
                            try {
                                processBody(JSON.parse(Buffer.concat(chunks).toString()));
                            } catch (e) {
                                if (!res.headersSent) {
                                    res.end(JSON.stringify({
                                        success: false,
                                        msg: 'Failed to parse'
                                    }));
                                }
                            }
                        }).on('error', (e) => {
                            res.end(JSON.stringify({
                                success: false,
                                msg: 'Failed to parse'
                            }));
                        });
                    }

                    const processBody = (body) => {
                        if (body) {
                            if (body.action === 'setCodec') {
                                if (body.codec) {
                                    

                                    res.end(JSON.stringify({
                                        success: true
                                    }));
                                } else {
                                    res.end(JSON.stringify({
                                        success: false,
                                        msg: 'Invalid codec'
                                    }));
                                }
                            }
                        }
                    }
                }
            }*/ else {
                if (!res.headersSent) {
                    res.end('Method not allowed');
                }
            }
        } else {
            if (next) {
                next();
            }
        }
    }
}

export default Easyviolet;