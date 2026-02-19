const config = require('../config');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.channel.id !== config.channels.notifyFrom) return;

        const target = await client.channels.fetch(config.channels.notifyTo);
        if (!target) return;

        await target.send(
            `👋🏻 <@&${config.roleNotify}> New message from <@${message.author.id}>\n\nURL: ${message.url}`
        );
    }
};