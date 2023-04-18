
const client = require("../index");
const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");
const colors = require("colors");

module.exports = (client, config) => {
/*
  console.log("0------------------| Gestionnaire de commandes d'application :".blue);

  let commands = [];

  // Slash commands handler:
  fs.readdirSync('./commands/slash/').forEach((dir) => {
    console.log('[!] Chargement des commandes slash...'.yellow);
    const SlashCommands = fs.readdirSync(`./commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      if (pull.name, pull.description, pull.type == 1) {
        client.slash_commands.set(pull.name, pull);
        console.log(`[HANDLER - SLASH] A chargé : ${pull.name} (#${client.slash_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
        });

      } else {
        console.log(`[HANDLER - SLASH] Impossible de charger le fichier ${file}, la valeur du nom de module manquant, la description ou le type n'est pas de type 1.`.red)
        continue;
      };
    };
  });

  // User commands handler:
  fs.readdirSync('./commands/user/').forEach((dir) => {
    console.log('[!] Début du chargement des commandes utilisateur...'.yellow);
    const UserCommands = fs.readdirSync(`./commands/user/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/user/${dir}/${file}`);

      if (pull.name, pull.type == 2) {
        client.user_commands.set(pull.name, pull);
        console.log(`[HANDLER - USER] A chargé : ${pull.name} (#${client.user_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          type: pull.type || 2,
        });

      } else {
        console.log(`[HANDLER - USER] Impossible de charger le fichier ${file}, la valeur du nom du module manquant ou le type n'est pas de type 2.`.red)
        continue;
      };
    };
  });

  // Message commands handler:
  fs.readdirSync('./commands/message/').forEach((dir) => {
    console.log('[!] Début du chargement des commandes de message...'.yellow);
    const UserCommands = fs.readdirSync(`./commands/message/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/message/${dir}/${file}`);

      if (pull.name, pull.type == 3) {
        client.message_commands.set(pull.name, pull);
        console.log(`[HANDLER - MESSAGE] A chargé: ${pull.name} (#${client.user_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          type: pull.type || 3,
        });

      } else {
        console.log(`[HANDLER - MESSAGE] Impossible de charger le fichier ${file}, la valeur du nom du module manquant ou le type n'est pas de type 2.`.red)
        continue;
      };
    };
  });

  // Registering all the application commands:
  if (!config.Client.ID) {
    console.log("[CRASH] Vous devez fournir votre ID de bot dans config.js !".red + "\n");
    return process.exit();
  };

  const rest = new REST({ version: '10' }).setToken(config.Client.TOKEN || process.env.TOKEN);

  (async () => {
    console.log('[HANDLER] Commencé à enregistrer toutes les commandes de l\'application.'.yellow);

    try {
      await rest.put(
        Routes.applicationCommands(config.Client.ID),
        { body: commands }
      );

      console.log('[HANDLER] Enregistrement réussi de toutes les commandes d\'application.'.brightGreen);
    } catch (err) {
      console.log(err);
    }
  })();
*/
};
