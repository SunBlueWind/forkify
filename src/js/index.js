import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, displayLoader, clearLoader, elementClassNames } from './views/base';


/** GLOBAL STATE OBJECT
 * - current Search object
 * - current Recipe object
 * - current Shopping List object
 */
const state = {};
window.state = state; // debug

/////////////////////
// Controllers
/////////////////////

// search input controller
const controlSearch = async () => {
    // get user input
    const query = searchView.getInput();
    // construct new Search object if query exists
    if (query) {
        state.search = new Search(query);

        // update UI to prepare for the API call
        searchView.clearInput();
        searchView.clearResults();
        recipeView.clearRecipe();
        displayLoader(elements.results);

        // perform search API call
        await state.search.fetchResult();

        // update UI
        clearLoader();
        searchView.displayResults(state.search.getResult());
    }
};

// url hash ID controller
const controlUrlHash = async () => {
    // get the recipe ID from url
    const recipeID = window.location.hash.replace('#', '');
    if (recipeID) {
        state.recipe = new Recipe(recipeID);

        // update UI to prepare for the API call
        recipeView.highlightSelectedRecipe(recipeID);
        recipeView.clearRecipe();
        displayLoader(elements.recipe);

        // fetch specific recipe from API call
        await state.recipe.fetchRecipe();
        state.recipe.transformIngredients();

        // update UI
        clearLoader();
        recipeView.displayRecipe(state.recipe);
    }
};

// add current recipe ingredients to shopping list
const addToShoppingList = () => {
    if (state.list === undefined) {
        state.list = new List();
    }
    if (state.recipe && state.recipe.ingredients) {
        const ingredients = state.recipe.ingredients;
        ingredients.forEach(ing => {
            // add to global state
            const item = state.list.addItem(
                ing.count,
                ing.unit,
                ing.description
            );
            // update UI
            listView.renderItem(item);
        });
    }
}


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

// url hash change listener
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlUrlHash));

// recipe view listener
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // increase serving
        state.recipe.updateServings('dec');
        recipeView.adjustServings(state.recipe);
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // decrease serving
        state.recipe.updateServings('inc');
        recipeView.adjustServings(state.recipe);
    } else if (e.target.matches('.shopping-add-btn, .shopping-add-btn *')) {
        // add to shopping list
        addToShoppingList();
    }
});

// shopping list listener
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping-adjust')) {
        // adjust servings in shopping list
        const newCount = parseFloat(e.target.value);
        if (newCount >= 0) {
            state.list.updateCount(id, newCount);
        }
    } else if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete an ingredient from shopping list
        // remove from state
        state.list.removeItem(id);
        // adjust UI
        listView.removeItem(id);
    }
});
