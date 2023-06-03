/* Compiles scripts for ultraviolet. https://github.com/Russell2259/Easyviolet */

class _Easyviolet {
    constructor() {
        this.scriptsLoaded = false;

        fetch('{uvPath}ev.config.json')
            .then(res => res.json())
            .then(config => {
                this.config = config;

                const bundleScript = document.createElement('script');
                bundleScript.src = this.config.uvPrefix + this.config.uv.bundle;
                document.body.appendChild(bundleScript);

                bundleScript.onload = () => {
                    const configScript = document.createElement('script');
                    configScript.src = this.config.uvPrefix + this.config.uv.config;
                    document.body.appendChild(configScript);

                    configScript.onload = () => {
                        this.scriptsLoaded = true;

                        navigator.serviceWorker.getRegistrations().then(async registrations => {
                            var swExists = false;

                            registrations.forEach(sw => {
                                if (sw.active.scriptURL.includes(this.config.uvPrefix + 'sw.js')) {
                                    swExists = true;
                                }
                            });

                            if (!swExists) {
                                this.registerSW().then(res => console.log('The ultraviolet serviceworker has been registered'));
                            }
                        });
                    }
                };
            }).catch(e => {
                console.error('Could not fetch configuration because of ', e);
            });
    };

    registerSW = () => {
        return new Promise((resolve, reject) => {
            if (this.scriptsLoaded) {
                if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
                    reject('Service workers cannot be registered without https.');
                }

                if (!navigator.serviceWorker) {
                    reject(`Your browser doesn't support service workers.`);
                }

                navigator.serviceWorker.register(this.config.uvPrefix + 'sw.js', {
                    scope: this.config.prefix
                }).then(e => resolve()).catch(e => reject(e));
            } else {
                reject('The scripts have not loaded');
            }
        });
    };

    setConfig = (config) => {
        return new Promise((resolve, reject) => {
            if (typeof config == 'object') {
                config = JSON.stringify(config);
            }

            fetch(this.config.uvPrefix + 'ev.config', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'setConfig',
                    config: config
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        resolve();
                    } else {
                        if (res.msg) {
                            reject(res.msg);
                        } else {
                            reject();
                        }
                    }
                }).catch(e => reject(e))
        });
    };

    /*setConfigProperty = (property, value) => {
        May add this later
    };*/

    getProxiedUrl = (url) => {
        return __uv$config.prefix + __uv$config.encodeUrl(url.toString());
    };
}

const Easyviolet = new _Easyviolet();