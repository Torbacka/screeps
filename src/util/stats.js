module.exports = function () {

    if (!Memory.data) {
        Memory.data = {};
    }

    // Initialize `controllerProgress` if it doesn't already exist
    if (!Memory.data.controllerProgress) {
        Memory.data.controllerProgress = {};
    }

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


}