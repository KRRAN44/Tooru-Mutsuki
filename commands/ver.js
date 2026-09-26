module.exports = {
    name: 'ver',
    aliases: ['readviewonce', 'read'],

    async execute({ sock, message, jid }) {
        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quotedMessage = contextInfo?.quotedMessage;

        if (!quotedMessage) {
            return sock.sendMessage(jid, {
                text: 'Responde a una imagen o video de una sola vista con *ver*.'
            });
        }

        // Los mensajes de una sola vista pueden estar anidados dentro de
        // viewOnceMessage, viewOnceMessageV2 o ephemeralMessage.
        let content = quotedMessage;
        while (content?.ephemeralMessage?.message ||
               content?.viewOnceMessage?.message ||
               content?.viewOnceMessageV2?.message ||
               content?.viewOnceMessageV2Extension?.message) {
            content = content.ephemeralMessage?.message ||
                content.viewOnceMessage?.message ||
                content.viewOnceMessageV2?.message ||
                content.viewOnceMessageV2Extension?.message;
        }

        const mediaType = content?.imageMessage
            ? 'imageMessage'
            : content?.videoMessage
                ? 'videoMessage'
                : null;

        if (!mediaType) {
            return sock.sendMessage(jid, {
                text: 'El mensaje respondido no es una imagen o video compatible.'
            });
        }

        try {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const mediaMessage = {
                key: {
                    remoteJid: jid,
                    id: contextInfo.stanzaId,
                    participant: contextInfo.participant,
                    fromMe: false
                },
                message: quotedMessage
            };
            const media = await downloadMediaMessage(mediaMessage, 'buffer', {});

            if (!media) {
                return sock.sendMessage(jid, {
                    text: 'No pude descargar el contenido. Intenta responder directamente al mensaje de una sola vista.'
                });
            }

            const mediaContent = content[mediaType];
            const caption = mediaContent.caption || '';
            const payload = mediaType === 'imageMessage'
                ? { image: media, caption }
                : { video: media, caption };

            await sock.sendMessage(jid, payload, { quoted: message });
        } catch (error) {
            console.error('Error al recuperar el mensaje de una sola vista:', error);
            await sock.sendMessage(jid, {
                text: 'No pude descargar el contenido. Intenta responder directamente al mensaje de una sola vista.'
            });
        }
    }
};
