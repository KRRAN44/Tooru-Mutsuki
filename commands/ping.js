   module.exports = {
    name: 'ping',
    aliases: ['p'],

    async execute({ sock, jid, message }) {
      const inicio = Date.now()

      await sock.sendMessage(jid, {
        text: '🏷 *Vanity-Bot* conectado correctamente'
      })

      const ping = Date.now() - inicio

      await sock.sendMessage(jid, {
        text: `\n⏱️ Tiempo de respuesta: ${ping} ms`
      }, {
        quoted: message
      })
    }
  }