const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const AntiLink = require("../../models/antilink");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("antilink")
		.setDescription("Prevent users from sending links!")
		.addStringOption((option) =>
			option.setName("toggle").setDescription("Turn antilink on or off").setRequired(true).addChoice("On", "Toggle antilink on").addChoice("Off", "Toggle antilink off")
		),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(client, interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			AntiLink.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
				let toggle = interaction.options.getString("toggle");

				if (toggle == "Toggle antilink on") {
					toggle = "on";
				} else {
					toggle = "off";
				}

				if (err) {
					const error = new MessageEmbed()
						.setColor("RED")
						.setTitle("Error:")
						.setDescription(`An error accured while trying to toggle antilink ${toggle}`)
						.setTimestamp()

					console.log(err);

					interaction.reply({ embeds: [error], ephemeral: true });

					return;
				}

				if (!settings) {
					settings = new AntiLink({
						guild_id: interaction.guild.id,
						toggled: toggle,
					});
				} else {
					settings.toggled = toggle;
				}

				settings.save((err) => {
					if (err) {
						const error = new MessageEmbed()
							.setColor("RED")
							.setTitle("Error:")
							.setDescription(`An error accured while trying to toggle antilink ${toggle}`)
							.setTimestamp()

						console.log(err);

						interaction.reply({ embeds: [error], ephemeral: true });

						return;
					}

					const embed = new MessageEmbed()
						.setColor("GREEN")
						.setTitle("Antilink toggled:")
						.setDescription(`Toggled ${toggle}`)
						.setTimestamp()

					interaction.reply({ embeds: [embed] });
				});
			});
		} else {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Error:")
				.setDescription("You don't have permission to use this command! Permission required: `Manage Guild`")
				.setTimestamp()

			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};