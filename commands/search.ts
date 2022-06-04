import { ICommand } from "wokcommands";
import { Constants, MessageEmbed } from "discord.js";
import axios from "axios"


const initOptions = {
  method: 'GET',
  url: 'https://api.lyrics.ovh/v1/',
};

export default {
  category:"Search",
  description:"Given arguments realizes a search",
  testOnly:true,
  slash:"both",
  options:[
   {
    name: 'song',
    description:"Song's Title",
    required: true,
    type: Constants.ApplicationCommandOptionTypes.STRING
  }, 
  {
    name: 'singer',
    description:"Song's Artist/Singer",
    required: true,
    type: Constants.ApplicationCommandOptionTypes.STRING
  }],
  callback: async ({message,text ,interaction}) =>{
    try{
      
      const {options} = interaction
      const songName = encodeURIComponent( options.getString("song")!)
      const artistName = encodeURIComponent(options.getString("singer")!)
      
      if(songName === "" || artistName === ""){
        return ""
      }
      
      let searchOpts = {...initOptions, url: initOptions.url + artistName + "/"+ songName}
      //console.log(searchOpts)
      let resp = await axios.request(searchOpts)
      //console.log(resp.data)
      const lyrics = resp.data.lyrics
      
      const embedMsg = new MessageEmbed()
        .setTitle(songName!)
        .setColor("DARK_BLUE")
        .setDescription(lyrics)
        .setFooter(artistName!)
  
      return embedMsg
    }catch (err){
      console.log(err)
      return 
    }
    
  }
  
} as ICommand