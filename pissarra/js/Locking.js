const utils = require('./utils')

module.exports = {
    Locking: class Locking {
        constructor() {
            this.locked_boxes = {};
            this.users_locking = {};
        }

        print() {
            console.log(this.locked_boxes)
            console.log(this.users_locking)
        }

        isLocked(id) {
            return id in this.users_locking;
        }

        getLocked(id) {
            return this.users_locking[id];
        }

        update_locks(io, prev = undefined) {
            let ids_colors = Object.fromEntries(Object.entries(this.locked_boxes).map(([k, id]) => [k, utils.alphanumeric2Color(id)]));
            if (prev !== undefined && !(prev in this.locked_boxes)) ids_colors[prev] = 'none';
            io.emit('lock', ids_colors);
        }

        unlock(user_id) {
            let previously_locked_id = undefined;

            if (user_id in this.users_locking) {
                previously_locked_id = this.users_locking[user_id];

                // Unlock previous locked box
                delete this.locked_boxes[this.users_locking[user_id]];
                delete this.users_locking[user_id];
            }

            return previously_locked_id;
        }

        lock(user_id, id) {
            // Check if box is free
            if (!(id in this.locked_boxes)) {
                // ... and lock it for user
                this.users_locking[user_id] = id;
                this.locked_boxes[id] = user_id;
            }
        }

        change(io, user_id, id) {
            // Define previously locked box and unlock it
            let previously_locked_id = this.unlock(user_id);

            // Lock box for user
            if (id != '') this.lock(user_id, id);

            // Report changes back to the Events
            this.update_locks(io, previously_locked_id);
        }
    }
}