const stats = {
    roomStats: function () {
        if (!Memory.data) Memory.data = {};
        if (!Memory.data.controllerProgress) Memory.data.controllerProgress = {};

        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];

            // Check if the room has a controller
            if (room.controller) {
                // Store the controller's progress in Memory
                Memory.data.controllerProgress[roomName] = {
                    level: room.controller.level, // Current controller level
                    progress: room.controller.progress || 0, // Current progress (defaults to 0 if undefined)
                    progressTotal: room.controller.progressTotal || 0, // Total progress required for the next level
                };
            }
        }
    },

    remoteHarvesterStats: function (creep, mainRoom) {
        if (!Memory.data) Memory.data = {};
        if (!Memory.data.remoteHarvester) Memory.data.remoteHarvester = {};
        if (!Memory.data.remoteHarvester[mainRoom]) Memory.data.remoteHarvester[mainRoom] = {};

        if (!Memory.data.remoteHarvester[mainRoom][creep.name]) {
            Memory.data.remoteHarvester[mainRoom][creep.name] = {
                harvests: 0,
                totalHarvest: 0
            };
        }

        Memory.data.remoteHarvester[mainRoom][creep.name].harvests += 1;
        const carryParts = creep.body.filter(part => part.type === CARRY).length;

        Memory.data.remoteHarvester[mainRoom][creep.name].totalHarvest = CARRY_CAPACITY * carryParts * Memory.data.remoteHarvester[mainRoom][creep.name].harvests;
    }


}

module.exports = stats;


    //
//


  // const maxPrice = 24; // Maximum price you're willing to pay
  // const myCredits = Game.market.credits; // Your available credits
  // const myRoomName = "E58S34"; // Replace with your actual room name

// Find the cheapest sell order for energy within the price constraint

