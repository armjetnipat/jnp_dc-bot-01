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
    },
    {
        name: 'deletecat',
        description: 'Delete category',
        options: [
            {
                name: 'id',
                description: 'Category id',
                type: ApplicationCommandOptionType.String, // STRING
                required: true
            }
        ]
    }
];

function normalizeCommands(commands) {
    return commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description,
        options: (cmd.options ?? []).map(opt => ({
            name: opt.name,
            description: opt.description,
            type: opt.type,
            required: opt.required ?? false,
            choices: opt.choices ?? []
        }))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

client.once("clientReady", async client => {
    console.clear();
    console.log(`Logged in as ${client.user.tag}!`);

    if (!process.env.GUILD_ID || !process.env.CLIENT_ID) {
        console.error('❌ Missing GUILD_ID or CLIENT_ID');
        return;
    }

    const remoteCommands = await rest.get(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
        )
    );

    const local = normalizeCommands(commands);
    const remote = normalizeCommands(remoteCommands);

    const isSame = JSON.stringify(local) === JSON.stringify(remote);

    if (!isSame) {
        await console.log('Commands changed → redeploying');
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );
        console.log('Commands redeployed successfully');
    } else {
        console.log('Commands unchanged → skip deploy');
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

        await interaction.editReply({
            content: `Created ${categoryName} successfully with ${newChannels.length} channels`,
            ephemeral: true
        });
    }

    if (interaction.commandName === 'deletecat') {
        let categoryId = interaction.options.getString('id');
        let category = await guild.channels.fetch(categoryId);

        await category.children.cache.map(c => c.delete());
        await category.delete();

        await interaction.reply({
            content: `Deleted ${category.name} successfully`,
            ephemeral: true
        });
    }

});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const rules = [
        {
            channelId: '1452926114279329888',
            toChannelId: '1452926112333299743',
            message: authorId =>
                `👋🏻 <@&1452896740330967071> We have new message from <@${authorId}>\n\nURL: ${message.url}`
        }
    ];

    const rule = rules.find(r => r.channelId === message.channel.id);
    if (!rule) return;

    const targetChannel = await client.channels.fetch(rule.toChannelId);
    if (!targetChannel) return;

    await targetChannel.send(
        typeof rule.message === 'function'
            ? rule.message(message.author.id)
            : rule.message
    );
});

client.login(process.env.TOKEN);