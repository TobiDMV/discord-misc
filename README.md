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
})

client.login(token)
```


> In your commands folder, your command should look like an object or a class with static objects. Heres an example using a file named `ping.js` in `src/commands`
```js
const { SlashCommandBuilder } = require("discord.js")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),

    /**
     * Execute function should always return interaction, and it should always be async.
     */
    async execute(interaction) {
        interaction.reply("Pong!")
        return interaction
    },

}
```

