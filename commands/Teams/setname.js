const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  name: 'setname',
  description: 'Change le nom de votre team.',
  category: '👪・Team',
  usage: '< nouveau nom >',
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

    const teams = await Teamdb.get('teams') || [];

    if(!args[0]) {
        return message.reply("Vous n'avez pas mit un nom !");
    }

    const userTeam = teams.find(t => t.members.includes(message.author.id));
    if (!userTeam) {
      return message.reply('Vous ne faites pas partie d\'une équipe.');
    }

    // Vérifie si l'utilisateur est l'owner de la team
    const isTeamOwner = userTeam.owner === message.author.id;

    if (!isTeamOwner) {
      return message.reply('Vous devez être propriétaire de votre équipe pour pouvoir utiliser cette commande.');
    }

    // Passe le propriétaire de l'équipe au nouveau membre
    userTeam.name = args[0];
    await Teamdb.set('teams', teams);

    // Crée l'embed
    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Changement de nom')
      .setDescription(`Le nouvaux nom de votre est équipe est ${args[0]}`);

    message.channel.send({ embeds: [embed] });
  },
};
