const fs = require('fs'); const path = require('path');
module.exports = { name: 'menu', aliases: ['Menu', 'xyz'],
async execute({ sock, jid }) {
    const menuPath = path.join(__dirname, '../textos/menu.txt');

    const menu = fs.readFileSync(menuPath, 'utf8');

    await sock.sendMessage(jid, {
        text: menu
    });
}
};