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

            // Obtener los datos del grupo actual
            const datosGrupo = activos[jid] || {};
            
            if (Object.keys(datosGrupo).length === 0) {
                return await sock.sendMessage(jid, {
                    text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜤𝜨 𝑫𝜟𝜯𝜣𝑺 𝑫𝜮 𝜧𝜤𝜮𝜧𝜝𝑹𝜣𝑺...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
`
                });
            }

            // Ordenar por cantidad de mensajes (descendente)
            const usuarios = Object.entries(datosGrupo)
                .sort((a, b) => b[1] - a[1]);

            const LIMITE = 30;
            let mensaje = `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n📊 *𝜧𝑺𝑮 𝑪𝜣𝑼𝜨𝜯...*\n*𝑳𝜤𝜧𝜤𝜯𝜮: ${LIMITE}*\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;

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
