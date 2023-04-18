const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "myModal",
    run: async (client, interaction) => {

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Les models fonctionnent ! Voici ce que vous avez tapé : ' + interaction.fields.getTextInputValue('something'))
            ],
            ephemeral: true
        });

    },
};
