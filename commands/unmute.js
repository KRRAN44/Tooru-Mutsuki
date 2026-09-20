const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'unmute',

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╅╅╅╅╅╅╅╅╅╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝜟 𝑸𝑼𝜤𝜮𝜨 𝑸𝑼𝜤𝜮𝑹𝜮𝑺 𝑫𝜮𝑺𝜧𝑼𝜯𝜮𝜟𝑹....\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const userToUnmute = mentioned[0];

        const targetData = participants.find(
            p => p.id === userToUnmute || p.phoneNumber === userToUnmute
        );
        const alias = [targetData?.id, targetData?.phoneNumber, userToUnmute].filter(Boolean);

        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        let estabaMuteado = false;

        for (const id of alias) {
            if (config.mutes?.[jid]?.[id]) {
                delete config.mutes[jid][id];
                estabaMuteado = true;
            }
        }

        if (!estabaMuteado) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑺𝜮 𝜧𝜣𝜨𝜣 𝜨𝜣 𝜮𝑺𝜯𝜟𝜝𝜟 𝜧𝑼𝜯𝜮𝜟𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑼𝑺𝑼𝜟𝑹𝜤𝜣 𝑫𝜮𝑺𝜧𝑼𝜯𝜮𝜟𝑫𝜣.....\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }
};