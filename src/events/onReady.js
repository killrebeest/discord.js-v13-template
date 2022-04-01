const { Client, Collection } = require("discord.js");
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const path = require("path");
const config = require("../../data/config.json");

const ascii = require("ascii-table");
const table = new ascii().setHeading("Commands", "Load Status");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const token = process.env.TOKEN;
const clientId = process.env.CLIENTID;

module.exports = {
	name: "ready",
	once: true,

	/**
	 *
	 * @param {Client} client
	 */

	async execute(client) {
		console.log(`Successfully logged in as ${client.user.tag}`);

		client.user.setActivity(`${client.guilds.cache.size} Servers`, { type: "WATCHING" });

		categories = [
            "Config",
            "Entertainment",
            // "Giveaway",
            "Information",
            // "Levels",
            "Miscellaneous",
            // "Moderation"
        ];

		const commands = [];
		const commands_information = new Collection();

		for (var i = 0; i < fs.readdirSync("./src/commands").length; i++) {
			const commandFiles = fs.readdirSync(`./src/commands/${categories[i]}`).filter((file) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const command = require(`../../commands/${categories[i]}/${file}`);
				table.addRow(command.data.name, "✔️");
				commands.push(command.data.toJSON());
				commands_information.set(command.data.name, command);
			}
		}

		console.log(table.toString());

		const rest = new REST({ version: "9" }).setToken(token);

		(async () => {
			try {
				console.log("Started refreshing application (/) commands.");

				await rest.put(Routes.applicationCommands(clientId), { body: commands });

				console.log("Successfully reloaded application (/) commands.");
				console.log("-----------------------------------------------");
			} catch (error) {
				console.error(error);
			}
		})();

		client.on("interactionCreate", async (interaction) => {
			if (!interaction.isCommand()) return;

			const { commandName } = interaction;

			if (!commands_information.has(commandName)) return;

			try {
				await commands_information.get(commandName).execute(client, interaction, config);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
			}
		});

		client.on("guildCreate", async () => {
			client.user.setActivity(`${client.guilds.cache.size} Servers`, { type: "WATCHING" });
		});

		client.on("guildDelete", async () => {
			client.user.setActivity(`${client.guilds.cache.size} Servers`, { type: "WATCHING" });
		});
	},
};