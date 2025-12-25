require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, REST, Routes, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [
    {
        name: 'createcat',
        description: 'Create new category',
        options: [
            {
                name: 'name',
                description: 'Category name',
                type: 3, // STRING
                required: true
            }
        ]
    }
];

client.on("clientReady", async readyClient => {
    console.clear()
    console.log(`Logged in as ${readyClient.user.tag}!`);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(readyClient.user.id, process.env.GUILD_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const guild = interaction.guild;

    if (interaction.commandName === 'createcat') {
        let categoryName = interaction.options.getString('name');
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

                console.log(`Created ${channel.name} successfully`);
            } catch (error) {
                console.log(error);
            }
        }

        await interaction.reply({
            content: `Created ${categoryName} successfully with ${newChannels.length} channels`,
            ephemeral: true
        });
    }

});

client.login(process.env.TOKEN);