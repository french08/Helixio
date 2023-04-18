const { EmbedBuilder } = require("discord.js");
const Jsoning = require("jsoning");
const ms = require("parse-ms");
const config = require("../../config/config.js");

module.exports = {

    name: "daily",
    category: "💰・Econnomie",
    description: "Vous donne une récompense aléatoire entre 100 et 1500 coins toutes les 8 heures.",
    usage: "",

    run: async (client, message, args) => {

        const Jsoning = require('jsoning');
        const Guildname = message.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);
        const Timedb = new Jsoning(`${Getguildsdb}/time.json`);

        let user = message.author;

        let timeout = 28800000; // 8 heures en millisecondes
        let minAmount = 100;
        let maxAmount = 1500;
        let amount = Math.round(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

        let daily = await Timedb.get(`daily_${user.id}`);

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));

            let timeEmbed = new EmbedBuilder()
                .setColor(config.couleurs.rouge)
                .setDescription(
                    `❌ | Vous avez déjà récupéré votre récompense quotidienne\n\nRécupérez-la à nouveau dans ${time.hours}h ${time.minutes}m ${time.seconds}s`
                );
            message.channel.send({ embeds: [timeEmbed] });
        } else {
            let moneyEmbed = new EmbedBuilder()
                .setColor(config.couleurs.bleu)
                .setDescription(
                    `✅ | Vous avez récupéré votre récompense quotidienne elle est de ${amount}€`
                );
            message.channel.send({ embeds: [moneyEmbed] });

            Ecodb.math(user.id, "add", amount);
            Timedb.set(`daily_${user.id}`, Date.now());
        }
    },
};
