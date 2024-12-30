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
const roleRemoteHealer = require('./roles/remote/remoteHealer.js');
const roleRemoteClaimer = require('./roles/remote/remoteClaimer.js');
const roleRemoteBuilder = require('./roles/remote/remoteBuilder.js');
const roleRemoteBioHarvester = require('./roles/remote/remoteBioHarvester.js');
const garbageCollector = require('./util/garbageCollector.js');
const spawner = require('./util/spanwer/mainSpawner.js');
const stats = require('./util/stats.js');
const drawing = require('./util/drawing.js');
const tower = require('./static/tower.js');
const safeModeActivator = require('./static/safeModeActivator.js');
const market = require('./static/market/mainMarket.js');
const factory = require('./static/factory.js');
const profiler = require('./screeps-profiler.js');


profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function () {
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
                    roleRemoteTransporter.run(creep, 'E51S33', 'E51S34');
                    break;
                case 'remoteHarvester':
                    roleRemoteHarvester.run(creep, 'E58S34', 'E59S34');
                    break;
                case 'remoteAttacker':
                    roleRemoteAttacker.run(creep, 'E58S34', 'E56S34');
                    break;
                case 'remoteClaimer':
                    roleRemoteClaimer.run(creep, 'E58S34', 'E47S31');
                    break;
                case 'remoteBuilder':
                    roleRemoteBuilder.run(creep, 'E58S34', 'E57S35');
                    break;
                case 'remoteHealer':
                    roleRemoteHealer.run(creep, 'E58S34', 'E56S34');
                    break;
                case 'remoteBioHarvester':
                    roleRemoteBioHarvester.run(creep, 'E50S35');
                    break;
            }
        });

            let room = Game.rooms[roomName];
            tower.guard(room);
            if (room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TERMINAL}}).length > 0) {
                market();
            }
            if (Memory[roomName] && Memory[roomName].factory)   {
                factory.produce(Game.getObjectById(Memory[roomName].factory));
            }

        }
        garbageCollector();
        stats.roomStats();
        drawing();
        safeModeActivator();


    });
}
