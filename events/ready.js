const config = require("../config.js");
const { ActivityType } = require("discord.js");
const colors = require("../UI/colors/colors");

module.exports = async (client) => {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v10");
    const rest = new REST({ version: "10" }).setToken(config.TOKEN || process.env.TOKEN);

    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: Array.from(client.commands.values()), // ✅ FIXED: Convert Collection to Array
            });
            console.log("\n" + "─".repeat(40));
            console.log(`${colors.magenta}${colors.bright}⚡ COMMAND STATUS${colors.reset}`);
            console.log("─".repeat(40));
            console.log(`${colors.cyan}[ COMMANDS ]${colors.reset} ${colors.green}Loaded Successfully 🚀${colors.reset}`);
            console.log(`${colors.cyan}[ TIME ]${colors.reset} ${colors.gray}${new Date().toISOString().replace("T", " ").split(".")[0]}${colors.reset}`);
            console.log(`${colors.cyan}[ USER ]${colors.reset} ${colors.yellow}GlaceYT${colors.reset}`);
        } catch (err) {
            console.log("\n" + "─".repeat(40));
            console.log(`${colors.magenta}${colors.bright}⚡ COMMAND STATUS${colors.reset}`);
            console.log("─".repeat(40));
            console.log(`${colors.cyan}[ COMMANDS ]${colors.reset} ${colors.red}Failed To Load ❌${colors.reset}`);
            console.log(`${colors.cyan}[ ERROR ]${colors.reset} ${colors.red}${err.message}${colors.reset}`);
            console.log(`${colors.cyan}[ TIME ]${colors.reset} ${colors.gray}${new Date().toISOString().replace("T", " ").split(".")[0]}${colors.reset}`);
            console.log(`${colors.cyan}[ USER ]${colors.reset} ${colors.yellow}GlaceYT${colors.reset}`);
        }
    })();

    // ✅ Set bot status from config.js
    setTimeout(() => {
        setInterval(async () => {
            try {
                await client.user.setActivity(config.activityName, {
                    type: ActivityType[config.activityType.toUpperCase()] || ActivityType.LISTENING,
                });
            } catch (err) {
                console.error("❌ Failed to set activity:", err);
            }
        }, 10000);
    }, 5000); // ✅ Ensure bot is ready before setting activity

    client.errorLog = config.errorLog;
};
