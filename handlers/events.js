const fs = require("fs");
const colors = require("colors");

module.exports = (client) => {
  console.log("0------------------| Events Handler:".blue);
  
  fs.readdirSync('./events/').forEach(dir => {
		const events = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of events) {
      
			let pull = require(`../events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
				console.log(`[HANDLER - EVENTS] A chargé: ${pull.name}`.brightGreen)
			} else {
				console.log(`[HANDLER - EVENTS] Impossible de charger le fichier ${file}. nom ou alias manquant.`.red)
				continue;
			}
      
		}
	});
}
