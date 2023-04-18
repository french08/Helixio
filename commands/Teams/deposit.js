const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
  name: 'deposit',
  description: 'Ajoute de l\'argent à la banque de la team',
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

    // Vérifie que les arguments nécessaires ont été fournis
    const amount = parseInt(args[0]);
    if (!amount) {
      return message.reply('Vous devez fournir un montant à ajouter.');
    }

    // Vérifie que l'utilisateur a suffisamment d'argent
    const userData = await Ecodb.get(authorId);
    if (userData < amount) {
      return message.reply('Cet utilisateur n\'a pas suffisamment d\'argent.');
    }

    // Ajoute de l'argent à la banque de la team et retire de l'argent à l'utilisateur
    userTeam.banque += amount;
    const userMoney = userData - amount;
    await Promise.all([
      Ecodb.set(authorId, userMoney),
      Teamdb.set('teams', teams),
    ]);

    const embed = new EmbedBuilder()
    .setColor(config.couleurs.bleu)
    .setDescription(`La somme de **${amount}** a été ajoutée à la banque de l'équipe.`);

    return message.channel.send({embeds: [embed]});
  },
};
