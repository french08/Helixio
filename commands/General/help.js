const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config.js");

module.exports = { 
    
    name: 'help',
    description: "Obtenez la liste de toutes les commandes et apprenez même à connaître les détails de chaque commande.",
    category: "❓・Information",
    botPermission: [], 
    authorPermission: [], 
    ownerOnly: false,
    usage: "<cmd>",
    aliases: ["cmd","h"],
       run: async (client, message, args) => { 
           
         if (args[0]) { 
            const command = await client.commands.get(args[0]); 

            if (!command) { 
                return message.channel.send("**Commande inconnu:** " + args[0]); 
            }

            const embed = new EmbedBuilder() 
                .setAuthor({ name: command.name, icon_url: client.user.displayAvatarURL() }) 
                .addFields({ name: ">  Description", value: command.description || "Non fourni"}) 
                .addFields({ name: "> Usage", value: "`" + command.usage + "`" || "Non fourni"})
                .addFields({ name: "> Aliases", value:  "`" + command.aliases + "`" || "Non fourni"})
                .addFields({ name: "> Catégorie", value: "`" + command.category + "`" || "Non fourni"})
                .addFields({ name: "> Bot permission", value: "`" + command.botPermission + "`" || "Non fourni"})
                .addFields({ name: "> Auteurs permission", value: "`" + command.authorPermission + "`" || "Non fourni" })
                .setTimestamp()
                .setColor(config.couleurs.bleu) 
                .setFooter({ text: "Je suis en cours de développement." }); 
            
            return message.channel.send({ embeds: [embed] }); 
        } else { 

            const commands = await client.commands.values(); 
            
            let emx = new EmbedBuilder() 
                .setColor(config.couleurs.bleu) 
                .setFooter({ text: `J'ai ${client.commands.size} commandes !`, icon_url: client.user.displayAvatarURL() }) 
                .setTimestamp()
            
            let com = {}; 

        for (let comm of commands) { 
        let category = comm.category || "🥸・Inconnu"; 
        let name = comm.name; 
        if (!com[category]) { 
        com[category] = []; 
        } 
        com[category].push(name); 
        } 
 

			for(const [key, value] of Object.entries(com)) {  
				let desc = "`" + value.join("`, `") + "`"; 
                
				if (key == "🔞・nsfw") {
					if (message.channel.nsfw) {
						emx.addFields({ name: `${key.toUpperCase()}`, value: desc });
					}
				} else if (key == "🧑‍💻・owner") {
					if (config.Users.OWNERS.includes(message.author.id)) {
						emx.addFields({ name:`${key.toUpperCase()}`, value: desc });
					}
				} else {
					emx.addFields({ name: `${key.toUpperCase()}`, value: desc }); 
				}
			}  

            return message.channel.send({ embeds:[emx] }) 
            
        }     
    } 
};