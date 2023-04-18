const { MessageCollector } = require('discord.js');

module.exports = {
 
    name: 'removeshop',
    description: 'Retire un article de la boutique',
    category: "🧑‍💻・owner",
    permissions: ["SendMessages","ManageGuild"],
    owner: true,
  run: async (client, interaction) => {

    if (!message.member.permissions.has(config.Permissions.ADMIN)) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🚫 Malheureusement, vous n'êtes pas autorisé à utiliser cette commande.`)
          .setColor(config.couleurs.rouge)
      ]
    });

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Shopdb = new Jsoning(`${Getguildsdb}/shop.json`);

    const itemNameQuestion = 'Quel est le nom de l\'article que vous voulez retirer de la boutique ?';

    // envoie la première question à l'utilisateur
    const prompt = await interaction.reply(itemNameQuestion);

    // création du collector pour la réponse de l'utilisateur
    const filter = (m) => m.author.id === interaction.author.id;
    const collector = new MessageCollector(interaction.channel, { filter, time: 60000 });

    collector.on('collect', async (msg) => {
      const itemName = msg.content;

      // récupération de la liste des articles de la boutique
      const shopItems = await Shopdb.get('items') || [];

      // recherche de l'article à retirer
      const itemIndex = shopItems.findIndex((item) => item.name.toLowerCase() === itemName.toLowerCase());

      if(itemName === "Teams" || "teams") {
        interaction.reply("Vous le pouvez pas supprimer l'item de Team car je ne pourrais pas fonctionner sans.");
        return collector.stop();
      }

      if (itemIndex === -1) {
        interaction.reply(`L'article "${itemName}" n'a pas été trouvé dans la boutique.`);
        return collector.stop();
      }

      // retrait de l'article de la boutique
      const removedItem = shopItems.splice(itemIndex, 1)[0];
      await Shopdb.set('items', shopItems);

      interaction.reply(`L'article "${removedItem.name}" a été retiré de la boutique.`);

      collector.stop();
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        interaction.reply(`Vous n'avez pas répondu à temps à la question "${itemNameQuestion}"`);
      }
    });
  }
};
