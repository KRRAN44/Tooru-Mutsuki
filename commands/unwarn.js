const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'unwarn',

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text:  `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants;

        const sender = message?.key?.participant || message?.key?.remoteJid;
        const senderData = participants.find(p => p.id === sender);
        const isAdmin =
            senderData?.admin === 'admin' ||
            senderData?.admin === 'superadmin';

        if (!isAdmin) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜣𝑳𝜣 𝜟𝑫𝜧𝜤𝜨𝑺 𝜝𝑹𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const mentioned =
            message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentioned || mentioned.length === 0) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝜟 𝑸𝑼𝜤𝜮𝜨 𝑸𝑼𝜤𝜮𝑹𝜟𝑺 𝑸𝑼𝜤𝜯𝜟𝑹𝑳𝜮 𝜟𝑫𝑽𝜮𝑹𝜯𝜮𝜨𝑪𝜤𝜟𝑺...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const userToUnwarn = mentioned[0];

        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const actual = config?.warns?.[jid]?.[userToUnwarn] || 0;

        if (actual <= 0) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑺𝜮 𝜧𝜣𝜨𝜣 𝜮𝑺𝜯𝜟 𝑳𝜤𝜧𝜬𝜤𝜣 𝑫𝜮 𝑾𝜟𝑹𝜨𝑺\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const nuevo = actual - 1;

        if (nuevo === 0) {
            delete config.warns[jid][userToUnwarn];
        } else {
            config.warns[jid][userToUnwarn] = nuevo;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟𝑫𝑽𝜮𝑹𝜯𝜮𝜨𝑪𝜤𝜟 𝑹𝜮𝜧𝜣𝑽𝜤𝑫𝜟.. ${nuevo}/4\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`

        });
    }
};