const { EmbedBuilder } = require('discord.js');
const { getMyVps } = require('../services/vps');
const { redis } = require('../services/redis');
const config = require('../config');
const { log } = require('../utils/logger');

const CHANNEL_ID = config.vpsNotifyChannelId;

const DAY = 24 * 60 * 60 * 1000;

const ALERT_LEVELS = [
    // { days: 35, color: 0xff0000 },
    // { days: 15, color: 0xffcc00 },
    { days: 7, color: 0xffcc00 },
    { days: 3, color: 0xff9900 },
    { days: 1, color: 0xff0000 }
];

module.exports = function startExpireChecker(client) {

    async function run() {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const vpsList = await getMyVps();
        const now = Date.now();

        for (const vps of vpsList) {

            if (!vps.expired_at) continue;

            const expiredTime = new Date(vps.expired_at).getTime();
            const diff = expiredTime - now;

            if (diff <= 0) continue;

            const daysLeft = Math.ceil(diff / DAY);

            for (const level of ALERT_LEVELS) {

                if (daysLeft <= level.days) {

                    const redisKey = `expire_warned_${level.days}d_${vps.id}`;
                    const warned = await redis.get(redisKey);

                    if (warned) continue;

                    const embed = new EmbedBuilder()
                        .setColor(level.color)
                        .setTitle('⚠️ VPS ใกล้หมดอายุ')
                        .addFields(
                            { name: 'ชื่อ', value: vps.nickname || vps.label, inline: true },
                            { name: 'OS', value: vps.os, inline: true },
                            { name: 'CPU / RAM', value: `${vps.cpu} Core / ${vps.ram} GB`, inline: true },
                            { name: 'Storage', value: `${vps.storage} GB`, inline: true },
                            { name: 'ราคา', value: `${vps.price} บาท`, inline: true },
                            { name: 'เหลือ', value: `${daysLeft} วัน`, inline: true },
                            { name: 'วันหมดอายุ', value: new Date(vps.expired_at).toLocaleString('th-TH'), inline: true }
                        )
                        .setFooter({ text: `VPS ID: ${vps.id}` })
                        .setTimestamp();

                    await channel.send({ embeds: [embed], content: `<@&${config.vpsNotifyRoleId}>` });

                    await redis.setEx(redisKey, Math.floor(diff / 1000), '1');
                }
            }
        }
    }

    run();
    setInterval(run, 1000 * 60 * 60);
};