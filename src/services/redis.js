const { createClient } = require('redis');
const { log } = require('../utils/logger');

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD
});

redis.on('error', (err) => {
    log(`Redis Client Error: ${err}`, 'error');
});

const connectRedis = async () => {
    try {
        await redis.connect();
        log(`Connected to Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, 'success');
    } catch (err) {
        log(`Failed to connect to Redis: ${err}`, 'error');
    }
};

module.exports = {redis, connectRedis};