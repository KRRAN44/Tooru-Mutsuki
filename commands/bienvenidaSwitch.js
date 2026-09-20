const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, '../config.json')

module.exports = {
    name: '#bienvenida',
    aliases: ['#Bienvenida'],

    async execute({ sock, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            })
        }

        let config = {}

        if (fs.existsSync(configPath)) {
            config = JSON.parse(
                fs.readFileSync(configPath, 'utf8')
            )
        }

        if (!config.bienvenidas) {
            config.bienvenidas = {}
        }

        const actual = config.bienvenidas[jid]

        if (!actual) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑮𝑹𝜮𝑮𝜟 𝜯𝜮𝜲𝜯𝜣 𝜟 𝑳𝜟 𝜝𝜤𝜮𝜨𝑽𝜮𝜨𝜤𝑫𝜟\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            })
        }

        actual.enabled = !actual.enabled

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        )

        await sock.sendMessage(jid, {
            text: actual.enabled
                ? `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑪𝜯𝜤𝑽𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
                : `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑫𝜮𝑺𝜟𝑪𝜯𝜤𝑽𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
`
        })
    }
}