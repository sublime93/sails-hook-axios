module.exports = sails => {
  const axios = require('axios');

  let conf;

  return {
    defaults: {
      __configKey__: {
        customModelGlobal: 'axios',
        clsNamespace: 'axios',
        exposeToGlobal: true,
      }
    },
    configure () {
      conf = sails.config[this.configKey];

      sails.log.verbose('Exposing Axios globally');
      let prefix = conf.customModelGlobal || 'axios';
      global[prefix] = {};
      for (let endpoint of conf.endpoints) {
        let config = {
          baseURL: endpoint.baseUrl,
          timeout: endpoint.timeout || 10000,
          headers: endpoint.headers || {}
        };

        if (endpoint.authentication && endpoint.authentication.type === 'bearer') {
          config.headers.Authorization = `Bearer ${endpoint.authentication.token}`;
        }

        if (endpoint.authentication && endpoint.authentication.type === 'basic') {
          config.auth = {
            username: endpoint.authentication.username,
            password: endpoint.authentication.password
          }
        }

        global[prefix][endpoint.name] = axios.create(config);
      }
    },
    initialize (next) {
      next();
    }
  };
};
