module.exports = { name: 'kick', aliases: ['a-chingar-a-su-madre', 'andate-al-pingo'],
async execute({ sock, message, jid }) {

    // Solo funciona en grupos
    if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
        
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

    // Obtener mencionados
    const mentioned =
        message?.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜧𝜮𝜨𝑪𝜤𝜣𝜨𝜟 𝜟 𝜟𝑳𝑮𝑼𝜤𝜮𝜨 𝜬𝜟𝑹𝜟 𝑺𝜟𝑪𝜟𝑹\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
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
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜨𝜣 𝜬𝑼𝜮𝑫𝜮𝑺 𝑺𝜟𝑪𝜟𝑹 𝜣𝜯𝑹𝜣 𝜟𝑫𝜧𝜤𝜨....\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`

        });
    }

    try {
        await sock.groupParticipantsUpdate(
            jid,
            [userToKick],
            'remove'
        );

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑮𝑮 𝑺𝜮 𝑭𝑼𝜮\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`

        });

    } catch (error) {
        console.error('Error en kick:', error);

        await sock.sendMessage(jid, {
            text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑹𝜣𝑹 𝜟𝑳 𝜮𝑳𝜤𝜧𝜤𝜨𝜟𝑹..\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`

        });
    }
}
};