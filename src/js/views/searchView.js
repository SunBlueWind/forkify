import { elements } from './base';

// private helper functions
const addRecipeToResults = recipe => {
    elements.resultList.insertAdjacentHTML('beforeend', `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `);
};

// export functions
// get user input
export const getInput = () => elements.searchInput.value;

// clear the user input textbox
export const clearInput = () => {
    elements.searchInput.value = '';
};

// clear the result shown on the left of the page
export const clearResults = () => {
    elements.resultList.innerHTML = '';
};

// display the result from API call on the left of the page
export const displayResults = recipes => {
    recipes.forEach(addRecipeToResults);
};
