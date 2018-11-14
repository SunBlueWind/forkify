// DOM elements
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    resultList: document.querySelector('.results__list'),
    results: document.querySelector('.results'),
    resultsPageBtn: document.querySelector('.results__pages')
};

// element class name
export const elementClassNames = {
    loader: 'loader',
    paginationBtn: 'btn-inline'
};

// spinner loader
export const displayLoader = parent => {
    const loader = `
    <div class='${elementClassNames.loader}'>
        <svg>
            <use href='img/icons.svg#icon-cw'></use>
        </svg>
    </div>
    `
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementClassNames.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};
