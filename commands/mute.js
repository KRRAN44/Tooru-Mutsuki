const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'mute',

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
                text:  `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜣𝑳𝜣 𝜟𝑫𝜧𝜤𝜨𝑺 𝜝𝑹𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const mentioned =
            message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentioned || mentioned.length === 0) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝜟 𝑸𝑼𝜤𝜮𝜨 𝑸𝑼𝜤𝜮𝑹𝜮𝑺 𝜧𝑼𝜯𝜮𝜟𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const userToMute = mentioned[0];

        // Guardamos todos los ids que WhatsApp conozca de esta persona
        const targetData = participants.find(
            p => p.id === userToMute || p.phoneNumber === userToMute
        );
        const alias = [targetData?.id, targetData?.phoneNumber, userToMute].filter(Boolean);

        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        if (!config.mutes) config.mutes = {};
        if (!config.mutes[jid]) config.mutes[jid] = {};

        for (const id of alias) {
            config.mutes[jid][id] = true;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑪𝜟𝑳𝑳𝜮𝑺𝜮 𝜮𝑳 𝜢𝜣𝑺𝜤𝑪𝜣... 𝑼𝑺𝑼𝜟𝑹𝜤𝜣 𝜧𝑼𝜯𝜮𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }
};