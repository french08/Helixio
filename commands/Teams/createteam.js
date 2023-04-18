const { MessageCollector } = require('discord.js');

module.exports = {
    name: 'createteam',
    description: 'Crée une nouvelle équipe',
    category: '👪・Team',
    owner: false,
    run: async (client, interaction) => {

        const Jsoning = require('jsoning');
        const Guildname = interaction.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);
        const Shopdb = new Jsoning(`${Getguildsdb}/shop.json`);

        const authorId = interaction.author.id;
        const shopnull = Shopdb.get(`item3_${authorId}`);
        const teams = await Teamdb.get('teams') || [];
        const teamToDelete = teams.find((team) => team.owner === authorId);

        if (teamToDelete) {
            return interaction.reply("Vous êtes déjà propriétaire d'une équipe.");
        }

        if (shopnull === null) {
            return interaction.reply("Vous n'avez pas acheter le droit de crée une team !");
        }

        const maxTeams = 100; // maximum de 100 équipes
        if (teams.length >= maxTeams) {
            return interaction.reply(`Le nombre maximum de ${maxTeams} équipes a été atteint. Veuillez en supprimer une avant d'en créer une nouvelle.`);
        }
        const questions = [
            { name: 'name', content: 'Nom de l\'équipe ?' },
            { name: 'description', content: 'Description de l\'équipe ?' },
        ];
        let i = 0;
        const answers = {};
        const askQuestion = async () => {
            if (i >= questions.length) {
                // toutes les questions ont été posées, on peut ajouter l'équipe à la base de données
                const newTeam = {
                    name: answers.name,
                    description: answers.description,
                    id: `team${teams.length + 1}`,
                    owner: authorId,
                    admins: [],
                    members: [authorId],
                    invitations: [],
                    banque: 0,
                };
                teams.push(newTeam);
                await Teamdb.set('teams', teams);
                await Shopdb.set(`item3_${authorId}`, false);
                return interaction.reply(`L'équipe "${newTeam.name}" a été créé avec succès !`);
            }
            // envoie la question à l'utilisateur
            const question = questions[i];
            const prompt = await interaction.reply(`**${question.content}**`);
            const filter = (m) => m.author.id === interaction.author.id;
            const collector = new MessageCollector(interaction.channel, { filter, time: 60000 });
            // attend la réponse de l'utilisateur
            collector.on('collect', (msg) => {
                answers[question.name] = msg.content;
                i++;
                collector.stop();
                askQuestion();
            });
            // envoie un message d'erreur si l'utilisateur ne répond pas à temps
            collector.on('end', (_, reason) => {
                if (reason === 'time') {
                    interaction.reply(`Vous n'avez pas répondu à temps à la question "${question.content}"`);
                }
            });
        };
        askQuestion();
    },
};
