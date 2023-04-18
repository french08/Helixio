const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
 
    name: 'leaderboard',
    description: 'Classe les gens les plus riches au plus pauvres',
    category: "💰・Econnomie",
    owner: false,
    aliases:  ["lb"],
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const entries = Object.entries(Ecodb.all()).sort((a, b) => b[1] - a[1]); // trier les entrées par valeur décroissante
    const pageLength = 10; // Nombre de membres par page
    const pageCount = Math.ceil(entries.length / pageLength); // Nombre de pages

    let page = 1; // La page actuelle

    // Calcul de l'index de début et de fin de la page actuelle
    const start = (page - 1) * pageLength;
    const end = start + pageLength;

    let leaderboard = '';
    for (let i = start; i < end; i++) {
      const [userID, money] = entries[i] || []; // Récupérer les données de l'utilisateur ou un tableau vide si l'entrée n'existe pas
      if (!userID) continue; // Si l'utilisateur n'existe pas, passer à l'entrée suivante
      const user = await client.users.fetch(userID).catch(() => null); // Récupérer l'utilisateur Discord
      if (!user) continue; // Si l'utilisateur n'existe pas, passer à l'entrée suivante
      const rank = start + i + 1;
      leaderboard += `**${rank}. ${user.tag}**: ${Math.round(money)}\n`; // Ajouter l'utilisateur et son argent au leaderboard
    }

    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Leaderboard')
      .setDescription(leaderboard)
      .setFooter({ text: `Page ${page} sur ${pageCount}` });

    // Ajouter les réactions pour la pagination
    const reactionPrev = '⬅️';
    const reactionNext = '➡️';

    const filter = (reaction, user) => {
      return [reactionPrev, reactionNext].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const Membed = await message.channel.send({ embeds: [embed] });
    await Membed.react(reactionPrev);
    await Membed.react(reactionNext);

    const collector = Membed.createReactionCollector({ filter, time: 60000 }); // 1 minute de temps pour la réaction

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user.id).catch(() => null); // Retirer la réaction de l'utilisateur
    
      if (reaction.emoji.name === reactionPrev && page > 1) {
        page--;
      } else if (reaction.emoji.name === reactionNext && page < pageCount) {
        page++;
      } else {
        return;
      }
    
      const newStart = (page - 1) * pageLength;
      const newEnd = newStart + pageLength;
      let newLeaderboard = '';
      for (let i = newStart; i < newEnd; i++) {
        const [userID, money] = entries[i] || []; // Récupérer les données de l'utilisateur ou un tableau vide si l'entrée n'existe pas
        if (!userID) continue; // Si l'utilisateur n'existe pas, passer à l'entrée suivante
        const user = client.users.cache.get(userID); // Récupérer l'utilisateur Discord
        if (!user) continue; // Si l'utilisateur n'existe pas, passer à l'entrée suivante
        newLeaderboard += `#${start + i + 1} **${user.tag}**: ${Math.round(money)}\n`; // Ajouter l'utilisateur et son argent au leaderboard
      }
    
      embed.setDescription(newLeaderboard);
      embed.setFooter({ text: `Page ${page} sur ${pageCount}` });
    
      Membed.edit({ embeds: [embed] });
    });    
    
    collector.on('end', () => {
      Membed.reactions.removeAll().catch(() => null); // Supprimer toutes les réactions
    });
  },
};    