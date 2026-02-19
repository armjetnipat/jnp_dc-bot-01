async function sendEmbed(client, embed, channelId) {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;
    await channel.send({ embeds: [embed] });
}

module.exports = { sendEmbed };