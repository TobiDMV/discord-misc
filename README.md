# Discord-Misc

> Hello World! Discord-Misc is a library with miscellaneous discord tools to ease getting quickly started with a discord bot. The purpose is to add quality of life wrappers over discord.js current objects.

## Installation
```npm install github.com/link_to_repo```

## Getting started

### ClientManager
> ClientManager object makes it easy to load commands from a folder, as well as add commands if youd like. This will also contain all Pre-Interaction code.
> Down below is an example on how to use the client manager, as well as notes about the specific functions of it.
```js
const { Client, IntentsBitField, Events } = require("discord.js")
const { ClientManager } = require("discord-misc") 

let token = ""

/**
 * These are optional opts for the ClientManagerOpts instance, it defaults to an empty object
 */
let ClientManagerOpts = {
    blacklisted: ["ids", "to", "blacklist"],
    developers: ["ids", "for", "developers"]
}

client.on(Events.ClientReady, async () => {
    let cm = ClientManager(client, ClientManagerOpts)
    
    //This loads the commands from the file, i use __dirname
    cm.loadCommands(__dirname, "/src/commands")
    
    //This runs the commands to ou
    await cm.publishCommands()

    //This starts the listener for discord.js's Events.InteractionCreate 
    cm.interactions.listen() 
})

client.login(token)
```
### ClientManager.interactions
```js
let cm = new ClientManager(client, { developers: ["your_id"] })

client.onReady(Events.ClientReady, async () => {
    cm.loadCommands(__dirname, "/src/commands")
    await cm.publishCommands()

    /**
     * This takes the interaction and manipulates it, adding an interaction.sendEmbed 
     * function that can now be used inside any command, this same syntax and arguments works for ClientManager.interaction.post
     * but ClientManager.interaction.post happens after the pre functions, and the command/button is ran, this is useful in the 
     * event that your building something that needs say, saved data. You could save data after the command finishes, every time 
     * a command is ran.  
     */
    cm.interactions.pre(async interaction => {
        
        interaction.sendEmbed = message => {
            interaction.channel.send({embeds: [new EmbedBuilder.setDescription(message)]}) //require("discord.js").EmbedBuilder
        }

        return interaction //Remember to return your interaction, and make your function async, if you plan to use this functionality! The same goes for commands.
    })

})
```


### Commands Folder
> In your commands folder, your command should look like an object or a class with static objects. Heres an example using a file named `ping.js` in `src/commands`
```js
const { SlashCommandBuilder } = require("discord.js")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),

    /**
     * Execute function should ALWAYS RETURN interaction, and it should always be ASYNC.
     */
    async execute(interaction) {
        interaction.reply("Pong!")
        return interaction
    },

}
```

