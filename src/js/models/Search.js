import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
        this.apiKey = process.env.APIKEY;
    }

    async fetchResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const result = await axios(
                `${proxy}https://www.food2fork.com/api/search?key=${this.apiKey}&q=${this.query}`
            );
            this.result = result.data.recipes;
        } catch (err) {
            alert(err);
        }
    }

    getResult() {
        return this.result;
    }
}
