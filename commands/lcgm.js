 module.exports = {
    name: 'lcgm',
    aliases: ['luna'],

    async execute({ sock, jid }) {
      await sock.sendMessage(jid, {
        text: `hola amorcito soy el vanity bot, programe este bot para decirte que te quiero muchisimo`
      })
    }
  }