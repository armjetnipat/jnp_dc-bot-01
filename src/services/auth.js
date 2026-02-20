const api = require('./api');
const {redis} = require('../services/redis');
const { log } = require('../utils/logger');

async function login() {
    const { data } = await api.post('/api/login', {
        email: process.env.API_EMAIL,
        password: process.env.API_PASSWORD
    });

    const token = data.token;

    await redis.setEx('api_token', 3500, token);

    log('Logged in to API and stored token in Redis', 'success');

    return token;
}

async function getToken() {
    let token = await redis.get('api_token');

    if (!token) {
        log('Token was missing', 'warning');
        token = await login();
    }

    return token;
}

module.exports = {
    login,
    getToken
};