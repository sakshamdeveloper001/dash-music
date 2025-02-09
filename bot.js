const { Client, GatewayIntentBits, Collection, GatewayDispatchEvents } = require("discord.js");
const config = require("./config.js");
const fs = require("fs");
const path = require("path");
const { initializePlayer } = require("./player");
const { connectToDatabase } = require("./mongodb");
const colors = require("./UI/colors/colors");
require("dotenv").config();

const client = new Client({
    intents: Object.values(GatewayIntentBits),
});


const lang = require("./languages/en.js"); // Ensure this is the correct path
client.lang = lang;

client.config = config;
client.commands = new Collection(); // Store commands properly
initializePlayer(client);

// ✅ Event Handler (Fixes `.bind` issue)
fs.readdirSync("./events").forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    
    if (typeof event === "function") {
        client.on(eventName, (...args) => event(client, ...args)); // If event is a function
    } else if (typeof event.execute === "function") {
        client.on(eventName, (...args) => event.execute(client, ...args)); // If event has an `execute` method
    } else {
        console.warn(`⚠️ Skipping event ${file}: Invalid event format.`);
    }
});

// ✅ Command Handler (Fixed loading commands)
fs.readdirSync(config.commandsDir).forEach((file) => {
    if (file.endsWith(".js")) {
        try {
            let command = require(`${config.commandsDir}/${file}`);
            client.commands.set(command.name, command); // Store commands in Collection
        } catch (err) {
            console.error(`❌ Error loading command ${file}:`, err);
        }
    }
});

// ✅ Bot Ready Event
client.once("ready", () => {
    console.log(`${colors.cyan}[ SYSTEM ]${colors.reset} ${colors.green}Client logged in as ${colors.yellow}${client.user.tag}${colors.reset}`);
    console.log(`${colors.cyan}[ MUSIC ]${colors.reset} ${colors.green}Riffy Music System Ready 🎵${colors.reset}`);
    console.log(`${colors.cyan}[ TIME ]${colors.reset} ${colors.gray}${new Date().toISOString().replace("T", " ").split(".")[0]}${colors.reset}`);

    if (client.riffy) {
        client.riffy.init(client.user.id); // ✅ Fixed potential crash
    }
});

// ✅ Voice State Updates (Prevent crash if `riffy` is undefined)
client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(d.t)) return;
    if (client.riffy && client.riffy.updateVoiceState) {
        client.riffy.updateVoiceState(d);
    }
});

// ✅ Bot Login
client.login(config.TOKEN || process.env.TOKEN).catch((e) => {
    console.log("\n" + "─".repeat(40));
    console.log(`${colors.magenta}${colors.bright}🔐 TOKEN VERIFICATION${colors.reset}`);
    console.log("─".repeat(40));
    console.log(`${colors.cyan}[ TOKEN ]${colors.reset} ${colors.red}Authentication Failed ❌${colors.reset}`);
    console.log(`${colors.gray}Error: Turn On Intents or Reset New Token${colors.reset}`);
});

// ✅ Database Connection
connectToDatabase().then(() => {
    console.log("\n" + "─".repeat(40));
    console.log(`${colors.magenta}${colors.bright}🕸️  DATABASE STATUS${colors.reset}`);
    console.log("─".repeat(40));
    console.log(`${colors.cyan}[ DATABASE ]${colors.reset} ${colors.green}MongoDB Online ✅${colors.reset}`);
}).catch((err) => {
    console.log("\n" + "─".repeat(40));
    console.log(`${colors.magenta}${colors.bright}🕸️  DATABASE STATUS${colors.reset}`);
    console.log("─".repeat(40));
    console.log(`${colors.cyan}[ DATABASE ]${colors.reset} ${colors.red}Connection Failed ❌${colors.reset}`);
    console.log(`${colors.gray}Error: ${err.message}${colors.reset}`);
});

// ✅ Web Server (Keeps bot alive)
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log("\n" + "─".repeat(40));
    console.log(`${colors.magenta}${colors.bright}🌐 SERVER STATUS${colors.reset}`);
    console.log("─".repeat(40));
    console.log(`${colors.cyan}[ SERVER ]${colors.reset} ${colors.green}Online ✅${colors.reset}`);
    console.log(`${colors.cyan}[ PORT ]${colors.reset} ${colors.yellow}http://localhost:${port}${colors.reset}`);
    console.log(`${colors.cyan}[ TIME ]${colors.reset} ${colors.gray}${new Date().toISOString().replace("T", " ").split(".")[0]}${colors.reset}`);
    console.log(`${colors.cyan}[ USER ]${colors.reset} ${colors.yellow}GlaceYT${colors.reset}`);
});
