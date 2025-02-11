const { EmbedBuilder } = require("discord.js");

const STATUS_CHANNEL_ID = "1337437184491393068";
let statusMessageId = null;

module.exports = async (client) => {
    client.once("ready", async () => {
        await updateBotStatus(client);
        setInterval(() => updateBotStatus(client), 120000); // Update every 2 minutes
    });
};

async function updateBotStatus(client) {
    try {
        const statusChannel = await client.channels.fetch(STATUS_CHANNEL_ID);
        if (!statusChannel) return;

        const botPing = client.ws.ping;
        let status = "🟢 Online";
        let color = 0x00ff00;

        if (botPing >= 200) {
            status = "🟡 High Ping";
            color = 0xffff00;
        }

        const now = Math.floor(Date.now() / 1000); // Convert to Unix timestamp

        const embed = new EmbedBuilder()
            .setTitle("🤖 Bot Status")
            .setDescription(`**Status:** ${status}\n📡 **Ping:** ${botPing}ms\n\n🕒 **Last Updated:** <t:${now}:R>`)
            .setColor(color);

        if (statusMessageId) {
            const msg = await statusChannel.messages.fetch(statusMessageId).catch(() => null);
            if (msg) {
                await msg.edit({ embeds: [embed] });
            } else {
                const newMsg = await statusChannel.send({ embeds: [embed] });
                statusMessageId = newMsg.id;
            }
        } else {
            const newMsg = await statusChannel.send({ embeds: [embed] });
            statusMessageId = newMsg.id;
        }
    } catch (error) {
        console.error("[ERROR] Failed to update bot status:", error);
    }
}
