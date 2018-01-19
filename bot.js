const botconfig = require("./botconfig.json");
const Discord =  require("discord.js");

const bot =  new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log("works")
  bot.user.setGame("op SchaapieNetwork")
});


bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    // Help Command
    if(cmd === `${prefix}help`){
      message.channel.send("Help aan het versturen..").then(msg => {msg.delete(3000)}).catch(console.error);
      return message.author.send("```!help - Verstuurd de commands van de bot.\n!serverinfo - Geeft je de informatie van de server.\n!botinfo - Verstuurt informatie over de bot.\n!nick [new nickname] - Verandert de naam van de bot.\n!report [user] [reason] - Verstuurt een bericht naar de staff met de reason en speler.```");
    }

    // Serverinfo command
    if(cmd === `${prefix}serverinfo`){
      let serverembed =  new Discord.RichEmbed()
      .setDescription("__**Server Informatie**__")
      .setColor("#ff0000")
      .addField("Eigenaren:", "Mex (ScheepiePower), Jelle (SchaapieLive)")
      .addField("Staff:", "sneakyywoof")
      .addField("Members:", message.guild.memberCount);
      return message.channel.send(serverembed);
    }

    // Botinfo command
    if(cmd === `${prefix}botinfo`){
      let botembed =  new Discord.RichEmbed()
      .setDescription("__**Bot Informatie**__")
      .setColor("#ff0000")
      .addField("Developer:", "Mex (ScheepiePower)")
      .addField("Created On:", "01/13/2018")
      .addField("Joined this server at:", "01/14/2018");
      return message.channel.send(botembed);
    }

    // report command
    if(cmd === `${prefix}report`){
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!rUser) return message.channel.send("Kan de speler niet vinden.").then(msg => {msg.delete(3000)}).catch(console.error);
      let reason = args.join(" ").slice(22);

      let reportEmbed = new Discord.RichEmbed()
      .setDescription("__**Report**__")
      .setColor("#ff0000")
      .addField("Reported User:", `${rUser}`)
      .addField("Reported By:", `${message.author}`)
      .addField("Reason:", reason)
      .addField("Reported at:", message.createdAt);

      let reportsChannel = message.guild.channels.find(`name`, "reports");
      reportsChannel.send(reportEmbed);

      return;
    }

    //Nick command
    if(cmd === `${prefix}nick`){
      if(message.member.roles.some(r=>["Owner", "Admin", "Developer", "Moderator"].includes(r.name)) ) {
        message.guild.members.get(bot.user.id).setNickname(message.content.replace("!nick ", ""));
        return message.channel.send("Changed my nickname.").then(msg => {msg.delete(3000)}).catch(console.error);
      }
         if(!message.member.roles.some(r=>["Owner", "Admin", "Developer", "Moderator"].includes(r.name)) ) {
           return;
         }
    }


});

bot.on("guildMemberAdd", async (member, guild) => {
  let memberrole = member.guild.roles.find("name", "Member")
  member.addRole(memberrole).catch(console.error);
});

bot.login(process.env.BOT_TOKEN);
