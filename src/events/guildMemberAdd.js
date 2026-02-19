const config = require('../config');
const { sendEmbed } = require('../utils/embed');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        await sendEmbed(client, {
            color: 0x00ff88,
            title: `ยินดีต้อนรับ ${member.user.username} 👋`,
            description: `สมาชิกทั้งหมด: ${member.guild.memberCount}`,
            timestamp: new Date()
        }, config.channels.welcome);
    }
};