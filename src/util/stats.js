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

        if (!Memory.data.remoteHarvester[mainRoom][creep.role]) {
            Memory.data.remoteHarvester[mainRoom][creep.role] = {
                harvests: 0,
                totalHarvest: 0,
                name: creep.name
            };
        }
        if (Memory.data.remoteHarvester[mainRoom][creep.role] && Memory.data.remoteHarvester[mainRoom][creep.role].name !== creep.name) {
            Memory.data.remoteHarvester[mainRoom][creep.role] = {
                harvests: 0,
                totalHarvest: 0,
                name: creep.name
            };
        }

        Memory.data.remoteHarvester[mainRoom][creep.role].harvests += 1;
        const carryParts = creep.body.filter(part => part.type === CARRY).length;

        Memory.data.remoteHarvester[mainRoom][creep.role].totalHarvest = CARRY_CAPACITY * carryParts * Memory.data.remoteHarvester[mainRoom][creep.role].harvests;
    }


}

module.exports = stats;


    //const allOrders = Game.market.getAllOrders();
    //const myPixels = Game.resources["pixel"]; // Replace with actual method to get your pixel amount
//
// F//ilter for buy orders of "pixel" and find the one with the highest price
    //const bestBuyOrder = allOrders
    //    .filter(order => order.resourceType === "pixel" && order.type === ORDER_BUY)
    //    .reduce((best, current) => (!best || current.price > best.price) ? current : best, null);
//
    //if (bestBuyOrder) {
    //    const amountToSell = Math.min(myPixels, bestBuyOrder.amount); // You can only sell up to the order's amount
    //    if (amountToSell > 0) {
    //        const result = Game.market.deal(bestBuyOrder.id, amountToSell);
    //        if (result === OK) {
    //            console.log(`Successfully sold ${amountToSell} pixels to order ${bestBuyOrder.id} at price ${bestBuyOrder.price}`);
    //        } else {
    //            console.log(`Failed to sell pixels: ${result}`);
    //        }
    //    } else {
    //        console.log("No pixels to sell or the order cannot accommodate your pixels.");
    //    }
    //} else {
    //    console.log("No buy orders for pixels found.");
    //}
//


  // const maxPrice = 24; // Maximum price you're willing to pay
  // const myCredits = Game.market.credits; // Your available credits
  // const myRoomName = "E58S34"; // Replace with your actual room name

// Find the cheapest sell order for energy within the price constraint

