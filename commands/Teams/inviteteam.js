const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
    name: 'inviteteam',
    description: 'Invite un membre à rejoindre la team',
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
        const teamIndex = teams.findIndex((team) => team.members.includes(authorId));
        const userTeam = teams.find(t => t.members.includes(authorId));
        if (!userTeam) {
            return message.reply('Vous ne faites pas partie d\'une équipe.');
        }

        // Vérifie si l'utilisateur est un admin ou l'owner de la team
        const isTeamAdmin = userTeam.admins.includes(authorId);
        const isTeamOwner = userTeam.owner === authorId;

        if (!isTeamOwner && !isTeamAdmin) {
            return message.reply('Seul l\'owner ou les admins de l\'équipe peuvent inviter des membres.');
        }

        // Récupère l'utilisateur mentionné
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply('Vous devez mentionner un membre.');
        }

        // Vérifie si l'utilisateur appartient déjà à une équipe
        const memberTeam = await Teamdb.get('teams').find(t => t.members.includes(member.id));
        if (memberTeam) {
            return message.reply('Cet utilisateur appartient déjà à une équipe.');
        }

        const team = teams[teamIndex];
        const inviterTeam = await Teamdb.get('teams').find(t => t.members.includes(message.author.id));
        if (!inviterTeam) {
            return message.reply('Vous devez appartenir à une équipe pour inviter un membre.');
        }

        // Crée l'invitation
        userTeam.invitations.push(member.id);
        await Teamdb.set('teams', teams);

        // Envoie une confirmation de l'envoi de l'invitation
        const confembed = new EmbedBuilder()
            .setTitle('Invitation à rejoindre la team')
            .setDescription(`${member} a bien été invité dans la team ${inviterTeam.name} !`)
            .setColor(config.couleurs.bleu);
        message.reply({ embeds: [confembed] });

        // Envoie l'invitation avec des réactions
        const embed = new EmbedBuilder()
            .setTitle('Invitation à rejoindre la team')
            .setDescription(`Vous avez été invité à rejoindre la team ${inviterTeam.name} par ${message.author}. Réagissez avec ✅ pour accepter ou ❌ pour refuser.`)
            .setColor(config.couleurs.bleu);
        member.send({ embeds: [embed] })
            .then(async (msg) => {
                await msg.react('✅');
                await msg.react('❌');

                // Attend la réaction de l'utilisateur
                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === member.id;
                const collector = msg.createReactionCollector({ filter, time: 60000 });
                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === '✅') {
                        // Accepte l'invitation
                        userTeam.invitations = userTeam.invitations.filter(invitation => invitation !== member.id);
                        userTeam.members.push(member.id);
                        await Teamdb.set('teams', teams);

                        // Envoie une confirmation d'acceptation
                        const acceptembed = new EmbedBuilder()
                            .setTitle('Invitation acceptée')
                            .setDescription(`${member} a accepté votre invitation et a rejoint la team ${inviterTeam.name} !`)
                            .setColor(config.couleurs.vert);
                        message.reply({ embeds: [acceptembed] });
                        msg.delete();
                    } else if (reaction.emoji.name === '❌') {
                        // Refuse l'invitation
                        userTeam.invitations = userTeam.invitations.filter(invitation => invitation !== member.id);
                        await Teamdb.set('teams', teams);

                        // Envoie une confirmation de refus
                        const refuseembed = new EmbedBuilder()
                            .setTitle('Invitation refusée')
                            .setDescription(`${member} a refusé votre invitation à rejoindre la team ${inviterTeam.name}.`)
                            .setColor(config.couleurs.rouge);
                        message.reply({ embeds: [refuseembed] });
                        msg.delete();
                    }
                });

                collector.on('end', async () => {
                    // Supprime l'invitation si le temps expire
                    userTeam.invitations = userTeam.invitations.filter(invitation => invitation !== member.id);
                    await Teamdb.set('teams', teams);
                });
            })
            .catch(() => {
                // Envoie une erreur si l'invitation ne peut pas être envoyée
                return message.reply(`Impossible d'envoyer l'invitation à ${member}. Assurez-vous que l'utilisateur accepte les messages privés.`);
            });
    },
};    
