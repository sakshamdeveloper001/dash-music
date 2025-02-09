const { InteractionType } = require("discord.js");

module.exports = async (client, interaction) => {
    try {
        if (!interaction?.guild) {
            return interaction?.reply({
                content: "This command can only be used in a server.",
                ephemeral: true
            });
        }

        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Command "${interaction.commandName}" not found.`);
            return interaction.reply({
                content: "Unknown command!",
                ephemeral: true
            });
        }

        if (typeof command.run !== "function") {
            console.error(`❌ Command "${interaction.commandName}" does not have a run function.`);
            return interaction.reply({
                content: "This command is not set up correctly!",
                ephemeral: true
            });
        }

        // Check if the command requires deferred reply
        let deferred = false;
        if (command.deferReply) {
            await interaction.deferReply();
            deferred = true;
        }

        // Execute the command with language settings
        await command.run(client, interaction, client.lang || {});

    } catch (error) {
        console.error("❌ Error in interactionCreate.js:", error);

        // Prevent duplicate reply issue
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
                content: `❌ Error: ${error.message}`
            });
        } else {
            await interaction.reply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
