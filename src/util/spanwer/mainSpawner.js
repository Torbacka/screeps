const spawnerLvl1 = require('./spawnerLvl1');
const spawnerLvl6 = require('./spawnerLvl6');

/**
 *
 * @param {String} roomName
 */
module.exports = function (roomName) {
    if (!Game.rooms[roomName].controller) {
        return;
    }
    switch (Game.rooms[roomName].controller.level) {
        case 1:
            spawnerLvl1(roomName);
            break;
        case 6:
             spawnerLvl6(roomName);
             break;
        default:
            spawnerLvl1(roomName);
            break;
    }
};
