 module.exports = {
    name: 'lcgm',
    aliases: ['luna'],

    async execute({ sock, jid }) {
      await sock.sendMessage(jid, {
        text: 'hola amor, soy el vanity-bot, un bot que programe para recordarte que te quiero bastante'
      })
    }
  }