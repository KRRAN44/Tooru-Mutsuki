const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const MAX_WARNS = 4;

module.exports = {
    name: 'warn',
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
                text: '❌ Menciona a la persona que quieres advertir.\n\nEjemplo: !warn @usuario'
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
                text: `⚠️ Advertencia añadida. Va en ${nuevo}/${MAX_WARNS}.`
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
                text: '❌ Llegó al límite de advertencias, pero no soy administrador y no puedo expulsarlo.'
            });
        }

        try {
            await sock.groupParticipantsUpdate(jid, [userToWarn], 'remove');

            await sock.sendMessage(jid, {
                text: '✅ El usuario llegó al límite de advertencias y fue expulsado.'
            });
        } catch (error) {
            console.error('Error al expulsar por warns:', error);

            await sock.sendMessage(jid, {
                text: '❌ Llegó al límite de advertencias, pero no pude expulsarlo.'
            });
        }
    }
};