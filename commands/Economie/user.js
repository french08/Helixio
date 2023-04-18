const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require("../../config/config.js");
const Jimp = require("jimp");
const skinsFolderPath = 'perso/'; // Chemin vers le dossier contenant les skins
const fs = require('fs-extra');

module.exports = {

  name: "profil",
  description: "Regarde l'utilisateur d'une personne",
  permissions: ["SendMessages"],
  category: "💰・Econnomie",
  owner: false,

  run: async (client, message, args) => {

    const Jsoning = require('jsoning');
    const Guildname = message.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);
    const Skindb = new Jsoning(`${Getguildsdb}/skin.json`);
    const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);

    const teams = await Teamdb.get('teams') || [];

    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    if (!user) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription(`Veuillez mentionner une personne ou mettre un id valide !`)
            .setColor(config.couleurs.rouge)
        ]
      });
    }

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    // Récupérer le skin de l'utilisateur depuis le fichier JSON
    const userSkin = Skindb.get(user.id) || "skin6.png";

    if (Skindb.get(user.id) == null) {
      Skindb.set(user.id, "skin6.png");
    }

    const skinFilePath = skinsFolderPath + userSkin;

    async function writeimage(skinFilePath) {

      const skin = await Jimp.read(skinFilePath);
      const image = new Jimp(700, 270, 0x0);
      const skinResized = skin.resize(105, 208);
      const namePositionX = 120; // Position X du pseudo dans l'image
      const namePositionY = 20; // Position Y du pseudo dans l'image
      const levelPositionX = 120; // Position X du texte de niveau dans l'image
      const levelPositionY = 60; // Position Y du texte de niveau dans l'image
      const xpPositionX = 120; // Position X du texte d'xp dans l'image
      const xpPositionY = 100; // Position Y du texte d'xp dans l'image
      const moneyPositionX = 120; // Position X du texte d'argent dans l'image
      const moneyPositionY = 140; // Position Y du texte d'argent dans l'image
      const teamPositionX = 120; // Position X du texte de team
      const teamPositionY = 160;  // Position Y du texte de team


      const userData = await Xpdb.get(user.id) || { exp: 0, level: 0 };
      const userMoney = Math.round(await Ecodb.get(user.id)) || 0;
      const teamName = `Team: ${teams.name}` || "Pas dans une team";

      image.composite(skinResized, 0, 0);
      image.print(font, namePositionX, namePositionY, user.username).opacity(1);
      image.print(font, levelPositionX, levelPositionY, `Niveau: ${userData.level}`).opacity(1);
      image.print(font, xpPositionX, xpPositionY, `Xp: ${userData.exp + 1} / ${expneedarond.expneedarond}`).opacity(1);
      image.print(font, moneyPositionX, moneyPositionY, `Argent: ${userMoney} euros`).opacity(1);
      image.print(font, teamPositionX, teamPositionY, `${teamName}`).opacity(1);

      const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

      // Enregistrer l'image sur le disque
      const imagePath = `./${user.id}_skin.png`;
      await fs.writeFile(imagePath, imageBuffer);

      // Créer une nouvelle instance de MessageAttachment
      const attachment = new AttachmentBuilder(imagePath);

      // Envoyer l'embed avec l'image attachée
      const embed = new EmbedBuilder()
        .setTitle(`Profile de ${user.username}`)
        .setImage(`attachment://${user.id}_skin.png`)
        .setThumbnail(message.guild.iconURL())
        .setColor(config.couleurs.bleu);

      await message.channel.send({
        embeds: [embed],
        files: [attachment],
      });

      // Supprimer l'image du disque après l'envoi
      await fs.unlink(imagePath);
    }


    writeimage(skinFilePath);
  }
};