let roleHarvester = require('role_harvester');
let roleUpgrader = require('role_upgrader');
let roleBuilder = require('role_builder');
let roleAttacker = require('role_attacker');
let roleClaimer = require('role_claim');
let roleTransporter = require('role_transporter');
let roleMiner = require('role_miner');
let roleMineralMiner = require('role_mineralMiner');
let roleUpgraderHelper = require('role_upgraderHelper');
let roleBuilderHelper = require('role_builderHelper');
let roleDefender = require('role_defender');
let garbagecollector = require('garbagecollector');
let populate = require('populate');
let market = require('market');
let tower = require('tower');
let gatherStatistics = require('gatherStatistics');
const profiler = require('screeps-profiler');
let constants = require('constants');

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function () {
        Object.values(Game.rooms).forEach((room) => {
            room.find(FIND_MY_CREEPS).forEach((creep) => {
                if (!_.has(creep.memory, 'role')) {
                    return;
                }
                if (creep.memory.role === HARVESTER) {
                    roleHarvester.run(creep);
                }
                if (creep.memory.role === UPGRADER) {
                    roleUpgrader.run(creep);
                }
                if (creep.memory.role === BUILDER) {
                    roleBuilder.run(creep, null, "W37N34");
                }
                if (creep.memory.role === ATTACKER) {
                    roleAttacker.run(creep, "W38N34");
                }
                if (creep.memory.role === CALIMER) {
                    roleClaimer.run(creep, "W38N34");
                }
                if (creep.memory.role === TRANSPORTER) {
                    roleTransporter.run(creep);
                }
                if (creep.memory.role === MINER) {
                    roleMiner.run(creep);
                }
                if (creep.memory.role === UPGRADER_HELPER) {
                    roleUpgraderHelper.run(creep, null, "W38N34");
                }
                if (creep.memory.role === 'defender') {
                    roleDefender.run(creep);
                }
                if (creep.memory.role === BUILDER_HELPER) {
                    roleBuilderHelper.run(creep, null, "W38N34");
                }if (creep.memory.role === 'mineralMiner') {
                    roleMineralMiner.run(creep);
                }
            });
            tower.guard(room);
            populate.run(room);
            market.trade(room);
            gatherStatistics(room);
            garbagecollector();


        });

    });
};