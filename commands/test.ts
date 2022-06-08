import { ICommand } from "wokcommands";
import { MessageEmbed, MessageActionRow, MessageButton  } from "discord.js";
import dotenv from 'dotenv'

import axios from "axios"
import * as cheerio from 'cheerio';


const testURL = "https://genius.com/Los-mesoneros-el-paraiso-lyrics"
const baseURL = "https://api.genius.com/search?q="
const acces = process.env["ACCES_TOKEN"]
export default {
  category:"Testing",
  description:"Testing API's and things",
  testOnly:true,
  slash:"both",
  
  
  callback: async ({message,text,channel,interaction}) =>{
    if(interaction != undefined){
      interaction.reply("Search Done!")
    }
    let res = await axios.get(testURL)
    let data = res.data
    
    const $ = cheerio.load(data)
    let lyrics = $("#lyrics-root").find("div").first().toString();
    lyrics = formatLyrics(lyrics)

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId("Back")
        .setEmoji("⬅️")
        .setLabel("Back")
        .setStyle("PRIMARY")
      )
    
    const embedMsg = new MessageEmbed()
        .setTitle("El Paraiso")
        .setColor("DARK_BLUE")
        .setDescription(lyrics + "\n" + formatSearch(text))
        .setFooter("Los Mesoneros") .setImage("https://images.genius.com/89d7f06ec29cb66d5bc0ca9ec30ae9e1.640x640x1.jpg")

    if(message?.channel){
      message.channel.send({
        embeds:[embedMsg],
        components:[row]
      })
    }else {
      channel.send({
        embeds:[embedMsg],
        components:[row]
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

const formatSearch = (search : string) =>{
  return encodeURIComponent(search)
}