let { EmbedBuilder } = require('discord.js');
let config = require("../../config/config.js");

module.exports = {
        name: "removelevel",
        description: "Retire des niveaux",
        category: "🧑‍💻・owner",
        permissions: ["SendMessages","ManageGuild"],
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
        const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);

        const baseExp = 100;
        const expMultiplier = 1.5;
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const userData = db.get(user.id) || { exp: 0, level: 0 };

        if (!user) {
            message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Erreur")
                    .setDescription(`Veuillez mentionner une personne ou mettre un id valide !`)
                    .setColor(config.couleurs.rouge)
            ]});
            return;
        }

        const amount = parseInt(args[1]);

        if (isNaN(amount) || amount <= 0) {
            message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Erreur")
                    .setDescription(`Veuillez mettre un montant valide !`)
                    .setColor(config.couleurs.rouge)
            ]});
            return;
        }

        if (!Xpdb.has(user.id)) {
            message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Erreur")
                    .setDescription(`Cet utilisateur n'a pas d'expérience !`)
                    .setColor(config.couleurs.rouge)
            ]});
            return;
        } else {
            const maxToRemove = userData.level;
            if (amount > maxToRemove) {
                message.reply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Erreur")
                        .setDescription(`Vous ne pouvez retirer que ${maxToRemove} niveaux maximum !`)
                        .setColor(config.couleurs.rouge)
                ]});
                return;
            }
            let levelsToRemove = amount;
            if (amount > userData.level) {
                levelsToRemove = userData.level;
            }
            userData.level -= levelsToRemove;

            let expNeeded = baseExp * (userData.level + 1) ** expMultiplier;

            while (userData.exp < 0) {
                userData.level--;
                userData.exp += expNeeded;
                expNeeded = baseExp * (userData.level + 1) ** expMultiplier;
            }

            Xpdb.set(user.id, userData);

            await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Retrait de niveaux")
                    .setDescription(`Retrait de ${levelsToRemove} niveau(x) à <@${user.id}>\nNouveau niveau: ${Math.ceil(userData.level)}\nNouvelle xp: ${Math.ceil(userData.exp)} / ${Math.ceil(expNeeded)}`)
                    .setColor(config.couleurs.bleu)
            ]});
        }
    }    
};
