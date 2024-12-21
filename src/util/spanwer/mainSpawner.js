const spawnerLvl1 = require('./spawnerLvl1');
const spawnerLvl6 = require('./spawnerLvl6');

/**
 *
 * @param {String} roomName
 */
module.exports = function (roomName) {
    switch (Game.rooms[roomName].controller.level) {
        case 1:
            return spawnerLvl1(roomName);
        case 6:
            return spawnerLvl6(roomName);
        default:
            return spawnerLvl1(roomName);
    }
};
