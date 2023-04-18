const { EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
  name: 'roulette',
  description: 'Joue au jeu de la roulette',
  category: "💰・Econnomie",
  owner: false,

  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const argsEmbed = new EmbedBuilder().setColor(config.couleurs.rouge).setDescription('Vous n\'avez pas misé d\'argent');
    if (!args[0]) return message.reply({ embeds: [argsEmbed] });

    const amount = parseFloat(args[0]);

    if (isNaN(amount) || amount <= 0) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription(`Veuillez mettre un montant valide !`)
            .setColor(config.couleurs.rouge)
        ]
      });
      return;
    }

    const userdb = await Ecodb.get(message.author.id);
    if (userdb < amount) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Vous avez misé plus que vous avez !`)
            .setColor(config.couleurs.rouge)
        ]
      });
    }

    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Roulette')
      .setDescription('Choisissez une couleur en réagissant :')
      .addFields(
        { name: '🔴 Rouge', value: 'x1.5 argent, 1 chance sur 2' },
        { name: '⚫ Noir', value: 'x2 argent, 1 chance sur 3' },
        { name: '🟢 Vert', value: 'x12 argent, 1 chance sur 25' },
      );

    const messages = await message.reply({
      embeds: [embed],
      fetchReply: true,
    });

    const emojis = ['🔴', '⚫', '🟢'];
    emojis.forEach(async (emoji) => await messages.react(emoji));

    const filter = (reaction, user) => {
      return emojis.includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = messages.createReactionCollector({ filter, time: 60000 });
    let multiplier = 0;
    let probability = 0;
    collector.on('collect', (reaction, user) => {
      switch (reaction.emoji.name) {
        case '🔴':
          multiplier = 1.5;
          probability = 1 / 2; //2
          break;
        case '⚫':
          multiplier = 2;
          probability = 1 / 3; //3
          break;
        case '🟢':
          multiplier = 12;
          probability = 1 / 25; //25
          break;
      }
      const win = Math.random() < probability;
      const betAmount = amount;
      const zeroEmbed = new EmbedBuilder().setColor(config.couleurs.rouge).setDescription("Vous avez misé sur 0. Ça peut être risqué!");
    if (multiplier === 0) {
      return message.reply({ embeds: [zeroEmbed] });
    }
    if (win) {
      messages.reactions.removeAll()
      .catch(error => console.error('Une erreur c\'est produite...', error));
      const winAmount = betAmount * multiplier;
      const winuser = userdb + winAmount;
      Ecodb.math(message.author.id, "add", winAmount);

      const winEmbed = new EmbedBuilder()
        .setColor(config.couleurs.vert)
        .setTitle('Roulette - Victoire !')
        .setDescription(`Vous avez gagné ${winAmount}€ !`)

      messages.edit({ embeds: [winEmbed] });
    } else {
      messages.reactions.removeAll()
      .catch(error => console.error('Une erreur c\'est produite...', error));
      const loseAmount = betAmount;
      const loseuser = userdb - loseAmount;
      Ecodb.set(message.author.id, loseuser);

      const loseEmbed = new EmbedBuilder()
        .setColor(config.couleurs.rouge)
        .setTitle('Roulette - Défaite !')
        .setDescription(`Vous avez perdu ${loseAmount}€ !`)
      messages.edit({ embeds: [loseEmbed] });
    }
    collector.stop()
  });

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      messages.reactions.removeAll()
	.catch(error => console.error('Une erreur c\'est produite...', error));
      const timeoutEmbed = new EmbedBuilder()
        .setColor(config.couleurs.jaune)
        .setTitle('Roulette - Temps écoulé')
        .setDescription('Le temps pour choisir une couleur est écoulé !');

      messages.edit({ embeds: [timeoutEmbed] });
    }
  });
}
}
