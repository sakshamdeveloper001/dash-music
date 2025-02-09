const { InteractionType } = require("discord.js");

module.exports = async (client, interaction) => {
    try {
        if (!interaction?.guild) {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "This command can only be used in a server.",
                    ephemeral: true
                });
            }
            return;
        }

        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Command "${interaction.commandName}" not found.`);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "Unknown command!",
                    ephemeral: true
                });
            }
            return;
        }

        if (typeof command.run !== "function") {
            console.error(`❌ Command "${interaction.commandName}" does not have a run function.`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "This command is not set up correctly!",
                    ephemeral: true
                });
            }
            return;
        }

        // Check if the command requires deferred reply
        if (command.deferReply && !interaction.deferred && !interaction.replied) {
            await interaction.deferReply();
        }

        // Execute the command
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
