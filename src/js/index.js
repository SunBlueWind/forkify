import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, displayLoader, clearLoader, elementClassNames } from './views/base';

/** GLOBAL STATE OBJECT
 * - current Search object
 * 
 */
const state = {};


/////////////////////
// Controllers
/////////////////////
const controlSearch = async () => {
    // get user input
    const query = searchView.getInput();
    // construct new Search object if query exists
    if (query) {
        state.search = new Search(query);

        // update UI to prepare for the API call
        searchView.clearInput();
        searchView.clearResults();
        displayLoader(elements.results);

        // perform search API call
        await state.search.fetchResult();

        // update UI
        clearLoader();
        searchView.displayResults(state.search.getResult());
    }
};


/////////////////////
// Event Listeners
/////////////////////

// search form submit listener
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// pagination button click listener
elements.resultsPageBtn.addEventListener('click', e => {
    const button = e.target.closest(`.${elementClassNames.paginationBtn}`);
    if (button) {
        const gotoPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.displayResults(state.search.getResult(), gotoPage);
    }
});
