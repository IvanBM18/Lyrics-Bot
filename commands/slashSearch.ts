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
  
  callback: async ({message,text,channel,interaction}) =>{
    console.log("[Search Command Called]")
    let flag = true
    // if(interaction == undefined){
    //   interaction.reply("Search Done!")
    // }
    if(interaction != undefined){
      const {options} = interaction
      var params  =  formatText(options.getString("search")!)
      flag = false
    }
    if(text == "" || text == undefined){
      return "No Arguments Given"
    }else if(flag){
      // console.log("On reply")
      var params = formatText(text)
      message.reply({
        content: "Searching. . .",
      })
    }
    let data = await getData(baseURL + "search?q=" +params!) as ISong
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
    let lyrics = $("#lyrics-root").find("div").first().toString();
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
  return lyrics
}

const formatText = (search : string) =>{
  return encodeURIComponent(search)
}

const getData = async (url: string) : Promise<ISong> => {
  let res = await axios.get(url,accessHeaders);
  let data = res.data.response.hits[0].result
  data = await axios.get(baseURL + "songs/" + data.id,accessHeaders)
  let rSong = data.data.response.song as ISong
  return rSong
};