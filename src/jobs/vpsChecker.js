const { EmbedBuilder } = require('discord.js');
const { log } = require('../utils/logger');
const { getMyVps } = require('../services/vps');
const { redis } = require('../services/redis');
const config = require('../config');

function formatThaiDate(dateString) {
    return new Date(dateString).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusColor(status) {
    if (status === 'active') return 0x00c853;
    if (status === 'suspended') return 0xffab00;
    return 0xd50000;
}

module.exports = function startVpsChecker(client) {

    async function run() {
        const vpsList = await getMyVps();

        for (const vps of vpsList) {

            log(`VPS ${vps.nickname || vps.label} is currently ${vps.status}`);

            const redisKey = `vps_${vps.vmid}`;
            const isStored = await redis.get(redisKey);

            log(`Checking Redis key ${redisKey}: ${isStored}`);

            if (isStored) continue;

            const embed = new EmbedBuilder()
                .setColor(getStatusColor(vps.status))
                .setTitle(`🖥️ ${vps.nickname || vps.label}`)
                .setDescription(`สถานะ: **${vps.status.toUpperCase()}**`)
                .addFields(
                    { name: '🧩 OS', value: vps.os, inline: true },
                    { name: '⚙️ CPU', value: `${vps.cpu} Core`, inline: true },
                    { name: '🧠 RAM', value: `${vps.ram} GB`, inline: true },
                    { name: '💾 Storage', value: `${vps.storage} GB`, inline: true },
                    { name: '🌐 IP', value: vps.ip, inline: true },
                )
                .setFooter({ text: `VMID: ${vps.vmid}` })
                .setTimestamp();

            await redis.set(redisKey, '1');
            await redis.persist(redisKey);
            log(`Set Redis key ${redisKey} to track VPS status`);

            const channel = await client.channels.fetch(config.vpsCurrentChannelId);
            if (channel) {
                await channel.send({ embeds: [embed] });
            }
        }
    }

    run();
    setInterval(run, 1000 * 60 * 5);
};
