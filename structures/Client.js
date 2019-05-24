'use strict'

const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo')
const { join } = require('path')
const config = require('../config')

class Client extends AkairoClient {
  constructor () {
    super({
      // discord-akairo options
      ownerID: config.ownerID
    }, {
      // discord.js options
      disableEveryone: true
    })

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      aliasReplacement: /-/g,
      prefix: config.prefix,
      allowMention: true,
      fetchMembers: true,
      defaultCooldown: 2500,
      commandUtil: true
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners')
    })

    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    })
    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
  }

  async start () {
    return this.login(config.token)
  }
}
module.exports = Client
