const Database = require("./data/database");
const db = new Database();

db.connect();

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { Client, Intents } = require("discord.js");
const fs = require("node:fs");

const myIntents = new Intents(32767);
const client = new Client({ intents: myIntents, partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const eventFiles = fs.readdirSync(`./src/events`).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

require("./events/Miscellaneous/antiCrash");

client.login(process.env.TOKEN);