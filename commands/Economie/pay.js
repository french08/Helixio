let { EmbedBuilder } = require('discord.js');
let config = require("../../config/config.js");

module.exports = {

  name: "pay",
  description: "Paye une personne",
  category: "💰・Econnomie",
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription(`Veuillez mentionner une personne ou mettre un id valide !`)
            .setColor(config.couleurs.rouge)
        ]
      });
      return;
    }

    const amount = parseFloat(args[1]);
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

    if (Ecodb.get(user.id) == null || 0) {
      Ecodb.set(user.id, 0)
    }

    const authorBal = await Ecodb.get(`${message.author.id}`);
    const recipientBal = await Ecodb.get(`${user.id}`);

    if (authorBal < amount) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Payement refusée")
            .setDescription(`Vous n'avez pas assez d'argent pour payer une autre personne.`)
            .setColor(config.couleurs.rouge)
        ]
      });
    }

    await Ecodb.set(`${message.author.id}`, authorBal - amount);
    await Ecodb.set(`${user.id}`, recipientBal + amount);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Payement réussi")
          .setDescription(`Vous avez payer <@${user.id}> la somme de ${amount}€`)
          .setColor(config.couleurs.bleu)
      ]
    });
  }
};