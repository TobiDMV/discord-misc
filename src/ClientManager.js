const { Collection, REST, Routes, Client, SlashCommandBuilder } = require("discord.js")
const { homedir } = require("os")
const path = require("path")
const fs = require("fs")
const { assert } = require("console")
const { Interactions } = require("./interactions")

class ClientManager {
    /**
     * 
     * @param {import("discord.js").Client} client
     * @param {Object} config
     * @param {string[]} [config.blacklisted=[]]
     * @param {string[]} [config.developers=[]]
     */
    constructor(client, config={}) {
        this.blacklisted = config.blacklisted ? config.blacklisted : []
        this.developers = config.developers ? config.developers : []

        /**
         * @type {Client}
         */
        this.client = client
        this.commands = new Collection()
        this.guildCommands = new Collection()
        
        this.exclusion = config.exclusion ? config.exclusion : []
        /**
         * @private
         */
        this.commandsData = []

        /**
         * @private
         */
        this.guildCommandsData = new Collection()

        this.interactions = new Interactions()
    }

    /**
     * 
     * @param {Object} config 
     * @param {...string} paths
     * @remarks One way to use this could be .loadCommands(__dirname, "/src/commands")
     * @remarks It automatically joins paths together so no need to worry about that.
     * @remarks Be sure to provide a Data key, and an Execute key in your object for the command.
     */
    loadCommands(...paths) {
 
        let commandsFolderPath = path.join(...paths)

        let commandsPaths = fs.readdirSync(commandsFolderPath).filter(file => file.endsWith(".js"))

        commandsPaths.forEach(fileName => {
            
            let cmd = require(path.join(commandsFolderPath, fileName))

            let objKeys = Object.keys(cmd)

            /**
             * These two lines check to see if the command has the proper parameters in it
             */
            //assert(cmd.data instanceof SlashCommandBuilder)
            //assert(objKeys.includes("execute"))
            if (!cmd.data || !cmd.execute) {
                throw new Error("Missing required data and execute key in " + path.join(commandsFolderPath, fileName))
            }
            /**
             * setGuildCommands iterates over the list of guilds in the command, and then adds the JSON to a Collection of guilds. This will be used in the publisher function
             */
            let setGuildCommands = () => {
                 if (!this.commands.get(cmd.data.name)) {

                    cmd.guilds.forEach(guild => {
                        let commandDataArray = this.guildCommandsData.get(guild)

                        if (commandDataArray) {
                            commandDataArray.push(cmd.data.toJSON())
                        } else {
                            this.guildCommandsData.set(guild, [cmd.data.toJSON()])
                        }

                    })
                 } else {
                    console.warn(`${cmd.data.name} Not registered because it has the same name as a non-guild command`)
                 }
            }
            

            if (cmd.guilds) {
                assert(cmd.guilds instanceof Array)
                setGuildCommands()
                return
            } else {
                this.commandsData.push(cmd.data.toJSON())
            }

            this.commands.set(cmd.data.name, cmd.execute)
        })

    }

    publishCommands() {
        return new Promise(async (resolve, reject) => {
            let rest = this.client.rest

            let resolveGuildCommands = async () => {
                let requests = []

                let requestExecutor = (commands, guild) => {
                    return async () => {
                        return await rest.put(Routes.applicationGuildCommands(this.client.application.id, guild), { body: commands })
                    }
                }

                this.guildCommandsData.forEach((commands, guild) => {
                    requests.push(requestExecutor(commands, guild))
                })

                for (let request of requests) {
                    await request()
                }
                return
            }

            let resolveApplicationCommands = async () => {
                return await rest.put(Routes.applicationCommands(this.client.application.id), { body: this.commandsData })
            }

            await resolveApplicationCommands()
            await resolveGuildCommands()
            delete this.guildCommandsData
            delete this.commandsData
            resolve()
        })
    }

    /**
     * The command should return the interaction, that way you can use ClientManager.post(), if it does not, any post clauses will for said interaction.
     * @param {SlashCommandBuilder} scb 
     * @param {()=>import("discord.js").Interaction} exec 
     */
    addCommand(scb, exec) {
        assert(scb instanceof SlashCommandBuilder)
        if (this.exclusion.includes(scb.name)) {
            console.warn(`${scb.name} Is on the exclusion list.`)
            return
        }

        this.commandsData.push(scb.toJSON())
        this.commands.set(scb.name, exec)
    }
}

module.exports = {
    ClientManager
}