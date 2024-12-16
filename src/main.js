const roleHarvester = require('roles_harvester');
const roleBuilder = require('roles_builder');
const roleUpgrader = require('roles_upgrader');
const roleTransporter = require('roles_transporter');
const roleDestroyer = require('roles_destroyer');
const roleAttacker = require('roles_attacker');
const garbageCollector = require('util_garbageCollector');
const spawner = require('util_spawner');
const stats = require('util_stats');
const drawing = require('util_drawing');
const tower = require('static_tower');
const safeModeActivator = require('static_safeModeActivator');

module.exports.loop = function () {
    spawner();


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