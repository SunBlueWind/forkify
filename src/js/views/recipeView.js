import { elements, elementClassNames } from './base'
import { Fraction } from 'fractional'

///////////////////////////////
// private helper functions
///////////////////////////////

const fractionalizeFloat = f => {
    let s = "";
    // restrict to 2 decimal places
    f = parseFloat(f.toFixed(2));
    const intPart = Math.floor(f);
    if (intPart > 0) {
        s += intPart.toString();
    }

    if (intPart !== f) {
        // has decimal place
        const decimal = f - intPart;
        s += ` ${new Fraction(decimal).toString()}`;
    }

    return s;
};

const generateIngredientMarkup = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${fractionalizeFloat(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
        </div>
    </li>
`;


////////////////////////
// exported functions
////////////////////////

// clear the currently displayed recipe
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// display the currently selected recipe
export const displayRecipe = recipe => {
    elements.recipe.insertAdjacentHTML('afterbegin', `
        <figure class="recipe__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart-outlined"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(ing => generateIngredientMarkup(ing)).join('')}
            </ul>

            <button class="btn-small recipe__btn shopping-add-btn">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.source_url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>
            </a>
        </div>
    `);
};

// hightlight the currently selected recipe
// and unhighlight all the other recipes
export const highlightSelectedRecipe = recipeID => {
    // unhiglight all the other links
    document.querySelectorAll('.results__link').forEach(el => {
        el.classList.remove('results__link--active');
    });

    // hightlight the selected link
    const selectedLink = document.querySelector(`a[href="#${recipeID}"]`);
    if (selectedLink) {
        selectedLink.classList.add('results__link--active');
    }
};

// adjust the number of servings in the currently selected recipe
export const adjustServings = recipe => {
    if (recipe.servings > 0) {
        // update the servings display
        document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
        // update each ingredient count
        Array.from(document.querySelectorAll('.recipe__count')).forEach((el, idx) => {
            el.textContent = fractionalizeFloat(recipe.ingredients[idx].count);
        });
    }
}
