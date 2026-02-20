const { log } = require('../utils/logger');
const startVpsChecker = require('../jobs/vpsChecker');
const startExpireChecker = require('../jobs/expireChecker');
const { redis, connectRedis } = require('../services/redis');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        log(`Logged in as ${client.user.tag}`, 'success');
        client.user.setPresence({
            status: 'online',
            activities: [{ name: 'JNP Discord Server', type: 0 }]
        });

        connectRedis();
        startVpsChecker(client);
        startExpireChecker(client);
    }
};