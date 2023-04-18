const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
  name: 'removeadmin',
  description: 'Supprime un admin de votre équipe',
  category: '👪・Team',
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

    const authorId = message.author.id;
    const teams = await Teamdb.get('teams') || [];
    
    // Vérifie si l'utilisateur appartient à une équipe
    const userTeam = teams.find(t => t.members.includes(authorId));
    if (!userTeam) {
      return message.reply('Vous ne faites pas partie d\'une équipe.');
    }

    // Vérifie si l'utilisateur est propriétaire de l'équipe
    if (userTeam.owner !== authorId) {
      return message.reply('Vous devez être le propriétaire de l\'équipe pour supprimer un admin.');
    }

    // Vérifie que l'argument pour l'id de l'admin a été fourni
    const adminId = message.mentions.members.first() || client.users.cache.get(args[0]);
    if (!adminId) {
      return message.reply('Vous devez fournir l\'id de l\'admin à supprimer.');
    }

    // Vérifie que l'admin fait bien partie de l'équipe
    if (!userTeam.admins.includes(adminId.id)) {
      return message.reply('Cet utilisateur n\'est pas un admin de votre équipe.');
    }

    // Supprime l'admin de l'équipe
    userTeam.admins = userTeam.admins.filter(id => id !== adminId.id);
    await Teamdb.set('teams', teams);
    const embed = new EmbedBuilder()
    .setColor(config.couleurs.bleu)
    .setDescription(`L'utilisateur avec l'id ${adminId} a été supprimé de la liste des admins de votre équipe.`);

    return message.channel.send({embeds: [embed]});
  },
};
