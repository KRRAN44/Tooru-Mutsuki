const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
    name: 'unwarn',

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
                text: '❌ Menciona a la persona a la que quieres quitarle una advertencia.\n\nEjemplo: !#warn @usuario'
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
                text: '⚠️ Ese usuario no tiene advertencias.'
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
            text: `✅ Advertencia removida. Va en ${nuevo}/4.`
        });
    }
};