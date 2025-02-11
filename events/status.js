const { EmbedBuilder } = require('discord.js');

// Replace with the actual channel ID where the status should be posted
const STATUS_CHANNEL_ID = "1337437184491393068";
let statusMessageId = null;

module.exports = async (client) => {

    // Ensure bot is fully ready before starting status updates
    client.once("ready", async () => {
        await updateBotStatus(client);
        setInterval(() => updateBotStatus(client), 120000); // Update every 2 minutes
    });
};

async function updateBotStatus(client) {
    try {
        const statusChannel = await client.channels.fetch(STATUS_CHANNEL_ID);
        
        if (!statusChannel) {
        }

        const botPing = client.ws.ping; // Get bot latency
        let status = "🟢 Online (Normal)";
        let color = 0x00FF00; // Green

        if (botPing >= 200) {
            status = "🟡 Lagging (High Ping)";
            color = 0xFFFF00; // Yellow
        }


        const embed = new EmbedBuilder()
            .setTitle("🤖 Bot Status")
            .setDescription(`**Status:** ${status}\n📡 **Ping:** ${botPing}ms`)
            .setColor(color)
            .setFooter({ text: `Last updated: ${new Date().toLocaleTimeString()}` });

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
