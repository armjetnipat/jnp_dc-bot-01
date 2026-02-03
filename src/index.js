require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const PROVIDER_STATE_FILE = 'providerState.json';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const allowedPermissionsUser = [
    '1091318537529851944',
    '1391727009264042037',
    '880379501534642187'
]

const commands = [
    {
        name: 'enableAPI',
        description: 'Enable API',
        options: [
            {
                name: 'status',
                description: 'API status',
                type: ApplicationCommandOptionType.Boolean, // BOOLEAN
                required: true
            }
        ]
    },
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
    },
    {
        name: 'createrole',
        description: 'Create new role',
        options: [
            {
                name: 'name',
                description: 'Role name',
                type: ApplicationCommandOptionType.String, // STRING
                required: true
            }
        ]
    },
    {
        name: 'deleterole',
        description: 'Delete role',
        options: [
            {
                name: 'id',
                description: 'Role id',
                type: ApplicationCommandOptionType.String, // STRING
                required: true
            }
        ]
    }
];

async function sendEmbed(embeded, channelId) {
    const channel = await client.channels.fetch(channelId);
    try {
        channel.send({ embeds: [embeded] });
    } catch (error) {
        console.error('Error sending embed:', error);
        return;
    }
}

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

function loadState() {
    if (!fs.existsSync(PROVIDER_STATE_FILE)) {
        fs.writeFileSync(PROVIDER_STATE_FILE, JSON.stringify({ lastAnnounceId: 0 }, null, 2));
    }
    return JSON.parse(fs.readFileSync(PROVIDER_STATE_FILE));
}

function saveState(state) {
    fs.writeFileSync(PROVIDER_STATE_FILE, JSON.stringify(state, null, 2));
}

let state = loadState();
let enableAPI = false;

async function getProviderAnnounce() {
    const apiUrl = `${process.env.PROVIDER_API_URL}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching provider announcements:', error);
        return [];
    }
}

async function checkAnnouncement() {
    if (!enableAPI) return;

    const announces = await getProviderAnnounce();

    const newAnnounces = announces
        .filter(a => a.id > state.lastAnnounceId)
        .sort((a, b) => a.id - b.id);

    console.log(state);

    if (newAnnounces.length === 0) return;

    for (const a of newAnnounces) {
        await sendEmbed(embeded = {
            title: `📢 ${a.title}`,
            description: a.content,
            image: { url: a.image_url },
            timestamp: new Date(a.created_at),
            color: 0x0099ff
        }, channelId = '1468140554222174219');

        state.lastAnnounceId = a.id;
        saveState(state);
    }

    console.log(`Sent ${newAnnounces.length} new announcement(s)`);
}

client.once("clientReady", async client => {
    console.clear();
    console.log(`Logged in as ${client.user.tag}!`);

    await checkAnnouncement();
    setInterval(checkAnnouncement, 3 * 60 * 1000);

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

    if (interaction.user && !allowedPermissionsUser.includes(interaction.user.id)) {
        await interaction.reply({
            content: `❌ You don't have permission to use this command.`,
            ephemeral: true
        });
        return;
    }
    
    const guild = interaction.guild;

    if (interaction.commandName === 'enableapi') {
        let status = interaction.options.getBoolean('status');
        enableAPI = status;

        await interaction.reply({
            content: `API is now ${enableAPI ? 'enabled' : 'disabled'}.`,
            ephemeral: true
        });
    }

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

    if (interaction.commandName === 'createrole') {
        let roleName = interaction.options.getString('name');
        let role = await guild.roles.create({
            name: roleName,
            mentionable: true,
            permissions: []
        });

        await interaction.reply({
            content: `Created ${role.name} successfully`,
            ephemeral: true
        });
    }

    if (interaction.commandName === 'delRole') {
        let roleId = interaction.options.getString('id');
        let role = await guild.roles.fetch(roleId);
        await role.delete();

        await interaction.reply({
            content: `Deleted ${role.name} successfully`,
            ephemeral: true
        });
    }

    sendEmbed(embeded = {
        title: `Command Executed: ${interaction.commandName}`,
        description: `User: <@${interaction.user.id}> (${interaction.user.id})`
    }, channelId = '1401616214392049684');

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