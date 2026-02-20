const axios = require('axios');

const api = axios.create({
    baseURL: process.env.PROVIDER_API_URL,
    timeout: 10000
});

module.exports = api;