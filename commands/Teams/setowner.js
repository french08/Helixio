const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  name: 'setowner',
  description: 'Passe le propriétaire d\'une équipe à un autre membre.',
  category: '👪・Team',
  usage: '<@membre>',
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

    const teams = await Teamdb.get('teams') || [];

    const member = message.mentions.members.first() || client.users.cache.get(args[0]);
    if (!member) {
      return message.reply('Veuillez mentionner un membre de l\'équipe.');
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

    if (!userTeam.members.includes(member.id)) {
      return message.reply('Le membre mentionné ne fait pas partie de votre équipe.');
    }

    // Passe le propriétaire de l'équipe au nouveau membre
    userTeam.owner = member.id;
    await Teamdb.set('teams', teams);

    // Crée l'embed
    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Changement de propriétaire d\'équipe')
      .setDescription(`Le nouveau propriétaire de l'équipe est <@${member.user.id}>`);

    message.channel.send({ embeds: [embed] });
  },
};
