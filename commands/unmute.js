const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'unmute',

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: '❌ Este comando solo funciona en grupos.'
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
                text: '❌ Solo los administradores pueden usar este comando.'
            });
        }

        const mentioned =
            message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentioned || mentioned.length === 0) {
            return sock.sendMessage(jid, {
                text: '❌ Menciona a la persona que quieres desmutear.\n\nEjemplo: !unmute @usuario'
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
                text: '⚠️ Ese usuario no está muteado.'
            });
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(jid, {
            text: '🔊 Usuario desmuteado.'
        });
    }
};