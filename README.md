# `discord-misc` :boom:
## Getting started

> :black_square_button: = Done
>
> :white_square_button: = Either in development, or unfinished.
>
> If any of this documentation is confusing, you should probably check out [discord-misc-template](https://github.com/TobiDMV/discord-misc-template) to get an idea on how this is used in action.

<br>
<br>

### Installation :part_alternation_mark:
> `npm install https://github.com/TobiDMV/discord-misc.git`
>
> If you would like an example of this library in action, go checkout [discord-misc-template](https://github.com/TobiDMV/discord-misc-template)
> or run `git clone https://github.com/TobiDMV/discord-misc-template.git ./discord-bot-name`

<br>
<br>

### Todo :dart:
> - #### `Buttons`
> > - :white_square_button: Attatch button listener to an easy button creator
> > - :white_square_button: Create button id parser (to link buttons to specifc actions)
> - #### `ClientManager`
> > - :white_square_button: find the commands folder without needing `__dirname` argument
> > - :white_square_button: finish [discord-vc](https://github.com/TobiDMV/discord-vc) and create tools for it here
> > - :white_square_button: Create a default sqlite3 database abstraction for saving information
> > - :white_square_button: Link database abstraction to ClientManager, and create links that can are interchangeable with other methods so other users can add their databases and still make use of the library.
> > - ##### `ClientManager.interactions`
> > > - :white_square_button: Add button listening functionality.
> > > - :white_square_button: Add `interactions.post` method
<br>
<br>

### `ClientManager` :memo:

<br>

> :black_square_button: `ClientManager.constructor(client: discordjs.Client, { blacklisted: string[], developers: string[] })`
```js
let manager = new ClientManager(client, {
    blacklisted: [], //List of userids
    developers: [] //List of userids
})

```

<br>

> :black_square_button: `ClientManager.loadCommands(...paths) => void` *This command loads a folder of commands to memory and saves the data from the slash commands to send to the discord api in `ClientManager.publish()`. Until i find a better solution, if there is one, `__dirname` will need to be passed through so it can find the path to your commands folder. Otherwise it will try and draw from `discord-misc` project directory tree. To avoid that, use the below code.*
```js
manager.loadCommands(__dirname, "/path_to_commands_folder") 
```

<br>

> :black_square_button: `ClientManager.addCommand(SlashCommandBuilder, executeFunction) => void` *this adds a command that would need to be loaded at the beginning, and couldnt be loaded from a file for whatever reason*
```js
// I honestly dont recommend doing it this way, i added it just in case i ever needed to add a command while running
// but i dont think this is the best way to load them in, using ClientManager.loadCommands is peak.
manager.addCommand(
    new discordjs.SlashCommandBuilder()
        .setName("example")
        .setDescription("example"),
    async function (interaction) {
        interaction.reply("Hello world")
        return interaction
    }
)
```
> :black_square_button: `ClientManager.publish() => Promise` *this method publishes the slash command data to the discord api*
```js
client.on(Events.ClientReady, async() => {
    await manager.publish()
})
```

<br>

> :white_square_button: `ClientManager.addButton(name, execute)` *No snippet available because its unfinished. When this is done, it will allow buttons to be executed. But i am considering making a button parser object that generates button ids anyways. So, i dont believe it will neccesarily be required.*

<br>

> :black_square_button: `ClientManager.blacklisted: Array<String>` *list of userids that can not use interactions listed in the bot*
```js
//You can add to the blacklist from the ClientManager.constructor, or you can use the below code
manager.blacklisted.push("user_id_1", "user_id_2")
```

<br>

> :black_square_button: `clientManager.developers: Array<string>` *list of userids that trigger discord.js `interaction.developer=true` before passing the discord.js `interaction` to the `command.execute(interaction)`, this is a wrapper so the official discord.js library will not reflect `interaction.developer unless you use this library*. The same code used in the previous example applies to this one as well.

<br>
<br>

#### `ClientManager.interactions`
> :black_square_button: `ClientManager.interactions.pre(...async (interaction) => interacton)`
> *its important to make sure you return the interaction. `interactions.pre` should also go after the on `Events.ClientReady` event, but before `interaction.listen()` is ran*
```js
/**
 * This code allows for you to add embedSenders, data savers, loggers, whatever, it accepts as many functions as
 * you want, and runs all of them. This all gets passed to the interaction object that goes into command.execute().
 * Then, from your command you can access any of the functions you write here. 
 */

manager.interactions.pre(interaction => {
    interaction.doMath = (num, num2) => num * num2
    return interaction
})
```

<br>

> :white_square_button: `ClientManager.interactions.post(...async (interaction) => interaction)` *No snippet because its unfinished, but when it is this will fire off after the command and button checks are ran, which will allow you to add other stuff after the command is finished. This will mostly only be useful for logging i feel, as you could save data about commands there. But this also receives the same object as the other interaction functions. So it will have all things you add in `ClientManager.interactions.pre` and `command.execute`*

<br>

> :black_square_button: `ClientManager.interactions.listen() => void`
> *this creates a new event listener in the discordjs client that lets the slash commands and buttons fire off, this should be directly after `ClientManager.
```js
manager.interactions.listen()
```