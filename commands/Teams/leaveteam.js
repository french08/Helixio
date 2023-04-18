const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
    name: 'leaveteam',
    description: 'Quitte une team.',
    category: '👪・Team',
    usage: '',
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

        // Vérifie si l'utilisateur est l'owner de la team
        const isTeamOwner = userTeam.owner === authorId;

        if (isTeamOwner) {
            return message.reply('Vous ne pouvez pas quitter une équipe dont vous êtes propriétaire. Veuillez supprimer la team si vous le souhaitez.');
        }

        // Retire l'utilisateur de l'équipe
        const teamIndex = teams.findIndex((team) => team.members.includes(authorId));
        userTeam.members = userTeam.members.filter(member => member !== authorId);
        teams[teamIndex] = userTeam;
        await Teamdb.set('teams', teams);

        const embed = new EmbedBuilder()
            .setTitle('Team Quitter')
            .setDescription(`Vous avez quitté la team "${userTeam.name}".`)
            .setColor(config.couleurs.bleu);
        message.channel.send({ embeds: [embed] });

        // Supprime la team si elle est vide
        if (userTeam.members.length === 0) {
            teams.splice(teamIndex, 1);
            await Teamdb.set('teams', teams);
            const owner = await client.users.fetch(userTeam.owner);
            const ownerDmChannel = await owner.createDM();
            const embed = new EmbedBuilder()
                .setTitle('Team Dissoute')
                .setDescription(`Votre équipe "${userTeam.name}" a été dissoute car elle ne compte plus de membres.`)
                .setColor(config.couleurs.rouge);
            ownerDmChannel.send({ embeds: [embed] });
        }
    }
}    
