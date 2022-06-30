import DiscordJs, { Intents } from 'discord.js'
import WOKcommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

console.log("-----Loading Bot----")
dotenv.config()

//APIS
//Genius TAN MAS DIFICIL AAAA


//Known Bugs
//Search for otheer ways to get the lyrics


//TO DO
//Optimize cheerio search(try SOLO ) Done!
//Delete Searching... on response
//Alternate Method to get the lyrics

const client = new DiscordJs.Client({
    intents:[
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    restGlobalRateLimit:5,
    failIfNotExists:false,
    
})


client.on("ready", () =>{
    console.log("-----Bot is Ready------")
    const guildId = "981621115573121055"
    new WOKcommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript:true,
        testServers: [guildId, "664663736275042325"]
    })
    .setDefaultPrefix("=");
    console.log("-----Commands Loaded----");
})

client.login(process.env.DISCORD_TOKEN)

