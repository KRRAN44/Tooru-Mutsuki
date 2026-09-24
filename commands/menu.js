const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menu',
    aliases: ['Menu', 'xyz'],

    async execute({ sock, jid }) {

        const menuPath = path.join(__dirname, '../textos/menu.txt');
        const imagePath = path.join(__dirname, '../img/menu.jpg');

        const menu = fs.readFileSync(menuPath, 'utf8');
        const image = fs.readFileSync(imagePath);

        await sock.sendMessage(jid, {
            image: image,
            caption: menu
        });
    }
};