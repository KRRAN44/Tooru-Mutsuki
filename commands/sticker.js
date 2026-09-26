const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

module.exports = {
    name: 'sticker',
    aliases: ['s'],

    async execute({ sock, message, jid }) {
        const { downloadMediaMessage } = await import('@whiskeysockets/baileys');

        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quoted = contextInfo?.quotedMessage;

        // Mensaje del que hay que sacar el media: el actual, o el citado
        const mediaMessage = quoted
            ? { key: message.key, message: quoted }
            : message;

        const tieneImagen = mediaMessage.message?.imageMessage;
        const tieneVideo = mediaMessage.message?.videoMessage;
        const tieneGif = mediaMessage.message?.gifMessage;

        if (!tieneImagen && !tieneVideo && !tieneGif) {
            return sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\nResponde una imagen, video o GIF con !s o !sticker\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        try {
            const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {});

            // Usar ffmpeg para TODO (imágenes, videos, GIFs)
            const webp = await procesarMediaAWebp(buffer, tieneImagen);

            await sock.sendMessage(jid, { sticker: webp });
        } catch (error) {
            console.error('Error creando sticker:', error);

            await sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\nNo se puede hacer sticker de esto...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }
    }
};

// Función para convertir cualquier media (imagen/video/GIF) a WebP con ffmpeg
async function procesarMediaAWebp(buffer, esImagen) {
    const inputPath = path.join(__dirname, `../temp_input_${Date.now()}.tmp`);
    const outputPath = path.join(__dirname, `../temp_output_${Date.now()}.webp`);

    try {
        // Guardar buffer como archivo temporal
        fs.writeFileSync(inputPath, buffer);

        // Usar ffmpeg para convertir a WebP
        // Para imágenes: convierte directamente
        // Para videos/GIFs: convierte a WebP animado
        const comando = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:black" -loop 0 -vcodec libwebp -y "${outputPath}" 2>/dev/null`;

        await execAsync(comando, { timeout: 30000 });

        // Leer el archivo generado
        const webpBuffer = fs.readFileSync(outputPath);

        // Limpiar archivos temporales
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        return webpBuffer;
    } catch (error) {
        // Limpiar si hay error
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        throw new Error(`Error al procesar media: ${error.message}`);
    }
} 