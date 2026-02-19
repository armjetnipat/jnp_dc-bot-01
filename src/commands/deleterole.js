module.exports = {
    data: {
        name: 'deleterole',
        description: 'Delete role',
        options: [
            {
                name: 'id',
                description: 'Role id',
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const id = interaction.options.getString('id');
        const role = await interaction.guild.roles.fetch(id);
        await role.delete();
        await interaction.reply({ content: 'Deleted', ephemeral: true });
    }
};