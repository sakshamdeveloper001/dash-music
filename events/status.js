const { EmbedBuilder } = require('discord.js');

// Replace with the actual status channel ID
const statusChannelId = "1337437184491393068";
let statusMessageId = null;

module.exports = async (client) => {
    setInterval(() => updateBotStatus(client), 120000); // Update every 2 minutes
};

async function updateBotStatus(client) {
    try {
        const statusChannel = await client.channels.fetch(statusChannelId);
        if (!statusChannel) return console.log("[ERROR] Status channel not found!");

        const botPing = client.ws.ping; // Get bot latency
        let status = "🟢 Online (Normal)";
        let color = 0x00FF00; // Green

        if (botPing >= 200) {
            status = "🟡 Lagging (High Ping)";
            color = 0xFFFF00; // Yellow
        }

        const embed = new EmbedBuilder()
            .setTitle("🤖 Bot Status")
            .setDescription(`Current Status: **${status}**\n📡 Ping: **${botPing}ms**`)
            .setColor(color)
            .setFooter({ text: `Last updated: ${new Date().toLocaleTimeString()}` });

        if (statusMessageId) {
            const msg = await statusChannel.messages.fetch(statusMessageId);
            await msg.edit({ embeds: [embed] });
        } else {
            const newMsg = await statusChannel.send({ embeds: [embed] });
            statusMessageId = newMsg.id;
        }
    } catch (error) {
        console.error("[ERROR] Failed to update bot status:", error);
    }
}
