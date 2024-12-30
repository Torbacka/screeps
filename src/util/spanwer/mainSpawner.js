const spawnerLvl1 = require('./spawnerLvl1');
const spawnerLvl4 = require('./spawnerLvl4');
const spawnerLvl6 = require('./spawnerLvl6');

/**
 *
 * @param {String} roomName
 */
module.exports = function (roomName) {
    if (!Game.rooms[roomName].controller || !Game.rooms[roomName].controller.my) {
        return;
    }
    switch (Game.rooms[roomName].controller.level) {
        case 1:
            spawnerLvl1(roomName);
            break;
        case 4:
        case 5:
            spawnerLvl4(roomName);
            break;
        case 6:
        case 7:
        case 8:
             spawnerLvl6(roomName);
             break;
        default:
            spawnerLvl1(roomName);
            break;
    }
};
