const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, '../config.json')

module.exports = {
    name: '#bienvenida',
    aliases: ['#Bienvenida'],

    async execute({ sock, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: '❌ Este comando solo funciona en grupos.'
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
                text: '❌ Primero establece una bienvenida con:\n!bienvenida Hola bienvenido 👋'
            })
        }

        actual.enabled = !actual.enabled

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        )

        await sock.sendMessage(jid, {
            text: actual.enabled
                ? '🟢 Bienvenida activada.'
                : '🔴 Bienvenida desactivada.'
        })
    }
}