const fs = require('fs'); const path = require('path');
module.exports = { name: 'menuAdm', aliases: ['MenuAdm', 'xyz'],
async execute({ sock, jid }) {
    const menuPath = path.join(__dirname, '../textos/menuAdm.txt');

    const menu = fs.readFileSync(menuPath, 'utf8');

    await sock.sendMessage(jid, {
        text: menu
    });
}
};