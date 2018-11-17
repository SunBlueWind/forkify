import axios from 'axios';

const transformUnit = {
    'tbsp': ['tablespoons', 'tablespoon'],
    'tsp': ['teaspoons', 'teaspoon'],
    'oz': ['ounces', 'ounce'],
    'pound': ['pounds'],
    'cup': ['cups'],
    'jar': ['jars'],
    'package': ['packages'],
    'g': ['grams', 'gram'],
    'kg': ['kilograms', 'kilogram']
};

export default class Recipe {
    constructor(id) {
        this.id = id;
        this.apiKey = process.env.APIKEY;
        this.proxy = process.env.PROXY;
    }

    getRecipe() {
        // should be called only after calling fetchRecipe()
        return this.recipe;
    }

    initRecipe(recipe) {
        this.title = recipe.title;
        this.recipe_id = recipe.recipe_id;
        this.image_url = recipe.image_url;
        this.publisher = recipe.publisher;
        this.ingredients = recipe.ingredients;
        this.source_url = recipe.source_url;
        // assume each recipe is for 4 servings
        this.servings = 4;
        // assume each 3 ingredients require 15 minutes cooking time
        this.cookTime = 15 * Math.ceil(recipe.ingredients.length / 3);
    }

    async fetchRecipe() {
        try {
            const result = await axios(
                `${this.proxy}https://www.food2fork.com/api/get?key=${this.apiKey}&rId=${this.id}`
            );
            this.initRecipe(result.data.recipe);
        } catch (err) {
            alert(err);
        }
    }

    unifyUnits(ingredient) {
        for (const [shortUnit, targets] of Object.entries(transformUnit)) {
            let ingArr = ingredient.split(' ');
            // replace long units with short units
            for (const longUnit of targets) {
                ingArr = ingArr.map(word => {
                    if (word === longUnit) {
                        word = shortUnit;
                    }
                    return word;
                });
            }
            // update the ingredient
            ingredient = ingArr.join(' ');
        }

        return ingredient;
    }

    removeParentheses(ingredient) {
        return ingredient.replace(/ *\([^)]*\) */g, " ");
    }

    extractCountAndUnit(ingredient) {
        const ingArr = ingredient.split(' ');
        const newIngredient = {
            count: 1,   // default count is 1
            unit: '',
            description: ''
        }
        const allUnits = Object.keys(transformUnit);
        
        // find the index of the unit
        const unitPos = ingArr.findIndex(word => allUnits.includes(word));

        if (unitPos > -1) {
            // we found a unit
            if (unitPos === 1) {
                // if there is only one number before the unit
                newIngredient.count = eval(ingArr[0].replace('-', '+'));
            } else {
                newIngredient.count = eval(ingArr.slice(0, unitPos).join('+'));
            }
            newIngredient.unit = ingArr[unitPos];
            newIngredient.description = ingArr.slice(unitPos + 1).join(' ');
        } else if (parseInt(ingArr[0], 10)) {
            // no unit, but first entry is a number
            newIngredient.count = eval(ingArr[0]);
            newIngredient.description = ingArr.slice(1).join(' ');
        } else if (unitPos === -1) {
            // no unit, first entry not number
            newIngredient.description = ingredient;
        }

        return newIngredient;
    }

    transformIngredients() {
        // transform each ingredient
        this.ingredients = this.ingredients.map(ingredient => {
            /** newIngredient : {
             *      count: int,
             *      unit: str,
             *      description: str
             * }
             */
            const newIngredient = {};
            // unify the units
            ingredient = this.unifyUnits(ingredient);
            // remove contents inside parentheses
            ingredient = this.removeParentheses(ingredient);
            // extract count and unit
            ingredient = this.extractCountAndUnit(ingredient);

            return ingredient;
        });
    }
}
