const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
    name: 'removemember',
    description: 'Enlève un membre de la team',
    category: '👪・Team',
    usage: '<@membre>',
    run: async (client, message, args) => {

        const Jsoning = require('jsoning');
        const Guildname = interaction.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

        const authorId = message.author.id;
        const teams = await Teamdb.get('teams') || [];
        const userTeam = teams.find(t => t.members.includes(authorId));
        if (!userTeam) {
            return message.reply('Vous ne faites pas partie d\'une équipe.');
        }

        // Vérifie si l'utilisateur est un admin ou l'owner de la team
        const isTeamAdmin = userTeam.admins.includes(authorId);
        const isTeamOwner = userTeam.owner === authorId;

        if (!isTeamOwner && !isTeamAdmin) {
            return message.reply('Seul l\'owner ou les admins de l\'équipe peuvent retirer des membres.');
        }

        // Récupère l'utilisateur mentionné
        const member = message.mentions.members.first() || client.users.cache.get(args[0]);
        if (!member) {
            return message.reply('Vous devez mentionner un membre.');
        }

        // Vérifie si l'utilisateur appartient à l'équipe
        const team = teams.find(t => t.members.includes(member.id));
        if (!team || team.name !== userTeam.name) {
            const memberembed = new EmbedBuilder()
            .setColor(config.couleurs.rouge)
            .setDescription(`${member} n'appartient pas à votre équipe.`);
            return message.reply({ embeds: [memberembed] });
        }

        // Enlève l'utilisateur de l'équipe
        team.members.splice(team.members.indexOf(member.id), 1);
        await Teamdb.set('teams', teams);
        const embed = new EmbedBuilder()
            .setColor(config.couleurs.bleu)
            .setDescription(`${member} a été enlevé de l'équipe ${team.name}.`);
        message.channel.send({ embeds: [embed] });
    },
};
