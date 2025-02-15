const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const WHITELISTED_USERS = ["1270612450982756397", "1177989392430809225"]; 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverlist")
        .setDescription("Shows the servers the bot is in (Whitelisted Users Only)"),

    async execute(interaction) {
        // Check if the user is whitelisted
        if (!WHITELISTED_USERS.includes(interaction.user.id)) {
            return interaction.reply({ content: "❌ You are not authorized to use this command!", ephemeral: true });
        }

        const client = interaction.client;
        let serverList = client.guilds.cache.map(guild => {
            return `**📌 Server:** ${guild.name}\n👑 **Owner:** <@${guild.ownerId}>\n👥 **Members:** ${guild.memberCount}\n🔗 **Server ID:** \`${guild.id}\``;
        }).join("\n\n");

        if (!serverList) serverList = "Bot is not in any servers.";

        const embed = new EmbedBuilder()
            .setTitle("📜 Bot Server List")
            .setDescription(serverList)
            .setColor("Blue")
            .setFooter({ text: `Total Servers: ${client.guilds.cache.size}` });

        return interaction.reply({ embeds: [embed], ephemeral: false });
    }
}
