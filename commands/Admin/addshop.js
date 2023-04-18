const { MessageCollector } = require('discord.js');
let config = require("../../config/config.js");
module.exports = {

  name: 'addshop',
  description: 'Ajoute un nouvel article à la boutique',
  category: "🧑‍💻・owner",
    permissions: ["SendMessages","ManageGuild"],
    ownerOnly: true,

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

    const questions = [
      { name: 'name', content: 'Nom de l\'article' },
      { name: 'description', content: 'Description de l\'article' },
      { name: 'price', content: 'Prix de l\'article' },
    ];

    let i = 0;
    const answers = {};

    const askQuestion = async () => {
      if (i >= questions.length) {
        // toutes les questions ont été posées, on peut ajouter l'article à la boutique
        const shopItems = await Shopdb.get('items') || [];
        const newItem = {
          name: answers.name,
          description: answers.description,
          price: answers.price,
          id: `item${shopItems.length + 1}`
        };
        shopItems.push(newItem);
        await Shopdb.set('items', shopItems);
        return interaction.reply(`L'article "${newItem.name}" a été ajouté à la boutique !`);
      }

      // envoie la question à l'utilisateur
      const question = questions[i];
      const prompt = await interaction.reply(`**${question.content}**`);
      const filter = (m) => m.author.id === interaction.author.id;
      const collector = new MessageCollector(interaction.channel, { filter, time: 60000 });

      // attend la réponse de l'utilisateur
      collector.on('collect', (msg) => {
        if (question.name === 'price' && isNaN(msg.content)) {
            interaction.reply('Veuillez entrer un nombre valide pour le prix et recommencer la commande.');
            collector.stop();
            return;
        }
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
  }
};
