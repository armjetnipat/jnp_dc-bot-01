module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({
            status: 'online',
            activities: [{ name: 'JNP Discord Server', type: 0 }]
        });
    }
};