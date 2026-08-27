module.exports = {
    name: 'menu',
    aliases: ['Menu'],

    async execute({ sock, jid }) {
      await sock.sendMessage(jid, {
         text: `ॐᤢꪶ🦥꯭〻𝚳 ͢𝚵 𝚴 ͢𝐔\n┏━━━━┓\n┃\n┃\n┃\n┃\n┃\n┃\n┃\n┗━━━┛╰ꪶ͢   𓁼`
      })
    }
  }