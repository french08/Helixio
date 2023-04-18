const { EmbedBuilder } = require("discord.js");
let jsoning = require("jsoning");
let prefix = new jsoning("prefix.json");
let config = require("../../config/config.js");
module.exports = {

  name: "prefix",  
  description: "Définissez le préfixe du serveur",
  usage: "[prefix]",
  category: "🧑‍💻・owner",
  permissions: ['Administrator'],
  owner: false,
  run: async (client, message, args) => {

    if (!message.member.permissions.has(config.Permissions.ADMIN)) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🚫 Malheureusement, vous n'êtes pas autorisé à utiliser cette commande.`)
          .setColor(config.couleurs.rouge)
      ]
    });

    if (!args[0]) return message.reply({ embeds: [
      new EmbedBuilder()
        .setTitle("Argument manquant")
        .setDescription("Veuillez mettre un nouveau prefix !")
        .setColor(config.couleurs.rouge)
    ]});

    if (args[0].length > 5) return message.reply({ embeds: [
      new EmbedBuilder()
        .setTitle("Mauvais argument")
        .setDescription("Désolé, mais la longueur du nouveau préfixe ne doit pas dépasser 5 caractères !")
        .setColor(config.couleurs.rouge)
    ]});

    const newPrefix = await prefix.set(message.guild.id, args[0]);

    const finalEmbed = new EmbedBuilder()
      .setTitle("Succès")
      .setDescription(`Nouveau préfixe pour ce serveur : \`${newPrefix}\`.`)
      .setColor(config.couleurs.vert);

    return message.reply({ embeds: [finalEmbed] });
    
  },
};
