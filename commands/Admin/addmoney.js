let { EmbedBuilder } = require('discord.js');
let config = require("../../config/config.js");
module.exports = {

  name: "addmoney",
  description: "Ajoute de l'argent",
  category: "🧑‍💻・owner",
  permissions: ["SendMessages", "ManageGuild"],
  owner: true,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(config.Permissions.ADMIN)) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🚫 Malheureusement, vous n'êtes pas autorisé à utiliser cette commande.`)
          .setColor(config.couleurs.rouge)
      ]
    });

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
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
      Ecodb.set(user.id, amount)
    }

    const balance = Ecodb.get(user.id) || 0;
    const newbal = balance + amount;

    await Ecodb.set(user.id, newbal);
    //  await db.math(user.id, "add", amount);

    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Ajout d'argent")
          .setDescription(`Ajout de ${amount.toFixed(2)}€ au solde de <@${user.id}>\nNouveau solde: ${Ecodb.get(user.id)}€`)
          .setColor(config.couleurs.bleu)
      ]
    });
  }
};