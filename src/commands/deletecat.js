module.exports = {
    data: {
        name: 'deletecat',
        description: 'Delete category',
        options: [
            {
                name: 'id',
                description: 'Category id',
                type: 3,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const id = interaction.options.getString('id');
        const category = await interaction.guild.channels.fetch(id);
        await category.delete();
        await interaction.reply({ content: 'Deleted', ephemeral: true });
    }
};