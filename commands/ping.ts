import { ICommand } from "wokcommands";

export default {
    category:"Testing",
    description:"Replies with Pong",

    
    testOnly:true,
    
    callback: ({}) => {
        return "Pong";
    }
} as ICommand