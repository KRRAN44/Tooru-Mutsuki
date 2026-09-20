const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'despedida',
    aliases: ['Despedida','bye'],

    async execute({ sock, jid, args }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const texto = args.trim();

        if (!texto) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑮𝑹𝜮𝑮𝜟 𝜯𝜮𝜲𝜯𝜣 𝜟 𝑳𝜟 𝑫𝜮𝑺𝜬𝜮𝑫𝜤𝑫𝜟\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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

        config.despedidas[jid] = {
            text: texto,
            enabled: true
        };

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        );

        await sock.sendMessage(jid, {
            text: `
            
┌ ┄ ┄ ͢┄┘ꪶ🎋ꫂ└ ┄ ┄ ┐\n\n╭🍓ꫂ ╴ ${texto}\n┇              𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾 🫰\n─   ┄᪶    ┄    ┄    ┄᪶    ┄   ─
            
            `
        });
    }
};