const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'warnlist',
    aliases: ['Warnlist'],

    async execute({ sock, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: '❌ Este comando solo funciona en grupos.'
            });
        }

        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const warns = config?.warns?.[jid] || {};
        const usuarios = Object.keys(warns);

        if (usuarios.length === 0) {
            return sock.sendMessage(jid, {
                text: '✅ Nadie tiene advertencias en este grupo.'
            });
        }

        const lista = usuarios
            .map(id => `• @${id.split('@')[0]} — ${warns[id]}/4`)
            .join('\n');

        await sock.sendMessage(jid, {
            text: `📋 *Advertencias en este grupo:*\n\n${lista}`,
            mentions: usuarios
        });
    }
};