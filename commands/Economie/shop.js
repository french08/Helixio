const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
  name: 'shop',
  description: 'Affiche le shop',
  owner: false,
  category: "💰・Econnomie",
  run: async (client, interaction) => {

    const Jsoning = require('jsoning');
    const Guildname = interaction.guild.name;
    const Guildsdb = new Jsoning("guilds.json");
    const Getguildsdb = Guildsdb.get(Guildname);
    const Shopdb = new Jsoning(`${Getguildsdb}/shop.json`);
    const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);

    const shopItems = await Shopdb.get('items') || [];

    //  console.log(shopItems);

    const options = [];

    for (const item of shopItems) {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(item.name)
        .setValue(item.id)
        .setDescription(`${item.description}\nPrix : ${item.price}€`);

      options.push(option);
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('shopMenu')
      .setPlaceholder('Sélectionnez un article à acheter...')
      .addOptions(options);

    const row = new ActionRowBuilder()
      .addComponents(menu);

    const embed = new EmbedBuilder()
      .setColor(config.couleurs.bleu)
      .setTitle('Boutique')
      .setDescription('Voici les articles disponibles à l\'achat :');

    for (const item of shopItems) {
      embed.addFields({
        name: `${item.name}`,
        value: `${item.description}\nPrix : ${item.price}€`
      });
    }

    await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isStringSelectMenu()) return;
      if (interaction.customId !== 'shopMenu') return;
      if (interaction.message.id !== interaction.message.id) return;

      const item = shopItems.find(i => i.id === interaction.values[0]);
      if (!item) return;

      const userBalance = await Ecodb.get(`${interaction.user.id}`) || 0;
      if (userBalance < item.price) {
        return interaction.reply({ content: `Désolé, vous n'avez pas assez d'argent pour acheter ${item.name}`, ephemeral: true });
      }

      const alreadyBought = await Shopdb.get(`${item.id}_${interaction.user.id}`);
      if (alreadyBought) {
        return interaction.reply({ content: `Vous avez déjà acheté ${item.name}`, ephemeral: true });
      }

      const subtract = userBalance - item.price;

      await Ecodb.set(`${interaction.user.id}`, subtract);
      await Shopdb.set(`${item.id}_${interaction.user.id}`, true);

      return interaction.reply({ content: `Vous avez acheté ${item.name} pour ${item.price}€`, ephemeral: true });
    });
  }
};
