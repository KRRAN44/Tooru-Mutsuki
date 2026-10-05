const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'Rcontador',
    aliases: ['reiniciarcontador', 'resetearcontador'],

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, {
                text: 'Este comando solo funciona en grupos.'
            });
        }

        try {
            const metadata = await sock.groupMetadata(jid);
            const sender = message?.key?.participant || message?.key?.remoteJid;
            const senderData = metadata.participants.find(p => p.id === sender);
            const isAdmin = senderData?.admin === 'admin' || senderData?.admin === 'superadmin';

            if (!isAdmin) {
                return sock.sendMessage(jid, {
                    text: 'Solo los administradores pueden reiniciar el contador.'
                });
            }

            const activosPath = path.join(__dirname, '../activos.json');
            let activos = {};

            if (fs.existsSync(activosPath)) {
                activos = JSON.parse(fs.readFileSync(activosPath, 'utf8'));
            }

            // Reinicia solo el grupo donde se ejecuta el comando.
            activos[jid] = {};
            fs.writeFileSync(activosPath, JSON.stringify(activos, null, 2), 'utf8');

            return sock.sendMessage(jid, {
                text: '✅ Se reinició la lista del contador. Los mensajes nuevos empezarán a contarse desde 0.'
            });
        } catch (error) {
            console.error('Error al reiniciar el contador:', error);
            return sock.sendMessage(jid, {
                text: 'No se pudo reiniciar el contador. Revisa la consola del bot.'
            });
        }
    }
};
