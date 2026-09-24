const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, '../config.json')

module.exports = {
    name: '#antilink',
    aliases: ['#Antilink', '#AntiLink'],

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            })
        }

        const metadata = await sock.groupMetadata(jid)
        const participants = metadata.participants

        const sender = message?.key?.participant || message?.key?.remoteJid
        const senderData = participants.find(p => p.id === sender)
        const isAdmin =
            senderData?.admin === 'admin' ||
            senderData?.admin === 'superadmin'

        if (!isAdmin) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜣𝑳𝜣 𝜟𝑫𝜧𝜤𝜨𝑺 𝜝𝑹𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            })
        }

        let config = {}
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        }

        if (!config.antilink) config.antilink = {}
        if (!config.antilink[jid]) config.antilink[jid] = { enabled: false }

        config.antilink[jid].enabled = !config.antilink[jid].enabled

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

        await sock.sendMessage(jid, {
            text: config.antilink[jid].enabled
                ? `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑪𝜯𝜤𝑽𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
                : `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑫𝜮𝑺𝜟𝑪𝜯𝜤𝑽𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        })
    }
}