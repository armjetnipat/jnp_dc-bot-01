module.exports = {
    data: {
        name: 'createrole',
        description: 'Create new role',
        options: [
            {
                name: 'name',
                description: 'Role name',
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const role = await interaction.guild.roles.create({
            name,
            mentionable: true
        });
        await interaction.reply({ content: `Created ${role.name}`, ephemeral: true });
    }
};