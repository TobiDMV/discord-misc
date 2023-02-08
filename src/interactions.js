const { Events, BaseInteraction } = require("discord.js")

class Interactions {
    /**
     * @param {import("./ClientManager.js").ClientManager} ClientManager Client 
     */
    constructor(ClientManager) {
        this.ClientManager = ClientManager
        this.preFunctions = []
    }

    /**
     * The pre command works like a command, so you should accept and return the Interaction in your callbacks as the argument AND return value
     * @param  {...(interaction: import("discord.js").Interaction)=>import("discord.js").Interaction} cbs 
     */
    pre(...cbs) {
        this.preFunctions.push(...cbs)
    }

    async listen() {
        this.ClientManager.client.on(Events.InteractionCreate, async (interaction) => {
            if (this.ClientManager.blacklisted.includes(interaction.user.id)) { return }
            if (this.ClientManager.developers.includes(interaction.user.id)) { interaction.developer = true }

            let lastInteraction = interaction

            for (let funct of this.preFunctions) {
                let newInteraction = await funct(lastInteraction)
                
                if (newInteraction instanceof BaseInteraction) {
                    lastInteraction = newInteraction
                } else {
                    console.error("Error: Please pass interaction object back through pre callback")
                }
            }

            if (interaction.isButton()) {
                return //No current functionality for buttons, that will come when i add the database
                /**
                 * May add functionality for a customId parser, in which it handles things completely automatically based on the ID thats assigned to it, that way a database integration is unneeded.
                 */
            }

            if (interaction.isCommand()) {
                try {
                    await this.ClientManager.commands.get(interaction.commandName)(lastInteraction)
                } catch (CommandError) {
                    console.error(CommandError)
                }
            }
        })
    }
}

module.exports = {
    Interactions
}