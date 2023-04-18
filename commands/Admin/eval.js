const Discord = require('discord.js')
const client = require("../../index.js");
const { Client, EmbedBuilder } = require('discord.js');
const { inspect } = require('util');
const config = require('../../config/config.js');

module.exports = {

    name: 'eval',

    usage: "",

    description: "Évalue n'importe quelle chaîne en tant que code javascript et l'exécute.",

    category: "🧑‍💻・owner",

    botPermission: [],

    authorPermission: [],

    owner: true,

    aliases: [],

    run: async (client, message, args) => {

        const Jsoning = require('jsoning');
        const Guildname = message.guild.name;
        const Guildsdb = new Jsoning("guilds.json");
        const Getguildsdb = Guildsdb.get(Guildname);
        const prefixDb = new Jsoning(`${Getguildsdb}/prefix.json`);
        const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);
        const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);
        const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);
        const Shopdb = new Jsoning(`${Getguildsdb}/shop.json`);
        const Timedb = new Jsoning(`${Getguildsdb}/time.json`);
        const Skindb = new Jsoning(`${Getguildsdb}/skin.json`);


        const command = args.join(" ");

        if (!command) return message.channel.send("Vous devez écrire une commande")



        let words = ["token", "owners"]

        if (words.some(word => message.content.toLowerCase().includes(word))) {

            return message.channel.send("Ce mot est sur la liste noire !")

        }



        const evaled = eval(command)

        const embed = new Discord.EmbedBuilder()

            .setColor(config.couleurs.vert)

            .setTitle("Évaluer correctement !")

            .addFields({ name: `**Type:**`, value: `\`\`\`prolog\n${typeof (evaled)}\`\`\``, inline: true })

            .addFields({ name: "**Evalué en :**", value: `\`\`\`yaml\n${Date.now() - message.createdTimestamp} ms\`\`\``, inline: true })

            .addFields({ name: "**Entrée**", value: `\`\`\`js\n${command}\`\`\`` })

            .addFields({ name: "**Sortie**", value: `\`\`\`js\n${inspect(evaled, { depth: 0 })} \`\`\`` })



        message.channel.send({ embeds: [embed] });





    }
};