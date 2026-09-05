const sharp = require('sharp');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'sticker',
    aliases: ['s'],

    async execute({ sock, message, jid }) {
        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quoted = contextInfo?.quotedMessage;

        // Mensaje del que hay que sacar la imagen: el actual, o el citado
        const mediaMessage = quoted
            ? { key: message.key, message: quoted }
            : message;

        const tieneImagen = mediaMessage.message?.imageMessage;

        if (!tieneImagen) {
            return sock.sendMessage(jid, {
                text: '❌ Envía una imagen con el comando !sticker, o responde a una imagen con !sticker.'
            });
        }

        try {
            const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {});

            const webp = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toBuffer();

            await sock.sendMessage(jid, { sticker: webp });
        } catch (error) {
            console.error('Error creando sticker:', error);

            await sock.sendMessage(jid, {
                text: '❌ No pude convertir esa imagen en sticker.'
            });
        }
    }
}; 