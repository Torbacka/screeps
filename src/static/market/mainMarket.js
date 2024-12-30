module.exports = function () {
    const terminal = Game.rooms["E51S33"].terminal
    if (terminal.store[RESOURCE_BIOMASS] > 3000) {
        console.log(`Sending biomass to E58S34 ${terminal.send(RESOURCE_BIOMASS, 3000, "E58S34")}`);
    }


    if (Game.time %100 ===0 && false) {
        const terminal = Game.rooms["E58S34"].find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_TERMINAL
        })[0];

        const sellOrders = _.filter(Game.market.orders, order =>
            order.type === ORDER_SELL &&
            order.resourceType === RESOURCE_ENERGY &&
            order.active &&
            order.remainingAmount > 0
        );
        if (terminal.store[RESOURCE_ENERGY] > 100000 && sellOrders.length === 0) {
            const result = Game.market.createOrder({
                type: ORDER_SELL,
                resourceType: RESOURCE_ENERGY,
                price: 35,
                totalAmount: 50000,
                roomName: "E58S34"
            });
            console.log("Result" + result)
        }
        if (Game.resources["pixel"] >= 57) {
            sellAllPixels();
        }
    }
}


function sellAllPixels() {
    const allOrders = Game.market.getAllOrders();
    const myPixels = Game.resources["pixel"]; // Replace with actual method to get your pixel amount

    const bestBuyOrder = allOrders
        .filter(order => order.resourceType === "pixel" && order.type === ORDER_BUY)
        .reduce((best, current) => (!best || current.price > best.price) ? current : best, null);

    if (bestBuyOrder) {
        const amountToSell = Math.min(myPixels, bestBuyOrder.amount); // You can only sell up to the order's amount
        if (amountToSell > 0) {
            const result = Game.market.deal(bestBuyOrder.id, amountToSell);
            if (result === OK) {
                console.log(`Successfully sold ${amountToSell} pixels to order ${bestBuyOrder.id} at price ${bestBuyOrder.price}`);
            } else {
                console.log(`Failed to sell pixels: ${result}`);
            }
        } else {
            console.log("No pixels to sell or the order cannot accommodate your pixels.");
        }
    } else {
        console.log("No buy orders for pixels found.");
    }
}
