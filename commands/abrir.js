module.exports = {
    name: 'a',
    aliases: ['abrir'],

    async execute({ sock, message, jid }) {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: 'Este comando solo funciona en grupos.' });
        }

        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants;

        // ¿Quien lo manda es admin?
        const sender = message?.key?.participant || message?.key?.remoteJid;
        const senderData = participants.find(p => p.id === sender);
        const isAdmin = senderData?.admin === 'admin' || senderData?.admin === 'superadmin';

        if (!isAdmin) {
            return sock.sendMessage(jid, { text: 'Solo admins, bro...' });
        }

        // ¿El bot es admin?
        const botNumber = sock.user.id.split(':')[0].split('@')[0];
        const botData = participants.find(p => {
            const idNumber = p.id?.split('@')[0];
            const phoneNumber = p.phoneNumber?.split('@')[0];
            return idNumber === botNumber || phoneNumber === botNumber;
        });
        const botIsAdmin = botData?.admin === 'admin' || botData?.admin === 'superadmin';

        if (!botIsAdmin) {
            return sock.sendMessage(jid, { text: 'Error, no soy admin.' });
        }
        try {
            await sock.groupSettingUpdate(jid, 'not_announcement');

            await sock.sendMessage(jid, {
                text: `┄╱͢┄┄┄┄╌╮\n.           _*ABIERTO*_\n\n> \`El grupo fue abierto, todos pueden enviar mensajes 🔓\`\n\n\n\`~Tooru Mutsuki.Bot🍀~\``
            });
        } catch (error) {
            console.error('Error al abrir el grupo:', error);

            await sock.sendMessage(jid, { text: 'No pude abrir el grupo 😕' });
        }
    }
};