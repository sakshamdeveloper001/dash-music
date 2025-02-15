const { EmbedBuilder } = require('discord.js');
const config = require("../config.js");

const WHITELISTED_USERS = ["1270612450982756397", "1177989392430809225"]; // Replace with actual Discord User IDs

module.exports = {
    name: "serverlist",
    description: "Shows the servers the bot is in (Whitelisted Users Only)",
    permissions: "0x0000000000000800",
    options: [],
    run: async (client, interaction, lang) => {
        try {
            // Check if the user is whitelisted
            if (!WHITELISTED_USERS.includes(interaction.user.id)) {
                return interaction.reply({ content: "❌ You are not authorized to use this command!", ephemeral: true });
            }

            const serverList = client.guilds.cache.map(guild => {
                return `**📌 Server:** ${guild.name}\n👑 **Owner:** <@${guild.ownerId}>\n👥 **Members:** ${guild.memberCount}\n🔗 **Server ID:** \`${guild.id}\``;
            }).join("\n\n");

            const embed = new EmbedBuilder()
                .setTitle("📜 Bot Server List")
                .setDescription(serverList || "Bot is not in any servers.")
                .setColor("Blue")
                .setFooter({ text: `Total Servers: ${client.guilds.cache.size}` });

            return interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (e) {
            console.error(e);
            return interaction.reply({
                content: "❌ An error occurred while executing the command.",
                ephemeral: true,
            });
        }
    },
};
