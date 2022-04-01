const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

const config = require("../../data/config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Create a message sent by the bot!")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("text")
				.setDescription("Text response")
				.addStringOption((option) => option.setName("string").setDescription("Your message").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("embed")
				.setDescription("Embed response")
				.addBooleanOption((option) => option.setName("timestamp").setDescription("Timestamp of the embed").setRequired(true))
				.addStringOption((option) => option.setName("title").setDescription("Title of the embed").setRequired(true))
				.addStringOption((option) => option.setName("color").setDescription("Color of the embed").setRequired(false))
				.addStringOption((option) => option.setName("description").setDescription("Description of the embed").setRequired(false))
				.addStringOption((option) => option.setName("footer").setDescription("Footer of the embed").setRequired(false))
		),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(client, interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			if (interaction.options.getSubcommand() === "text") {
				interaction.channel.send(`${interaction.options.getString("string")}`);
			} else {
				const embed = new MessageEmbed().setTitle(`${interaction.options.getString("title")}`);

				if (interaction.options.getString("description") != null) {
					embed.setDescription(`${interaction.options.getString("description")}`);
				}

				if (interaction.options.getBoolean("timestamp") == true) {
					embed.setTimestamp();
				}

				if (interaction.options.getString("footer") != null) {
					embed.setFooter({ text: `${interaction.options.getString("footer")}` });
				}

				if (interaction.options.getString("color") != null) {
					embed.setColor(`${interaction.options.getString("color").toUpperCase()}`);
				}

				try {
					interaction.channel.send({ embeds: [embed] });
				} catch {
					interaction.channel.send({ content: "The embed color was invalid!" });
				}
			}
			interaction.reply({ content: `Message sent!`, ephemeral: true });
		} else {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Error:")
				.setDescription("You don't have permission to use this command! Permission required: `Administrator`")
				.setTimestamp()
				.setFooter({ text: `Phantom Bot v${config.version}` });

			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};