import { ICommand } from "wokcommands";
import { Constants, MessageEmbed, MessageFlags, MessageButton, Message  } from "discord.js";

import axios from "axios"
import * as cheerio from 'cheerio';
import ISong from "../models/SongModel";
import fs from "fs";


const baseURL = "https://api.genius.com/"
const accessHeaders = {
    headers: {
      Authorization: `Bearer ${process.env.ACCES_TOKEN}`,
    },
  } 
export default {
  name:"lyrics",
  aliases: ['l','s'],
  category:"Search",
  description:"Open Search",
  // testOnly:true,
  slash:false,
  cooldown: '3s',
  // options:[{
  //   name: 'search',
  //   description:"Term to search for",
  //   required: true,
  //   type: Constants.ApplicationCommandOptionTypes.STRING
  // }],
  error:( () => {
    return "[ERROR] Open Search Command Error]"
  }),
  
  callback: async ({message,text,channel}) =>{
    console.log("[Search Command Called]")

    if(text == "" || text == undefined){
      return "No Arguments Given"
    }else {
      // console.log("On reply")
      var params = formatText(text)
      message.reply({
        content: "Searching. . .",
        flags: [MessageFlags.FLAGS.EPHEMERAL],
        
      })
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
    let lyrics = $("#lyrics-root").find('div[data-lyrics-container*="true"]').toString()
    // fs.writeFileSync("lyrics.html", lyrics);
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
        .setTitle(data.title + " - " + data.artist_names)
        .setColor("DARK_BLUE")
        .setDescription(lyrics)
        .setImage(data.song_art_image_url || "")
        //.setFooter(data.artist_names)
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
  // lyrics = lyrics.replace(/Embed/ig,'')
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