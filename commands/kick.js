module.exports = { name: 'kick', aliases: ['a-chingar-a-su-madre', 'GG-te-fuiste'],
async execute({ sock, message, jid }) {

    // Solo funciona en grupos
    if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, {
            text: '❌ Este comando solo funciona en grupos.'
        });
    }

    // Obtener metadata del grupo
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    // Obtener quién ejecutó el comando
    const sender = message.key.participant || message.key.remoteJid;

    // Buscar al usuario que ejecutó el comando
    const senderData = participants.find(
        p => p.id === sender
    );

    // Comprobar si es admin
    const isAdmin =
        senderData?.admin === 'admin' ||
        senderData?.admin === 'superadmin';

    if (!isAdmin) {
        return await sock.sendMessage(jid, {
            text: '❌ Solo los administradores pueden usar este comando.'
        });
    }

    // Comprobar que el bot sea administrador
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    const botData = participants.find(
        p => p.id === botId
    );

    const botIsAdmin =
        botData?.admin === 'admin' ||
        botData?.admin === 'superadmin';

    if (!botIsAdmin) {
        return await sock.sendMessage(jid, {
            text: '❌ Necesito ser administrador para poder expulsar usuarios.'
        });
    }

    // Obtener mencionados
    const mentioned =
        message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(jid, {
            text: '❌ Menciona a la persona que quieres expulsar.\n\nEjemplo: !kick @usuario'
        });
    }

    const userToKick = mentioned[0];

    // Evitar expulsar a otro administrador
    const targetData = participants.find(
        p => p.id === userToKick
    );

    if (
        targetData?.admin === 'admin' ||
        targetData?.admin === 'superadmin'
    ) {
        return await sock.sendMessage(jid, {
            text: '❌ No puedes expulsar a otro administrador.'
        });
    }

    try {
        await sock.groupParticipantsUpdate(
            jid,
            [userToKick],
            'remove'
        );

        await sock.sendMessage(jid, {
            text: '✅ Usuario expulsado correctamente.'
        });

    } catch (error) {
        console.error('Error en kick:', error);

        await sock.sendMessage(jid, {
            text: '❌ No pude expulsar a ese usuario.'
        });
    }
}
};