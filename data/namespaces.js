const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

let namespaces = [];
let wikiNs = new Namespace(0,'Wiki','/','');
let mozNs = new Namespace(1,'Mozilla','https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png','/mozilla');
let linuxNs = new Namespace(2,'Linux','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/linux');

namespaces.push(wikiNs);

// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(new Room(0,'New Articles','Wiki'));


module.exports = namespaces;