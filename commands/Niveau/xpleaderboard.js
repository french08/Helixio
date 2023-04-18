let { EmbedBuilder } = require('discord.js');
let config = require("../../config/config.js");

module.exports = {

  name: "xpleaderboard",
  description: "Classe les gens les plus riches au plus pauvres",
  category: "🎚️・Niveau",
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);

    const data = await Xpdb.all();
    const members = message.guild.members.cache;

    // Création de la liste des membres triés par ordre décroissant de leur niveau
    const memberList = Object.entries(data)
      .sort((a, b) => b[1].level - a[1].level)
      .map(([id, value]) => members.get(id) ? members.get(id).toString() + ': ' + value.level : '');

    // Création des pages de l'embed
    const pageSize = 10;
    const pages = [];
    for (let i = 0; i < memberList.length; i += pageSize) {
      const page = memberList.slice(i, i + pageSize).join('\n');

      pages.push({
        embeds: [
          new EmbedBuilder()
            .setTitle('Classement des niveaux')
            .setDescription(page)
            .setColor(config.couleurs.bleu)
        ]
      });
    }

    // Envoi des pages dans le salon
    let currentPage = 0;
    const pageMessage = await message.channel.send(pages[currentPage]);
    await pageMessage.edit({ embeds: [pages[currentPage].embeds[0].setFooter({ text: `${currentPage + 1}/${pages.length}` })] });

    // Ajout des réactions pour la pagination si nécessaire
    if (pages.length > 1) {
      await pageMessage.react('⬅️');
      await pageMessage.react('➡️');

      // Gestion des réactions pour naviguer entre les pages
      const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
      const collector = pageMessage.createReactionCollector({ filter, time: 60000 });

      collector.on('collect', async (reaction, user) => {
        reaction.users.remove(user);

        switch (reaction.emoji.name) {
          case '⬅️':
            currentPage = (currentPage + pages.length - 1) % pages.length;
            break;
          case '➡️':
            currentPage = (currentPage + 1) % pages.length;
            break;
          default:
            break;
        }

        await pageMessage.edit({ embeds: [pages[currentPage].embeds[0].setFooter({ text: `${currentPage + 1}/${pages.length}` })] });
      });

      collector.on('end', () => {
        pageMessage.reactions.removeAll().catch(console.error);
      });
    }
  }
};
