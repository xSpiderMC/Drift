const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./Commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log('')
        console.log("No commands to be loaded!")
        return;
    }

    console.log(``)
    console.log(`Loading ${jsfiles.length} commands!`)

    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("message", async message => {
   if(message.content === botSettings.token){
            message.delete(0);
        }
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length))
    if(cmd) cmd.run(bot, message, args);
    
})



bot.on("ready", async () => {
    console.log(``)
    console.log(`${bot.user.username} is at your service.`)
    console.log(``)
    console.log("Ready to begin! Serving in " + bot.guilds.size + " guilds.")
    console.log(``)
    console.log(bot.commands)
    bot.user.setPresence({ status: 'online', game: { name: 'in ' + bot.guilds.size + ' servers.' } })
    
});

bot.login(botSettings.token);
