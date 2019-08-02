let roleHarvester = require('role/harvester');
let roleUpgrader = require('role/upgrader');
let roleBuilder = require('role/builder');
let roleAttacker = require('role/attacker');
let roleClaimer = require('role/claim');
let roleTransporter = require('role/transporter');
let roleMiner = require('role/miner');
let garbagecollector = require('garbagecollector');
let populate = require('populate');
let tower = require('tower');
let gatherStatistics = require('gatherStatistics');

module.exports.loop = function () {
    console.log("New game tick!!!!!!!");
    Object.values(Game.rooms).forEach((room) => {
        room.find(FIND_MY_CREEPS).forEach((creep) => {
            if (!_.has(creep.memory, 'role')) {
                return;
            }
            if (creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === 'builder') {
                roleBuilder.run(creep, null, "W37N35");
            }
            if (creep.memory.role === 'attacker') {
                roleAttacker.run(creep, "W37N35");
            }
            if (creep.memory.role === 'claimer') {
                roleClaimer.run(creep, "W36N36");
            }
            if (creep.memory.role === 'transporter') {
                roleTransporter.run(creep);
            }
            if (creep.memory.role === 'miner') {
                roleMiner.run(creep);
            }
        });
        tower.guard(room);
        populate.run(room);
        gatherStatistics(room);
        garbagecollector();


    });
};

