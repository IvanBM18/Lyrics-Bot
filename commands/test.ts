import { ICommand } from "wokcommands";
import { Constants, MessageEmbed } from "discord.js";
import dotenv from 'dotenv'



export default {
  category:"Testing",
  description:"Testing API's and things",
  testOnly:true,
  slash:"both",
  
  callback: async ({message,text}) =>{
    return "Probando"
  }
  
} as ICommand