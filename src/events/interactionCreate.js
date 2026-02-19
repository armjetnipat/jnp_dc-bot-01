const config = require('../config');
const { sendEmbed } = require('../utils/embed');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        if (!config.allowedUsers.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ No permission', ephemeral: true });
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction);

        await sendEmbed(client, {
            title: `Command Executed: ${interaction.commandName}`,
            description: `User: <@${interaction.user.id}>`
        }, config.channels.commandLog);
    }
};