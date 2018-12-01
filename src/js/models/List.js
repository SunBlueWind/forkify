import uniqid from 'uniqid';

export default class List {
    constructor () {
        this.items = [];
    }

    addItem (count, unit, description) {
        const item = {
            id: uniqid(),
            count,
            unit,
            description
        }
        this.items.push(item);
        return item;
    }

    removeItem (id) {
        this.items = this.items.filter(el => el.id !== id);
    }

    updateCount (id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
};
