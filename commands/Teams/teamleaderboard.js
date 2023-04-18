const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  name: 'teamleaderboard',
  description: 'Affiche le classement des teams en fonction de leur argent.',
  category: '👪・Team',
  usage: '',
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

    const teams = await Teamdb.get('teams') || [];
    if (teams.length === 0) {
      return message.reply('Il n\'y a aucune équipe enregistrée.');
    }

    const sortedTeams = teams.sort((a, b) => b.money - a.money);
    const totalPages = Math.ceil(sortedTeams.length / 10);

    let page = 1;
    if (args[0] && !isNaN(args[0])) {
      page = parseInt(args[0]);
    }
    if (page > totalPages) {
      page = totalPages;
    }
    if (page < 1) {
      page = 1;
    }

    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Classement des teams')
      .setFooter({ text: `Page ${page}/${totalPages}` });

    const start = (page - 1) * 10;
    const currentTeams = sortedTeams.slice(start, start + 10);

    currentTeams.forEach((team, index) => {
      const rank = start + index + 1;
      embed.addFields({ name: `${rank}. ${team.name}`, value: `💰 Argent : ${team.banque} €`});
    });

    const msg = await message.channel.send({ embeds: [embed] });

    if (totalPages > 1) {
      await msg.react('⬅️');
      await msg.react('➡️');

      const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      const collector = msg.createReactionCollector(filter, { time: 60000, dispose: true });

      collector.on('collect', async (reaction) => {
        if (reaction.emoji.name === '⬅️') {
          page--;
        } else {
          page++;
        }

        if (page > totalPages) {
          page = totalPages;
        }
        if (page < 1) {
          page = 1;
        }

        const newEmbed = new EmbedBuilder(embed)
          .setFooter({ text: `Page ${page}/${totalPages}` });

        const newStart = (page - 1) * 10;
        const newCurrentTeams = sortedTeams.slice(newStart, newStart + 10);

        newEmbed.fields = [];
        newCurrentTeams.forEach((team, index) => {
          const rank = newStart + index + 1;
          newEmbed.addFields({ name: `${rank}. ${team.name}`, value: `💰 Argent : ${team.banque} €`});
        });

        await msg.edit(newEmbed);
      });
    }
  },
};
