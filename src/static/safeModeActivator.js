/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

module.exports = function () {

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const events = room.getEventLog();

        // Filter attack events
        const attackEvents = events.filter(event => event.event === EVENT_ATTACK);

        attackEvents.forEach(event => {
            const target = Game.getObjectById(event.data.targetId);
            if (target && target.my && target.structureType && target.structureType !== STRUCTURE_RAMPART) {
                console.log(`🚨 Structure under attack: ${target.structureType} at ${target.pos}`);
                Game.notify(`🚨 Structure under attack: ${target.structureType} at ${target.pos}`, 0);
                room.controller.activateSafeMode();
            }
        });
    }
};


