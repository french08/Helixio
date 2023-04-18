const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require("../../config/config.js");

module.exports = {
    name: 'setskin',
    description: 'Définir le skin d\'utilisateur',
    category: "💰・Econnomie",

    run: async (client, message, args) => {

        const Jsoning = require('jsoning');
        const Guildname = message.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const Skindb = new Jsoning(`${Getguildsdb}/skin.json`);

        // Définir le chemin du dossier "perso"
        const persoFolder = path.join(__dirname, '..', '..', 'perso');

        // Lister les fichiers dans le dossier "perso"
        fs.readdir(persoFolder, async (err, files) => {
            if (err) {
                console.error(err);
                return;
            }

            // Filtrer les fichiers pour ne garder que les images
            const imageFiles = files.filter(file => {
                const extension = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png'].includes(extension);
            });

            // Trie les fichiers par ordre alphabétique
            imageFiles.sort();

            // Traiter chaque fichier d'image
            const skins = imageFiles.map(imageFile => {

                // Construire le chemin complet du fichier d'image
                const imagePath = path.join(persoFolder, imageFile);

                return {
                    name: imageFile,
                    attachment: imagePath
                };
            });

            // Envoyer un message demandant de choisir un skin
            const embed = new EmbedBuilder()
                .setTitle('Choisir un skin')
                .setDescription('Réagissez avec les flèches pour sélectionner un skin')
                .setColor(config.couleurs.bleu);

            const msg = await message.channel.send({ embeds: [embed] });
            await msg.react('⬅️');
            await msg.react('✅');
            await msg.react('➡️');

            let index = 0;

            const filter = (reaction, user) => ['⬅️', '✅', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            const collector = msg.createReactionCollector({ filter, time: 60000 });

            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name === '⬅️') {
                    index--;
                } else if (reaction.emoji.name === '➡️') {
                    index++;
                } else if (reaction.emoji.name === '✅') {

                    // Enregistrer l'utilisateur et le skin sélectionnés dans un fichier JSON
                    await Skindb.set(`${message.author.id}`, skins[index].name);

                    const skinEmbed = new EmbedBuilder()
                        .setTitle('Skin sélectionné')
                        .setDescription(`Le ${skins[index].name} a bien été sélectionné !`)
                        .setColor(config.couleurs.bleu)
                        .setImage(`attachment://${skins[index].name}`);

                    await msg.edit({ embeds: [skinEmbed], files: [skins[index]] });
                    return collector.stop();
                }

                // Vérifier si l'index est valide
                if (index < 0) {
                    index = skins.length - 1;
                } else if (index >= skins.length) {
                    index = 0;
                }

                // Modifier l'embed avec l'image du skin sélectionné
                const skinEmbed = new EmbedBuilder()
                    .setTitle('Choisir un skin')
                    .setDescription(`Réagissez avec les flèches pour sélectionner un skin\n\nSkin sélectionné : ${skins[index].name}`)
                    .setColor(config.couleurs.bleu)
                    .setImage(`attachment://${skins[index].name}`);

                await msg.edit({ embeds: [skinEmbed], files: [skins[index]] });
                await reaction.users.remove(message.author.id);
            });

            collector.on('end', async (collected, reason) => {
                await msg.reactions.removeAll();

                if (reason === 'time') {
                    const endEmbed = new EmbedBuilder()
                        .setTitle('Sélection de skin terminée')
                        .setDescription(`Le temps imparti pour sélectionner un skin est écoulé.`)
                        .setColor(config.couleurs.bleu);

                    await msg.edit({ embeds: [endEmbed] });
                    return;
                }
            });

        });
    }
};