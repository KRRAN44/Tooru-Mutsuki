const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: '#despedida',
    aliases: ['#Despedida'],

    async execute({ sock, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: '❌ Este comando solo funciona en grupos.'
            });
        }

        let config = {};

        if (fs.existsSync(configPath)) {
            config = JSON.parse(
                fs.readFileSync(configPath, 'utf8')
            );
        }

        if (!config.despedidas) {
            config.despedidas = {};
        }

        const actual = config.despedidas[jid];

        if (!actual) {
            return sock.sendMessage(jid, {
                text: '❌ Primero establece una despedida con:\n!despedida Nos vemos, te vamos a extrañar 👋'
            });
        }

        actual.enabled = !actual.enabled;

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        );

        await sock.sendMessage(jid, {
            text: actual.enabled
                ? '🟢 Despedida activada.'
                : '🔴 Despedida desactivada.'
        });
    }
};