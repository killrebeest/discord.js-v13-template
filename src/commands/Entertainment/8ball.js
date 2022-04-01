const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");

const config = require("../../data/config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Answers any question you ask!")
		.addStringOption((option) => option.setName("question").setDescription("Question to ask").setRequired(true)),

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */

	async execute(client, interaction) {
		const AntiSwear = require("../../models/antiswear");
		const antiSwear = await AntiSwear.findOne({ guild_id: interaction.guild.id });

		const replies = [
			"Yes.",
			"It is certain.",
			"It is decidedly so.",
			"Without a doubt.",
			"Yes definelty.",
			"You may rely on it.",
			"As I see it, yes.",
			"Most likely.",
			"Outlook good.",
			"Signs point to yes.",
			"Reply hazy, try again.",
			"Ask again later.",
			"Better not tell you now...",
			"Cannot predict now.",
			"Concentrate and ask again.",
			"Don't count on it.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good...",
			"Very doubtful.",
		];

		const embed = new MessageEmbed()
			.setColor("ORANGE")
			.setTitle(`${interaction.options.getString("question")}?`)
			.setDescription(`${replies[Math.floor(Math.random() * replies.length - 1)]}`)
			.setTimestamp()
			.setFooter({ text: `Phantom Bot v${config.version}` });

		interaction.reply({ embeds: [embed] });

		if (antiSwear.toggled == "on") {
			const wash = require("washyourmouthoutwithsoap");
			var swearjar = require("swearjar");

			if (wash.check(interaction.guild.preferredLocale.toLocaleLowerCase().split("-")[0], interaction.options.getString("question").toLowerCase())) {
				interaction.deleteReply();
				interaction.channel.send(`Antiswear: You can not swear on this discord server ${interaction.user}.`);
				return;
			}

			if (swearjar.profane(interaction.options.getString("question").toLowerCase())) {
				interaction.deleteReply();
				interaction.channel.send(`Antiswear: You can not swear on this discord server ${interaction.user}.`);
				return;
			}
		}
	},
};