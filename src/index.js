require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, REST, Routes, ApplicationCommandOptionType } = require('discord.js');

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
                type: ApplicationCommandOptionType.String, // STRING
                required: true
            }
        ]
    }
];

client.once("ready", async client => {
    console.clear();
    console.log(`Logged in as ${client.user.tag}!`);

    if (!process.env.GUILD_ID || !process.env.CLIENT_ID) {
        console.error('❌ Missing GUILD_ID or CLIENT_ID');
        return;
    }

    try {
        console.log('Clearing guild commands...');
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: [] }
        );

        console.log('Loading new guild commands...');
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('Guild commands reloaded successfully ✅');
    } catch (err) {
        console.error('❌ Command deploy failed', err);
    }

    client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: 'JNP Discord Server',
                type: 0
            }
        ]
    });
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