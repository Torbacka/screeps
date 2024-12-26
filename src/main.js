const roleHarvester = require('./roles/harvester.js');
const roleBuilder = require('./roles/builder.js');
const roleUpgrader = require('./roles/upgrader.js');
const roleTransporter = require('./roles/transporter.js');
const roleDestroyer = require('./roles/destroyer.js');
const roleAttacker = require('./roles/attacker.js');
const roleGeneralist = require('./roles/generalist.js');
const roleMineralHarvester = require('./roles/mineralHarvester.js');
const roleRemoteTransporter = require('./roles/remote/remoteTransporter.js');
const roleRemoteHarvester = require('./roles/remote/remoteHarvester.js');
const roleRemoteAttacker = require('./roles/remote/remoteAttacker.js');
const roleRemoteClaimer = require('./roles/remote/remoteClaimer.js');
const roleRemoteBuilder = require('./roles/remote/remoteBuilder.js');
const garbageCollector = require('./util/garbageCollector.js');
const spawner = require('./util/spanwer/mainSpawner.js');
const stats = require('./util/stats.js');
const drawing = require('./util/drawing.js');
const tower = require('./static/tower.js');
const safeModeActivator = require('./static/safeModeActivator.js');
const market = require('./static/market/mainMarket.js');

module.exports.loop = function () {
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }
    for (const roomName in Game.rooms) {
        spawner(roomName);
        const creepsInRoom = _.filter(Game.creeps, creep => creep.room.name === roomName);
        creepsInRoom.forEach(creep => {

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
                case 'generalist':
                    roleGeneralist.run(creep);
                    break;
                case 'mineralHarvester':
                    roleMineralHarvester.run(creep);
                    break;
                case 'remoteTransporter':
                    roleRemoteTransporter.run(creep, 'E58S34', 'E57S35');
                    break;
                case 'remoteHarvester':
                    roleRemoteHarvester.run(creep, 'E58S34', 'E59S34');
                    break;
                case 'remoteAttacker':
                    roleRemoteAttacker.run(creep, 'E58S34', 'E57S35');
                    break;
                case 'remoteClaimer':
                    roleRemoteClaimer.run(creep, 'E58S34', 'E47S31');
                    break;
                case 'remoteBuilder':
                    roleRemoteBuilder.run(creep, 'E58S34', 'E57S35');
                    break;
            }
        });

        tower.guard(Game.rooms[roomName]);
    }
    garbageCollector();
    stats.roomStats();
    drawing();
    safeModeActivator();

    market();

}
