module.exports = { name: 'demote', aliases: ['quitaradmin'], async execute({ sock, message, jid }) {
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
        text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝑺𝜣𝑳𝜣 𝜟𝑫𝜧𝜤𝜨𝑺 𝜝𝑹𝜣...\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });
}

// Comprobar que el bot sea administrador
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
        text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜟 𝑸𝑼𝜤𝜮𝜨 𝑫𝜮𝜝𝜣 𝜝𝜟𝑱𝜟𝑹 𝑫𝜮 𝜟𝑫𝜧𝜤𝜨???\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });
}

const userToDemote = mentioned[0];

// Comprobar que sí sea admin (si no, no hay nada que quitar)
const targetData = participants.find(
    p => p.id === userToDemote
);

if (!targetData) {
    return await sock.sendMessage(jid, {
        text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮𝑺𝜮 𝜧𝜣𝜨𝜣 𝜨𝜣 𝜮𝑺𝜯𝜟 𝜮𝜨 𝜮𝑺𝜯𝜮 𝑮𝑹𝑼𝜬𝜣......\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });
}

if (
    targetData.admin !== 'admin' &&
    targetData.admin !== 'superadmin'
) {
    return await sock.sendMessage(jid, {
        text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜨𝑼𝜨𝑪𝜟 𝑭𝑼𝜮 𝜟𝑫𝜧𝜤𝜨.... 𝑳𝜣𝑳..\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });
}

try {

    await sock.groupParticipantsUpdate(
        jid,
        [userToDemote],
        'demote'
    );

    await sock.sendMessage(jid, {
        text: `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜢𝜮𝑪𝜢𝜣 \n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });

} catch (error) {
    console.error('Error en demote:', error);

    await sock.sendMessage(jid, {
        text:  `┗━━╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╯🎍╭͢\n𝜮 𝑹 𝑹 𝜣 𝑹 !!\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`
    });
}
} };