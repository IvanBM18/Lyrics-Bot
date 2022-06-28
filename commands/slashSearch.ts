import { ICommand } from "wokcommands";
import { Constants, MessageEmbed, MessageActionRow, MessageButton, Message  } from "discord.js";

import axios from "axios"
import * as cheerio from 'cheerio';
import ISong from "../models/SongModel";


const baseURL = "https://api.genius.com/"
const accessHeaders = {
    headers: {
      Authorization: `Bearer ${process.env.ACCES_TOKEN}`,
    },
  } 
export default {
  name:"search",
  aliases:["search"],
  category:"Search",
  description:"Open Slash Search",
  testOnly:true,
  slash:true,
  // cooldown: '5s',
  options:[{
    name: 'search',
    description:"Term to search for",
    required: true,
    type: Constants.ApplicationCommandOptionTypes.STRING
  }],
  error:( () => {
    return "[ERROR] Open Search Command Error]"
  }),
  
  callback: async ({message,channel,interaction}) =>{
    console.log("[Slash Search Command Called]")
    if(interaction != undefined){
      const {options} = interaction
      var params  =  formatText(options.getString("search")!)
      interaction.reply("Searching...")
      // message.reply({
      //   content: "Searching. . .",
      // })
    }
    
    let data = await getData(baseURL + "search?q=" +params!) as ISong
    if(data == undefined){
      return "Lyrics not found"
    }
    // console.log(data)
    // console.log(data.url)
    // console.log(data.lyrics_state)
    if(data.lyrics_state != "complete"){
      return "Lyrics not found"
    }
    if(data.apple_music_id == null){
      return "Lyrics not found"
    }
    let res = await axios.get(data.url)
    let lyricsHtml = res.data
    const $ = cheerio.load(lyricsHtml)
    let lyrics = $("#lyrics-root").find('div[data-lyrics-container*="true"]').toString();
    lyrics = formatLyrics(lyrics)
    
    // const row = new MessageActionRow()
    //   .addComponents(
    //     new MessageButton()
    //     .setCustomId("Back")
    //     .setEmoji("⬅️")
    //     .setLabel("Back")
    //     .setStyle("PRIMARY")
    //   )
    
    //console.log(data)
    const embedMsg = new MessageEmbed()
        .setTitle(data.title)
        .setColor("DARK_BLUE")
        .setDescription(lyrics)
        .setFooter(data.artist_names) .setImage(data.song_art_image_url || "")
    if(message?.channel){
      message.channel.send({
        embeds:[embedMsg],
      })
    }else {
      channel.send({
        embeds:[embedMsg]
      })
    }
    
  }
  
} as ICommand

const formatLyrics = (lyrics : string) =>{
  lyrics = lyrics.replace(/<br>/g, "\n");
  lyrics = lyrics.replace(/(<([^>]+)>)/ig, '');
  // lyrics = lyrics.replace(/embed/ig,'')
  return lyrics
}

const formatText = (search : string) =>{
  return encodeURIComponent(search)
}

const getData = async (url: string) : Promise<ISong | undefined> => {
  let res = await axios.get(url,accessHeaders);
  let data;
  try{
    data = res.data.response.hits[0].result
  }catch{
    return undefined
  }
  data = await axios.get(baseURL + "songs/" + data.id,accessHeaders)
  let rSong = data.data.response.song as ISong
  return rSong
};