const { ChannelType } = require('discord.js');
const { log } = require('../utils/logger');

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
        const categoryName = interaction.options.getString('name');
        const guild = interaction.guild;

        let category = await guild.channels.create({
            name: `౨ৎ  ₊  ${categoryName}`,
            type: ChannelType.GuildCategory
        });

        await interaction.deferReply({ephemeral: true});

        const newChannels = [
            {name: '📅・ประชุมที่เรารัก', type: ChannelType.GuildText},
            {name: '💬・มั่วซั่ว', type: ChannelType.GuildText},
            {name: '📝・คุยงานโว้ย', type: ChannelType.GuildText},
            {name: '🧠・จดไอเดีย', type: ChannelType.GuildText},
            {name: '📦・กล่องเก็บของ', type: ChannelType.GuildText},
            {name: '📅・คุยงาน 1', type: ChannelType.GuildVoice},
            {name: '📅・คุยงาน 2', type: ChannelType.GuildVoice},
        ]

        for (let i = 0; i < newChannels.length; i++) {
            try {
                let channel = await guild.channels.create({
                    name: newChannels[i].name,
                    type: newChannels[i].type,
                    parent: category.id
                });

                log(`Created ${channel.name} successfully`, 'success');
            } catch (error) {
                log(error, 'error');
            }
        }

        await interaction.editReply({
            content: `Created ${categoryName} successfully with ${newChannels.length} channels`,
            ephemeral: true
        });
    }
};