import { elements, elementClassNames } from './base';

///////////////////////////////
// private helper functions
///////////////////////////////

// truncate long names
const truncateLongName = (name, limit=17) => {
    const nameList = name.split(' ');
    const result = [];

    nameList.reduce((acc, cur) => {
        // only include the current word if the length is under limit
        if (acc + cur.length < 17) {
            result.push(cur);
        }
        return acc + cur.length;
    }, 0);

    return `${result.join(' ')} ...`;
};

// add one single result from API call to result list
const addRecipeToResults = recipe => {
    elements.resultList.insertAdjacentHTML('beforeend', `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${truncateLongName(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `);
};

// create DOM pagination button
// type should be one of 'prev' and 'next'
const createPaginationButton = (page, type) => `
<button class="${elementClassNames.paginationBtn} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`;

// display pagination buttons based on current page and total pages
const displayPaginationButtons = (page, totalPages) => {
    let button;

    if (page === 1 && totalPages > 1) {
        // only display the next button
        button = createPaginationButton(page, 'next');
    } else if (page === totalPages && totalPages > 1) {
        // only display the prev button
        button = createPaginationButton(page, 'prev');
    } else if (page > 1 && page < totalPages) {
        // display both buttons
        button = `
        ${createPaginationButton(page, 'prev')}
        ${createPaginationButton(page, 'next')}
        `;
    }

    elements.resultsPageBtn.insertAdjacentHTML('afterbegin', button);
};

////////////////////////
// exported functions
////////////////////////

// get user input
export const getInput = () => elements.searchInput.value;

// clear the user input textbox
export const clearInput = () => {
    elements.searchInput.value = '';
};

// clear the result shown on the left of the page
export const clearResults = () => {
    elements.resultList.innerHTML = '';
    elements.resultsPageBtn.innerHTML = '';
};

// display the result from API call on the left of the page
export const displayResults = (recipes, page=1, perPage=10) => {
    if (recipes.length) {
        // start and end of the result on current page
        const start = (page - 1) * perPage;
        const end = page * perPage;
        // display results
        recipes.slice(start, end).forEach(addRecipeToResults);
        // display pagination buttons
        const totalPages = Math.ceil(recipes.length / perPage);
        displayPaginationButtons(page, totalPages);
    }
};
