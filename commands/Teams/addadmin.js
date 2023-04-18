const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
    name: 'addadmin',
    description: 'Ajoute un administrateur à l\'équipe',
    category: '👪・Team',
    run: async (client, message, args) => {

        const Jsoning = require('jsoning');
        const Guildname = message.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

        const authorId = message.author.id;
        const teams = await Teamdb.get('teams') || [];
        const teamIndex = teams.findIndex((team) => team.members.includes(authorId));
        if (teamIndex === -1) {
            return message.reply('Vous devez être membre d\'une équipe pour utiliser cette commande.');
        }
        const team = teams[teamIndex];
        if (team.owner !== authorId) {
            return message.reply('Seul le propriétaire de l\'équipe peut ajouter des administrateurs.');
        }
        if (args.length === 0) {
            return message.reply('Veuillez mentionner un membre à ajouter en tant qu\'administrateur.');
        }
        const member = message.mentions.members.first() || client.users.cache.get(args[0]);
        if (!member) {
            return message.reply('Veuillez mentionner un membre valide.');
        }
        if (team.members.includes(member.id)) {
            if (!team.admins.includes(member.id)) {
                team.admins.push(member.id);
                await Teamdb.set('teams', teams);
                const embed = new EmbedBuilder()
                    .setColor(config.couleurs.bleu)
                    .setDescription(`${member} a été ajouté en tant qu'administrateur de l'équipe.`);
                message.channel.send({ embeds: [embed] });
            } else {
                message.reply(`${member} est déjà un administrateur de l'équipe.`);
            }
        } else {
            message.reply(`${member} n'est pas membre de l'équipe.`);
        }
    },
};
