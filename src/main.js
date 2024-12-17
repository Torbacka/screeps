const roleHarvester = require('./roles/harvester.js');
const roleBuilder = require('./roles/builder.js');
const roleUpgrader = require('./roles/upgrader.js');
const roleTransporter = require('./roles/transporter.js');
const roleDestroyer = require('./roles/destroyer.js');
const roleAttacker = require('./roles/attacker.js');
const garbageCollector = require('./util/garbageCollector.js');
const spawner = require('./util/spawner.js');
const stats = require('./util/stats.js');
const drawing = require('./util/drawing.js');
const tower = require('./static/tower.js');
const safeModeActivator = require('./static/safeModeActivator.js');

module.exports.loop = function () {
    for (const roomName in Game.rooms) {
        spawner(roomName);


        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            switch (creep.memory.role) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'Transporter':
                    roleTransporter.run(creep);
                    break;
                case 'destroyer':
                    roleDestroyer.run(creep);
                    break;
                case 'attacker':
                    roleAttacker.run(creep);
                    break;
            }
        }

        tower.guard(Game.rooms['E58S34']);
        garbageCollector();
        stats();
        drawing();
        safeModeActivator();
    }

}
