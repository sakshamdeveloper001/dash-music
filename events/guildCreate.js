const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildCreate",
    async execute(client, guild) {
        try {
            let user;
            
            // Try fetching audit logs
            try {
                const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 28 }); // 28 = BOT_ADD
                const logEntry = auditLogs.entries.first();
                user = logEntry ? logEntry.executor : null;
            } catch (err) {
                console.warn(`⚠️ Could not fetch audit logs for ${guild.name}. Possible permission issue.`);
            }

            // Fallback: If no user found, use guild owner
            if (!user) {
                try {
                    user = await guild.fetchOwner();
                } catch (err) {
                    console.warn(`⚠️ Could not fetch owner for ${guild.name}.`);
                    return;
                }
            }

            if (!user) return;

            // Create embed message
            const embed = new EmbedBuilder()
                .setColor("#00FF00")
                .setTitle("🎵 FLEXZ Music Bot 🎵")
                .setDescription(
                    `Hey there, ${user.username}! 👋\n\n` +
                    `Thank you for inviting **FLEXZ Music Bot** to **${guild.name}**.\n\n` +
                    `🎶 I'm here to bring you the best music experience on Discord. Here’s what I can do for you:\n\n` +
                    `✨ Play your favorite songs\n📀 High-quality music streaming\n🎚️ Customizable audio filters\n📜 Easy-to-use commands\n\n` +
                    `🔹 **Get started**: Type \`/play [song name or URL]\`\n` +
                    `🔹 **Need help?** Type \`/help\` for a list of commands.\n` +
                    `🔹 **Join our support server**: [Click Here](https://discord.gg/c5r3vH3sqt)\n\n` +
                    `Enjoy the beats! 🎧🔥`
                )
                .setFooter({ text: `Flexz Music Bot!` })
                .setTimestamp();

            // Send DM to the user (bot inviter or guild owner)
            await user.send({ embeds: [embed] }).catch(() => {
                console.warn(`⚠️ Could not send a welcome DM to ${user.tag}.`);
            });

        } catch (error) {
            console.error("❌ Error sending welcome message:", error);
        }
    },
};
