import { Constants, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import axios from "axios"


const initOptions = {
  method: 'GET',
  url: 'https://api.lyrics.ovh/v1/',
};

export default {
  name:"search",
  category:"Search",
  description:"Alternative Search: Given arguments realizes a search",
  testOnly:true,
  slash:true,
  options:[
  {
    name: 'song',
    description:"Song's Title",
    required: true,
    type: Constants.ApplicationCommandOptionTypes.STRING
  }, 
  {
    name: 'artist',
    description:"Song's Artist/Singer",
    required: true,
    type: Constants.ApplicationCommandOptionTypes.STRING
  }],
  callback: async ({message,text ,interaction}) =>{
    console.log("[AlterSearch Comand Called]")
    return "Command No longer available"
    try{
      
      const {options} = interaction
      const songName =  options.getString("song")!
      const artistName = options.getString("artist")!
      
      if(songName === "" || artistName === ""){
        return "[ERROR]"
      }
      
      let searchOpts = {...initOptions, url: initOptions.url + encodeURIComponent(artistName) + "/"+ encodeURIComponent(songName)}
      //console.log(searchOpts)
      let resp = await axios.request(searchOpts)
      //console.log(resp.data)
      const lyrics = resp.data.lyrics
      console.log(lyrics)
      const embedMsg = new MessageEmbed()
        .setTitle(songName!)
        .setColor("DARK_BLUE")
        .setDescription(lyrics)
        .setFooter(artistName!)
      
      message.reply({
        embeds:[embedMsg]
      })
    }catch (err){
      console.log(err)
      return "No Lyrics where Found"
    }
    
  }
  
} as ICommand