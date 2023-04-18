const { EmbedBuilder } = require('discord.js');
const jsoning = require('jsoning');
const config = require("../../config/config.js");

module.exports = {
    name: 'team',
    description: 'Affiche les informations de votre équipe actuelle',
    category: '👪・Team',
    run: async (client, interaction) => {

        const Jsoning = require('jsoning');
        const Guildname = interaction.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

        const authorId = interaction.author.id;
        const teams = await Teamdb.get('teams') || [];
        
        // recherche de l'équipe à laquelle appartient l'utilisateur
        const userTeam = teams.find(team => team.members.includes(authorId));
        if (!userTeam) {
            return interaction.reply('Vous ne faites partie d\'aucune équipe.');
        }
        
        // affichage des informations de l'équipe
        const embed = new EmbedBuilder()
            .setTitle(userTeam.name)
            .addFields({ name: 'Description', value: userTeam.description })
            .addFields({ name: 'Owner', value: `<@${userTeam.owner}>` })
            .addFields({ name: 'Admins', value: userTeam.admins.map(memberId => `<@${memberId}>`).join(', ') || "Il n'y a pas d'admin."})
            .addFields({ name: 'Membres', value: userTeam.members.map(memberId => `<@${memberId}>`).join(', ') })
            .addFields({ name: 'Banque', value: Math.round(userTeam.banque).toString() })
            .setColor(config.couleurs.bleu);
        
        // si l'utilisateur est l'owner de l'équipe, on affiche également l'identifiant de l'équipe
        if (userTeam.owner === authorId) {
            embed.addFields({ name: 'Identifiant', value: userTeam.id });
        }
        
        interaction.reply({ embeds: [embed] });
    },
};
