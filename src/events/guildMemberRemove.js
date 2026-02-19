const config = require('../config');
const { sendEmbed } = require('../utils/embed');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        await sendEmbed(client, {
            color: 0xff5555,
            title: `ลาก่อน ${member.user.username}`,
            description: `สมาชิกคงเหลือ: ${member.guild.memberCount}`,
            timestamp: new Date()
        }, config.channels.welcome);
    }
};