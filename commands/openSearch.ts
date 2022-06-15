import { ICommand } from "wokcommands";
import { MessageEmbed, MessageActionRow, MessageButton, Message  } from "discord.js";

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
  name:"Open Search",
  aliases: ['l'],
  category:"Search",
  description:"Open Search",
  testOnly:true,
  slash:false,
  hidden:true,
  
  error:( () => {
    return "[ERROR] Open Search Command Error]"
  }),
  
  callback: async ({message,text,channel,interaction}) =>{
    console.log("[Search Comand Called]")
    // if(interaction == undefined){
    //   interaction.reply("Search Done!")
    // }
    if(text == ""){
      return "No Arguments Given"
    }
    const params = formatText(text)
    let data = await getData(baseURL + "search?q=" +params) as ISong
    // console.log(data)
    // console.log(data.url)
    // console.log(data.lyrics_state)
    if(data.lyrics_state != "complete"){
      return "No se encontro la letra buscada"
    }
    if(data.apple_music_id == null){
      return "Letra no encontrada"
    }
    let lyricsHtml = await (await axios.get(data.url)).data
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
  let formatedLyrics = ""
  formatedLyrics = lyrics.replace(/<br>/g, "\n");
  formatedLyrics = formatedLyrics.replace(/(<([^>]+)>)/ig, '');
  return formatedLyrics
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