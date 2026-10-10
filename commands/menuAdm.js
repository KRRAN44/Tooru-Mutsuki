const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menuAdm',
    aliases: ['adm', 'xyz'],

    async execute({ sock, jid }) {

        const menuPath = path.join(__dirname, '../textos/menuAdm.txt');
        const imagePath = path.join(__dirname, '../img/menuadm.jpeg');

        const menu = fs.readFileSync(menuPath, 'utf8');
        const image = fs.readFileSync(imagePath);

        await sock.sendMessage(jid, {
            image: image,
            caption: menu
        });
    }
};