const { ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: 'createcat',
        description: 'Create new category',
        options: [
            {
                name: 'name',
                description: 'Category name',
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const guild = interaction.guild;

        const category = await guild.channels.create({
            name: `౨ৎ  ₊  ${name}`,
            type: ChannelType.GuildCategory
        });

        await interaction.reply({
            content: `Created ${category.name}`,
            ephemeral: true
        });
    }
};