const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {

  name: 'undeposit',
  description: 'Retire de l\'argent de la banque de la team',
  category: '👪・Team',
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const authorId = message.author.id;
    const teams = await Teamdb.get('teams') || [];

    // Vérifie si l'utilisateur appartient à une équipe
    const userTeam = teams.find(t => t.members.includes(authorId));
    if (!userTeam) {
      return message.reply('Vous ne faites pas partie d\'une équipe.');
    }

    // Vérifie que l'utilisateur est propriétaire ou admin de l'équipe
    if (userTeam.owner !== authorId && !userTeam.admins.includes(authorId)) {
      return message.reply('Vous devez être l\'owner ou un admin de l\'équipe pour retirer de l\'argent.');
    }

    // Vérifie que les arguments nécessaires ont été fournis
    const amount = parseInt(args[0]);
    if (!amount) {
      return message.reply('Vous devez fournir un montant à retirer.');
    }

    // Vérifie que la banque de l'équipe a suffisamment d'argent
    if (userTeam.banque < amount) {
      return message.reply('La banque de l\'équipe ne contient pas suffisamment d\'argent.');
    }

    // Ajoute de l'argent à l'utilisateur et retire de l'argent de la banque de l'équipe
    const userData = await Ecodb.get(authorId);
    const userMoney = userData + amount;
    userTeam.banque -= amount;
    await Promise.all([
      Ecodb.set(authorId, userMoney),
      Teamdb.set('teams', teams),
    ]);

    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setDescription(`La somme de ${amount} a été retirée de la banque de l'équipe.`);

    return message.channel.send({ embeds: [embed] });
  },
};
