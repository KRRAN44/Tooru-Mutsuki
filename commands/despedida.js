const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'despedida',
    aliases: ['Despedida','bye'],

    async execute({ sock, jid, args }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: '❌ Este comando solo funciona en grupos.'
            });
        }

        const texto = args.trim();

        if (!texto) {
            return sock.sendMessage(jid, {
                text: '❌ Usa:\n!despedida Nos vemos, te vamos a extrañar 👋'
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
            
┌ ┄ ┄ ͢┄┘ꪶ🎋ꫂ└ ┄ ┄ ┐\n\n╭🍓ꫂ ╴ ${texto}\n┇       𠖱̷̸   𝐒𝒕 : 𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾 🫰\n─   ┄᪶    ┄    ┄    ┄᪶    ┄   ─
            
            `
        });
    }
};