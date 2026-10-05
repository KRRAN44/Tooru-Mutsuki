const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'contador',
    aliases: ['activos', 'stats', 'count'],

    async execute({ sock, message, jid }) {
        // Solo funciona en grupos
        if (!jid.endsWith('@g.us')) {
            return await sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜠𝜣𝑺𝜮 𝑪𝜣𝜧𝜟𝜨𝑫𝜣 𝑺𝜣𝑳𝜮 𝑭𝑼𝜨𝑪𝜤𝜣𝜨𝜟 𝜮𝜨 𝑮𝑹𝑼𝜫𝜣𝑺!!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }

        try {
            // Cargar el archivo de activos
            const activosPath = path.join(__dirname, '../activos.json');
            let activos = {};
            
            if (fs.existsSync(activosPath)) {
                activos = JSON.parse(fs.readFileSync(activosPath, 'utf8'));
            }

            // Combinar los mensajes registrados con todos los miembros actuales.
            // Quienes todavía no tienen mensajes en activos.json empiezan en 0.
            const metadata = await sock.groupMetadata(jid);
            const datosGrupo = activos[jid] || {};
            const usuarios = (metadata.participants || [])
                .map(participante => participante.id)
                .filter(Boolean)
                .map(usuario => [usuario, Number(datosGrupo[usuario]) || 0])
                .sort((a, b) => b[1] - a[1]);

            if (usuarios.length === 0) {
                return await sock.sendMessage(jid, {
                    text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜤𝜨 𝑴𝜤𝜮𝜧𝜝𝑹𝜣𝑺 𝜮𝜨 𝜮𝑳 𝑮𝑹𝑼𝜫𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
                });
            }

            const LIMITE = 30;
            let mensaje = `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n📊 *𝜧𝑺𝑮 𝑪𝜣𝑼𝜨𝜯...*\n*𝑳𝜤𝜧𝜤𝜯𝜮: ${LIMITE}*\n*Miembros del grupo: ${usuarios.length}*\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;

            const mentions = [];
            
            for (const [usuario, cantidad] of usuarios) {
                const advertencia = cantidad < LIMITE ? ' ⚠️' : '';
                mensaje += `@${usuario.split('@')[0]} • ${cantidad}${advertencia}\n`;
                mentions.push(usuario);
            }

            mensaje += `\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`;

            await sock.sendMessage(jid, {
                text: mensaje,
                mentions: mentions
            });

        } catch (error) {
            console.error('Error en contador:', error);
            
            await sock.sendMessage(jid, {
                text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑹𝜣𝑹 𝜟𝑳 𝜮𝑳𝜤𝜧𝜤𝜨𝜟𝑹..\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
            });
        }
    }
};
