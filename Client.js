const { Client, Collection } = require("discord.js");
const fs = require("fs");
const { token } = require("./config.json");

module.exports = class BotClient extends Client {
  constructor() {
    super({ disableMentions: "everyone" });
    this.commands = new Collection();

    this.on("ready", () => {
      console.log(`Logged in as ${this.user.username}`);
    });

    this.on("message", (message) => {
      const prefix = "G!";

      if (!message.content.startsWith(prefix) || message.author.bot) return;
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();

      if (!this.commands.has(command)) return;

      try {
        this.commands.get(command).execute(this, message, args);
      } catch (error) {
        message.channel.send(
          `An error occured while executing that command Error: ${error}`
        );
      }
    });
  }

  loadCommands() {
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      this.commands.set(command.name, command);
    }
  }

  start() {
    this.loadCommands();
    super.login(token);
  }
};
