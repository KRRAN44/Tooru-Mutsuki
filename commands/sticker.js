const sharp = require('sharp');

module.exports = {
    name: 'sticker',
    aliases: ['s'],

    async execute({ sock, message, jid }) {
        const { downloadMediaMessage } = await import('@whiskeysockets/baileys');

        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quoted = contextInfo?.quotedMessage;

        // Mensaje del que hay que sacar la imagen: el actual, o el citado
        const mediaMessage = quoted
            ? { key: message.key, message: quoted }
            : message;

        const tieneImagen = mediaMessage.message?.imageMessage;

        if (!tieneImagen) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑹𝜮𝑺𝜬𝜣𝜨𝑫𝜮 𝑼𝜨𝜟 𝜤𝜧𝜟𝑮𝜮𝜨 𝑪𝜣𝜨 !𝑺 𝜣 !𝑺𝜯𝜤𝑪𝜥𝜮𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜨𝜣 𝑺𝜮 𝜬𝑼𝜮𝑫𝜮 𝜢𝜟𝑪𝜮𝑹 𝑺𝜯𝜤𝑪𝜥𝜮𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }
    }
}; 