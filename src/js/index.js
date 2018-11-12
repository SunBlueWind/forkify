import Search from './models/Search';

/** GLOBAL STATE OBJECT
 * - current Search object
 * 
 */
const state = {};

// GLOABL SELECTOR OBJECT
const selectors = {
    search: '.search'
};

const controlSearch = async () => {
    const query = 'pizza';  // TODO
    // construct new Search object if query exists
    if (query) {
        state.search = new Search(query);

        // perform search API call
        await state.search.fetchResult();

        // update UI
        console.log(state.search.result);
    }
};


/////////////////////
// Event Listeners
/////////////////////
document.querySelector(selectors.search).addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
