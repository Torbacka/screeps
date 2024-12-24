module.exports = function () {
    console.log(Game.time % 16)
    if (false) {
        let energySellOrders = Game.market.getAllOrders({
            type: ORDER_SELL,
            resourceType: RESOURCE_CATALYZED_GHODIUM_ACID
        });

        const roomName = 'E58S34'; // Replace with your room name
        const price = 1400; // Desired price per unit
        const amount = 1000; // Desired amount to buy

        energySellOrders = energySellOrders.map(order => {
            const transferCost = Game.market.calcTransactionCost(order.amount, order.roomName, "E58S34");
            order.totalCostPerUnit = (order.price) + ((transferCost + 14)/order.amount);
            order.transferCost = transferCost;
            return order;
        }).sort((a, b) => a.totalCostPerUnit - b.totalCostPerUnit);

        if (energySellOrders[0].totalCostPerUnit <= price) {
            const result = Game.market.deal(energySellOrders[0].id, Math.min(amount, energySellOrders[0].amount), roomName);
            if (result === OK) {
                console.log(`Sell order deal for ${Math.min(amount, energySellOrders[0], amount)} ${RESOURCE_ENERGY} at ${energySellOrders[0].totalCostPerUnit} in ${roomName}`);
            } else {
                console.log(`Failed to close a deal. Error code: ${result}`);
            }
        }

        console.log(JSON.stringify(energySellOrders));

        //const existingBuyOrders = Game.market.get(order =>
        //    order.type === ORDER_BUY &&
        //    order.resourceType === RESOURCE_ENERGY &&
        //    order.roomName === roomName
        //);

        if (false) {
            const result = Game.market.createOrder({
                type: ORDER_BUY,
                resourceType: RESOURCE_ENERGY,
                price: price,
                totalAmount: amount,
                roomName: roomName
            });

            if (result === OK) {
                console.log(`Buy order created for ${amount} ${RESOURCE_ENERGY} at ${price} in ${roomName}`);
            } else {
                Game.notify(`Failed to create buy order. Error code: ${result}`);
            }
        }
    }
    if (Game.resources["pixel"] >=57) {
        sellAllPixels();
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
