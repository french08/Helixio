const { Client, Partials, Collection, GatewayIntentBits, VoiceState, GuildMember, Guild, GuildMemberFlags } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");

// Crée un nouveau client:
const client = new Client({
  intents: [
    3276799
    /*
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
    */
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "01001100",
      type: 0
    }],
    status: 'idle'
  }
});

module.exports = client;

//  Vérifi le token du robot:
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[CRASH] Un token d'authentification pour le bot Discord est requis ! Utilisez Envrionment Secrets ou config.js.".red)
  return process.exit();
};

// Handler:
client.commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();
client.aliases = new Collection();

["prefix", "application_commands", "modals", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client);
});

// Connection pour le robot:
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Une erreur s'est produite lors de la connexion à votre bot...");
    console.error("[CRASH] Erreur de l'API Discord :" + err);
    return process.exit();
  });

// Erreur dans l'handler:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});

client.guilds.cache.forEach(guild => {
  const Jsoning = require('jsoning');
  const Guildname = guild.name;
  const Guildsdb = new Jsoning("guilds.json");
  if(Guildsdb.get(Guildname) === null) return;
  const Getguildsdb = Guildsdb.get(Guildname);
  const Teamdb = new Jsoning(`${Getguildsdb}/team.json`);
  const Timedb = new Jsoning(`${Getguildsdb}/time.json`);


  async function multiplyMoney() {
    const lastMultiplicationDate = await Timedb.get('lastMultiplicationDate');

    // Si la dernière multiplication a eu lieu il y a plus d'une semaine
    if (Date.now() - lastMultiplicationDate > 604800000) {
      const teams = await Teamdb.get('teams') || [];
      const newTeams = [];

      for (const team of teams) {
        const multiplier = Math.floor(Math.random() * 5) + 11; // Multiplie par un nombre aléatoire entre 1.1 et 1.5
        const newAmount = Math.floor(team.banque * (multiplier / 10)); // Calcul du nouveau montant
        team.banque = newAmount; // Affecte la nouvelle somme à la banque de l'équipe
        newTeams.push(team);
      }

      // Enregistre la nouvelle date de multiplication et les nouvelles équipes
      await Promise.all([
        Timedb.set('lastMultiplicationDate', Date.now()),
        Teamdb.set('teams', newTeams),
      ]);
    }
  }

  setInterval(multiplyMoney, 604800000); // Appelle la fonction toutes les semaines
});

client.on('messageCreate', async (message) => {

  const Jsoning = require('jsoning');
  const Guildname = message.guild.name;
  const Guildsdb = new Jsoning("guilds.json");
  const Getguildsdb = Guildsdb.get(Guildname);
  const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`);
  const Xpdb = new Jsoning(`${Getguildsdb}/xp.json`);

  if (message.channel.type !== 0) return;
  if (message.author.bot) return;
  if (Ecodb.get(message.author.id) == null || 0) {
    Ecodb.set(message.author.id, 1)
  }
  Ecodb.math(message.author.id, "add", 1);

  if (Xpdb.get(message.author.id) == null) {
    Xpdb.set(message.author.id, { exp: 1, level: 0 })
  }

  const baseExp = 100;
  const expMultiplier = 1.5;
  const user = message.author;
  const userData = Xpdb.get(`${user.id}`) || { exp: 0, level: 0 };
  const expToAdd = 1;
  const newExp = userData.exp + expToAdd;
  let newLevel = userData.level;
  let expNeeded = baseExp * (newLevel + 1) ** expMultiplier;
  let expneedarond = Math.round(expNeeded);

  module.exports.expneedarond = expneedarond;

  while (newExp >= expNeeded) {
    newLevel++;
    expNeeded = baseExp * (newLevel + 1) ** expMultiplier;
  }

  Xpdb.set(`${user.id}`, { exp: newExp, level: newLevel }).then(() => {
    if (userData.level !== newLevel) {
      message.reply(`Félicitations, vous êtes passé au niveau ${newLevel} !`);
      Ecodb.math(message.author.id, "add", 5000);
    }
  });
});

const Jsoning = require('jsoning');
setInterval(() => {
  client.guilds.cache.forEach(guild => {
    guild.members.cache.forEach(member => {
      const Guildname = guild.name;
      const Guildsdb = new Jsoning("guilds.json");
      const Getguildsdb = Guildsdb.get(Guildname);
      if (Getguildsdb === null) return;
      const Ecodb = new Jsoning(`${Getguildsdb}/eco.json`); // Utilisation de l'ID du serveur pour accéder au dossier correspondant

      const voiceChannel = member.voice.channel;
      if (!voiceChannel) {
        return; // Sortir de la boucle si le membre n'est pas en vocal
      }

      let status = '';
      let count = 0; // compteur pour le nombre d'options activées

      if (Ecodb.get(member.id) == null || 0) {
        Ecodb.set(member.id, 1);
      }

      if (member.voice.selfMute) {
        status += 'muté';
        count += 1;
      } else {
        status += 'non muté';
        count += 3;
      }
      if (member.voice.streaming) {
        status += ', en streaming';
        count += 4;
      }
      if (member.voice.selfVideo) {
        status += ', avec la caméra activée';
        count += 7;
      } else {
        status += ', avec la caméra désactivée';
        count += 2;
      }
      if (member.voice.selfDeaf) {
        status += ', sourd';
        count += 1;
      } else {
        status += ', non sourd';
        count += 3;
      }
      //console.log(`${member.user.tag} est connecté dans le salon vocal "${voiceChannel.name}" (${status}) sur le serveur "${guild.name}". Compte: ${count}`);
      Ecodb.math(member.user.id, "add", count);
    });
  });
}, 5000);