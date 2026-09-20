module.exports = { name: 'promote', aliases: ['daradmin'],
async execute({ sock, message, jid }) {

    // Solo funciona en grupos
    if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, {
            text:  `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
            text:  `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜣𝑳𝜣 𝜟𝑫𝜧𝜤𝜨𝑺 𝜝𝑹𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑹𝑹𝜣𝑹 !! 𝜨𝜣 𝑺𝜣𝜳 𝜟𝑫𝜧\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }

    // Obtener persona mencionada
    const mentioned =
        message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝜟 𝑸𝑼𝜤𝜮𝜨 𝑸𝑼𝜤𝜮𝑹𝜮𝑺 𝜟𝑺𝑪𝜮𝜨𝑫𝜮𝑹 𝜟 𝜟𝑫𝜧\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }

    const userToPromote = mentioned[0];

    // Comprobar si ya es admin
    const targetData = participants.find(
        p => p.id === userToPromote
    );

    if (!targetData) {
        return await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑺𝜮 𝜧𝜣𝜨𝜣 𝜨𝜣 𝜮𝑺𝜯𝜟 𝜮𝜨 𝜮𝑺𝜯𝜮 𝑮𝑹𝑼𝜬𝜣......\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }

    if (
        targetData.admin === 'admin' ||
        targetData.admin === 'superadmin'
    ) {
        return await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑺𝜮 𝜧𝜣𝜨𝜣 𝜳𝜟 𝜮𝑹𝜟 𝜟𝑫𝜧\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }

    try {

        await sock.groupParticipantsUpdate(
            jid,
            [userToPromote],
            'promote'
        );

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜢𝜮𝑪𝜢𝜣.. 𝑼𝑺𝑼𝜟𝑹𝜤𝜣 𝜟𝑺𝑪𝜮𝜨𝑫𝜤𝑫𝜣\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });

    } catch (error) {
        console.error('Error en promote:', error);

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑹𝑹𝜣𝑹 !! 𝜨𝜣 𝜟𝑫𝜧\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        });
    }
}
};