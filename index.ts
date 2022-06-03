import DiscordJs, { Intents } from 'discord.js'
import WOKcommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const client = new DiscordJs.Client({
    intents:[
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    restGlobalRateLimit:5,
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

client.login(process.env["TOKEN"])
const mySecret = process.env['TOKEN']