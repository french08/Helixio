
module.exports = {
  name: 'deleteteam',
  description: 'Supprime votre équipe',
  category: '👪・Team',
  run: async (client, interaction) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);
    
    const authorId = interaction.author.id;
    const teams = await Teamdb.get('teams') || [];

    const teamToDelete = teams.find((team) => team.owner === authorId);

    if (!teamToDelete) {
      return interaction.reply("Vous n'êtes pas propriétaire d'une équipe.");
    }

    const index = teams.indexOf(teamToDelete);

    if (index !== -1) {
      teams.splice(index, 1);
    }

    await Teamdb.set('teams', teams);

    return interaction.reply(`L'équipe "${teamToDelete.name}" a été supprimée avec succès !`);
  },
};
