const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Client } = require("discord.js");

const config = require("../../data/config.json");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Get the AI latency!"),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async execute(client, interaction) {
		const embed = new MessageEmbed()
			.setColor("YELLOW")
			.setTitle("Pong!")
			.setDescription(`AI Latency: ${client.ws.ping}ms`)
			.setTimestamp()

		interaction.reply({ embeds: [embed] });
	},
};