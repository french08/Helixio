let { EmbedBuilder } = require('discord.js');
let config = require("../../config/config.js");
let expneedarond = require("../../index.js");

module.exports = {

    name: "addlevel",
    description: "Ajoute de l'xp à la personne mentionner.",
    category: "🧑‍💻・owner",

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
        const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);

        const baseExp = 100;
        const expMultiplier = 1.5;
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        const userData = Xpdb.get(user.id) || { exp: 0, level: 0 };

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

        const amount = parseInt(args[1]);

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

        if (!Xpdb.has(user.id)) {
            Xpdb.set(user.id, { exp: amount, level: 0 });
        } else {
            userData.exp += amount;
            Xpdb.set(user.id, userData);
        }

        let expNeeded = baseExp * (userData.level + 1) ** expMultiplier;

        while (userData.exp >= expNeeded) {
            userData.level++;
            userData.exp -= expNeeded;
            expNeeded = baseExp * (userData.level + 1) ** expMultiplier;
        }

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ajout d'experience")
                    .setDescription(`Ajout de ${amount.toFixed(2)}xp à <@${user.id}>\nNouvelle xp: ${userData.exp} / ${expNeeded}`)
                    .setColor(config.couleurs.bleu)
            ]
        });
    }
};
