import DiscordJs, { Intents } from 'discord.js'
import WOKcommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

console.log("-----Loading Bot----")
dotenv.config()
//Return embed msg with, link to spotify, Portrait Artist Name
//Song Title

//OTgyMzUyNTU3NzQ3ODY3Njg5.G9kDND.j3VzoUHPq0RCZbiZdRYg_C37rX_X8g9klP7j8o

//APIS
//Genius API HJP TAN MAS DIFICIL AAAA
//AzLyric (Most songs)
//SpotLyrics
//Elyrics.net

//Known Bugs
//If song mispelled, search fails
//The weeknd doesn´t appear
//Songs that use accento dont appear
//Search for otheer ways to get the lyrics
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
        testServers: [guildId]
    })
    .setDefaultPrefix("=");
    console.log("-----Commands Loaded----");
})

client.login(process.env.DISCORD_TOKEN)

