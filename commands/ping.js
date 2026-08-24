  module.exports = {
    name: 'ping',
    aliases: ['p'],

    async execute({ sock, jid }) {
      await sock.sendMessage(jid, {
        text: 'Pong 🏓'
      })
    }
  }