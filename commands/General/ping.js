const { EmbedBuilder } = require("discord.js"); 

module.exports = {

  name: "ping",
  description: "Réponds avec pong !",
  category: "❓・Information",
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message) => {

    message.reply("test");

    message.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`🏓 **Pong!** Ping du client : \`${client.ws.ping}\` ms.`)
        .setColor("Green")
    ] })
    
  },
};
