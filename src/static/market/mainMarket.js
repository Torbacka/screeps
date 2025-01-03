function buyEnergy(terminal, roomName) {
    const sellOrders = _.filter(Game.market.getAllOrders(), order =>
        order.type === ORDER_SELL &&
        order.resourceType === RESOURCE_ENERGY
    ).map(order => {
        const transferCost = Game.market.calcTransactionCost(
            order.remainingAmount,
            roomName,
            order.roomName
        );
        let totalCost = order.price / ((order.remainingAmount - transferCost) / order.remainingAmount)
        if (totalCost === null) {
            totalCost = Number.MAX_VALUE
        }
        return {
            id: order.id,
            price: order.price,
            remainingAmount: order.remainingAmount,
            roomName: order.roomName,
            transferCost: transferCost,
            totalCost: totalCost, // Cost including transfer
        };
    }).sort((a, b) => a.totalCost - b.totalCost);
    if (sellOrders.length > 0 && sellOrders[0].totalCost < 35) {
        console.log("Cheapest order: " + JSON.stringify(sellOrders));
        let lowestAmount = Math.min(sellOrders[0].remainingAmount, terminal.store[RESOURCE_ENERGY], 50000);
        console.log("Lowest numebr: " + lowestAmount)
        const result = Game.market.deal(sellOrders[0].id, lowestAmount, roomName);
        if (result === OK) {
            console.log(`Successfully bought ${sellOrders[0].remainingAmount} energy for ${sellOrders[0].price} each.`);
        } else {
            console.log(`Failed to buy energy. Error: ${result}`);
        }
    }
}

module.exports = function (roomName) {
    const terminal = Game.rooms[roomName].terminal
    if (terminal.store[RESOURCE_BIOMASS] > 2700) {
        console.log(`Sending biomass to E58S34 ${terminal.send(RESOURCE_BIOMASS, terminal.store[RESOURCE_BIOMASS], "E58S34")}`);
    }


    if (Game.time % 10 === 0 && roomName === "E58S34") {
        let orders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: RESOURCE_ENERGY});
        let buyOrders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});


        const terminal = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_TERMINAL
        })[0];


        const sortedEnergySellOrders = orders.filter(order =>
            order.remainingAmount > 0 &&
            order.price > 150 &&
            order.roomName !== roomName
        ).sort((a, b) => a.price - b.price);

        const myOrders = Game.market.orders;
        const myEnergyOrders = Object.keys(myOrders).filter(
            orderId =>
                myOrders[orderId].type === "sell" &&
                myOrders[orderId].remainingAmount > 0 &&
                myOrders[orderId].resourceType === RESOURCE_ENERGY
        );
        console.log("My energy orders: " + JSON.stringify(myEnergyOrders));
        if (myEnergyOrders.length === 0 && false) {
            console.log("Create sell order " + sortedEnergySellOrders[0].price - 0.01);
            console.log("Create sell order " + Game.market.createOrder({
                type: ORDER_SELL,
                resourceType: RESOURCE_ENERGY,
                price: sortedEnergySellOrders[0].price - 0.01,
                totalAmount: 50000,
                roomName: roomName
            }));
        }
        myEnergyOrders.forEach(order => {
            const cheapestOrder = sortedEnergySellOrders[0];

            if (!cheapestOrder) return;

            // Calculate the new price to stay competitive
            const newPrice = parseFloat(Math.max(150, cheapestOrder.price - 0.01).toFixed(3));

            if (order.price !== newPrice) {
                console.log(`Updating order price. Order ID: ${order.id}, Old Price: ${order.price}, New Price: ${newPrice}`);
                Game.market.changeOrderPrice(order.id, newPrice);
            }
        });

        console.log("resources in terminal: " + terminal.store.getUsedCapacity(RESOURCE_ENERGY) );
        if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 200000) {
            buyEnergy(terminal, roomName);
        }

        const myBuyOrder = Object.keys(myOrders).filter(
            orderId =>
                myOrders[orderId].type === "buy" &&
                myOrders[orderId].remainingAmount > 0 &&
                myOrders[orderId].price > 16 &&
                myOrders[orderId].resourceType === RESOURCE_ENERGY
        );
        console.log("My buy orders: " + myBuyOrder.length);
        if (terminal.store[RESOURCE_ENERGY] < 200000 && myBuyOrder.length === 0) {
            let sortedBuyOrder = Math.min(buyOrders.sort((a,b) => b.price - a.price)[0].price + 0.01, 40);

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
