const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'warnlist',
    aliases: ['Warnlist'],

    async execute({ sock, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜨𝜟𝑫𝜤𝜮 𝑪𝜣𝜨 𝜟𝑫𝑽𝜮𝑹𝜯𝜮𝜨𝑪𝜤𝜟𝑺, 𝜯𝜣𝑫𝜣𝑺 𝑺𝜟𝜨𝜤𝜯𝜣𝑺\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const lista = usuarios
            .map(id => `• @${id.split('@')[0]} — ${warns[id]}/4`)
            .join('\n');

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑫𝑽𝜮𝑹𝜯𝜮𝜨𝑪𝜤𝜟𝑺...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n${lista}`,
            mentions: usuarios
        });
    }
};