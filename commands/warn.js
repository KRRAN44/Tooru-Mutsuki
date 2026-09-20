const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const MAX_WARNS = 4;

module.exports = {
    name: 'warn',
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
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝑸𝑼𝜤𝜮𝜨 𝑸𝑼𝜤𝜮𝑹𝜟𝑺 𝜟𝑫𝑽𝜮𝑹𝜯𝜤𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const userToWarn = mentioned[0];

        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        if (!config.warns) config.warns = {};
        if (!config.warns[jid]) config.warns[jid] = {};

        const nuevo = (config.warns[jid][userToWarn] || 0) + 1;
        const llegoAlLimite = nuevo >= MAX_WARNS;

        if (llegoAlLimite) {
            delete config.warns[jid][userToWarn];
        } else {
            config.warns[jid][userToWarn] = nuevo;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        if (!llegoAlLimite) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n⚠️ 𝜟𝑫𝑽𝜮𝑹𝜯𝜮𝜨𝑪𝜤𝜟 𝜟Ñ𝜟𝑫𝜤𝑫𝜟${nuevo}/${MAX_WARNS}.\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        const botNumber = sock.user.id.split(':')[0].split('@')[0];
        const botData = participants.find(p => {
            const idNumber = p.id?.split('@')[0];
            const phoneNumber = p.phoneNumber?.split('@')[0];
            return idNumber === botNumber || phoneNumber === botNumber;
        });
        const botIsAdmin =
            botData?.admin === 'admin' ||
            botData?.admin === 'superadmin';

        if (!botIsAdmin) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑳𝑳𝜮𝑮𝜣 𝜟𝑳 𝑳𝜤𝜧𝜤𝜯𝜮, 𝜬𝜮𝑹𝜣 𝜨𝜣 𝜧𝜮 𝜢𝜟𝜨 𝑫𝜟𝑫𝜣 𝜟𝑫𝜧𝜤𝜨...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        try {
            await sock.groupParticipantsUpdate(jid, [userToWarn], 'remove');

            await sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜮 𝜬𝜣𝑹𝜯𝜟𝜝𝜟 𝜧𝜟𝑳.....\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        } catch (error) {
            console.error('Error al expulsar por warns:', error);

            await sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑳𝑳𝜮𝑮𝜣 𝜟𝑳 𝑳𝜤𝜧𝜤𝜯𝜮 𝜬𝜮𝑹𝜣 𝑺𝑼𝑪𝜮𝑫𝜤𝜣 𝑼𝜨 𝜮𝑹𝑹𝜣𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }
    }
};