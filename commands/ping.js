   module.exports = {
    name: 'ping',
    aliases: ['p'],

    async execute({ sock, jid, message }) {
      const inicio = Date.now()

      await sock.sendMessage(jid, {
        text: '─   ┄᪶    ┄    ┄    ┄᪶    ┄   ─\n🏷 *Tooru Mutsuki* conectado correctamente\n─   ┄᪶    ┄    ┄    ┄᪶    ┄   ─'
      })

      const ping = Date.now() - inicio

      await sock.sendMessage(jid, {
        text: `
┌ ┄ ┄ ͢┄┘ꪶ🎋ꫂ└ ┄ ┄ ┐\n┇ ⌛ꫂ 𝐏𝐈𝐍𝐆 : ${ping} 𝑚𝑠\n─   ┄᪶    ┄    ┄    ┄᪶    ┄   ─
        `
      }, {
        quoted: message
      })
    }
  }