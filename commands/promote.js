module.exports = { name: 'promote', aliases: ['daradmin'],
async execute({ sock, message, jid }) {

    // Solo funciona en grupos
    if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, {
            text: '❌ Este comando solo funciona en grupos.'
        });
    }

    // Obtener información del grupo
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    // Persona que ejecutó el comando
    const sender = message?.key?.participant || message?.key?.remoteJid;

    // Buscar al ejecutor
    const senderData = participants.find(
        p => p.id === sender
    );

    // Comprobar si es administrador
    const isAdmin =
        senderData?.admin === 'admin' ||
        senderData?.admin === 'superadmin';

    if (!isAdmin) {
        return await sock.sendMessage(jid, {
            text: '❌ Solo los administradores pueden usar este comando.'
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
        return await sock.sendMessage(jid, {
            text: '❌ Necesito ser administrador para dar administrador.'
        });
    }

    // Obtener persona mencionada
    const mentioned =
        message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(jid, {
            text: '❌ Menciona a la persona que quieres hacer administrador.\n\nEjemplo: !promote @usuario'
        });
    }

    const userToPromote = mentioned[0];

    // Comprobar si ya es admin
    const targetData = participants.find(
        p => p.id === userToPromote
    );

    if (!targetData) {
        return await sock.sendMessage(jid, {
            text: '❌ No encontré a ese usuario en el grupo.'
        });
    }

    if (
        targetData.admin === 'admin' ||
        targetData.admin === 'superadmin'
    ) {
        return await sock.sendMessage(jid, {
            text: '⚠️ Ese usuario ya es administrador.'
        });
    }

    try {

        await sock.groupParticipantsUpdate(
            jid,
            [userToPromote],
            'promote'
        );

        await sock.sendMessage(jid, {
            text: '👑 Usuario promovido a administrador correctamente.'
        });

    } catch (error) {
        console.error('Error en promote:', error);

        await sock.sendMessage(jid, {
            text: '❌ No pude darle administrador a ese usuario.'
        });
    }
}
};