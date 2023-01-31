


class Interactions {
    constructor() {
        this.preFunctions = []
    }

    /**
     * The pre command works like a command, so you should accept and return the Interaction in your callbacks as the argument AND return value
     * @param  {...(interaction: import("discord.js").Interaction)=>import("discord.js").Interaction} cbs 
     */
    pre(...cbs) {
        this.preFunctions.push(...cbs)
    }
}

module.exports = {
    Interactions
}