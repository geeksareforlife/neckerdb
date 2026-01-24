const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const searchString = searchParams.get("q");

document.getElementById("searchTitle").textContent = searchString;

const results = idx.search(searchString);
console.dir(results);

const numPages = Math.ceil(results.length / 24);
let currentPage = searchParams.get("p");
if (currentPage === null) {
	currentPage = 1;
} else {
	currentPage	= parseInt(currentPage);
	if (Number.isNaN(currentPage)) {
		currentPage = 1
	}
	if (currentPage > numPages) {
		currentPage = numPages;
	}
}

let pageStart = 0 + ((currentPage - 1) * 24);
let pageEnd = 24 + ((currentPage - 1) * 24);
if (pageEnd > results.length) {
	pageEnd = results.length;
}
console.log(pageStart + " - " + pageEnd);

const resultsDiv = document.getElementById('searchResults');

let nodes = [];

for (let i = pageStart; i < pageEnd; i++) {
	let moduleURL = results[i].ref
	if (moduleURL.slice(-1) != "/") {
		moduleURL = results[i].ref + "/"
	}
	moduleURL += "index.js"

	nodes[i] = resultsDiv.appendChild(htmlToNode("<a></a>"));
	import(moduleURL).then((module) => {
		resultsDiv.replaceChild(htmlToNode(module.html), nodes[i]);
	});
}

// this is going to build the pagination navigation
// see the pagination partial for more details
if (numPages > 1) {
	let navEl = document.getElementById('pagination');

	let url = document.location.pathname + '?q=' + searchString;

	// add the classes to the container
	navEl.classList.add('flex', 'items-center', 'justify-between', 'border-t', 'border-gray-200', 'px-4', 'sm:px-0', 'mb-8');

	// Previous button
	if (currentPage > 1) {
		let html = `<div class="-mt-px flex w-0 flex-1">
          <a href="${url}&p=${currentPage - 1}" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
            <i class="fa-light fa-circle-arrow-left mr-1"></i>
            Previous
          </a>
        </div>`;
        navEl.appendChild(htmlToNode(html));
	} else {
		let html = `<div class="-mt-px flex w-0 flex-1"></div>`;
		navEl.appendChild(htmlToNode(html));
	}

	
	// Number navigation
	let numbersEl = navEl.appendChild(htmlToNode('<div class="hidden md:-mt-px md:flex">'));

	let firstNum = currentPage - 2;
	if (firstNum < 1) {
		firstNum = 1;
	}

	let lastNum = currentPage + 2;
	if (lastNum > numPages) {
		lastNum = numPages;
	}

	let itemClass = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
	let currentItemClass = "border-indigo-500 text-indigo-600";

	// initial fixed numbers
	if (firstNum > 1) {
		let html = `<a href="${url}&p=1" class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${itemClass}" aria-label="Page 1" role="button">1</a>`;
		numbersEl.appendChild(htmlToNode(html));
	}
	if (firstNum == 3) {
		// show page 2
		let html = `<a href="${url}&p=2" class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${itemClass}" aria-label="Page 2" role="button">2</a>`;
		numbersEl.appendChild(htmlToNode(html));
	}

	// ellipsis
	if (firstNum > 3) {
		let html = `<span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"><i class="fa-light fa-ellipsis"></i></span>`
		numbersEl.appendChild(htmlToNode(html));
	}

	// show our numbers
	for (let i = firstNum; i <= lastNum; i++) {
		let thisClass = ""
		if (i == currentPage) {
			thisClass = currentItemClass;
		} else {
			thisClass = itemClass;
		}

		let html = `<a href="${url}&p=${i}" class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${thisClass}" aria-label="Page ${i}" role="button">${i}</a>`;
		numbersEl.appendChild(htmlToNode(html));
	}

	// final fixed numbers
	if (lastNum == (numPages - 2)) {
		// show penultimate page
		let html = `<a href="${url}&p=${numPages - 1}" class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${itemClass}" aria-label="Page ${numPages - 1}" role="button">${numPages - 1}</a>`;
		numbersEl.appendChild(htmlToNode(html));
	} else if (lastNum < (numPages - 2)) {
		// ellipsis
		let html = `<span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"><i class="fa-light fa-ellipsis"></i></span>`
		numbersEl.appendChild(htmlToNode(html));
	}

	if (lastNum < numPages) {
		let html = `<a href="${url}&p=${numPages}" class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${itemClass}" aria-label="Page ${numPages}" role="button">${numPages}</a>`;
		numbersEl.appendChild(htmlToNode(html));
	}


	// Next button
	if (currentPage < numPages) {
		let html = `<div class="-mt-px flex w-0 flex-1 justify-end">
          <a href="${url}&p=${currentPage + 1}" class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
            Next <i class="fa-light fa-circle-arrow-right ml-1"></i>
          </a>
        </div>`;
        navEl.appendChild(htmlToNode(html));
	} else {
		let html = `<div class="-mt-px flex w-0 flex-1 justify-end"></div>`;
		navEl.appendChild(htmlToNode(html));
	}
}



/**
 * @param {String} HTML representing a single node (which might be an Element,
                   a text node, or a comment).
 * @return {Node}
 *
 * From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 */
function htmlToNode(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const nNodes = template.content.childNodes.length;
    if (nNodes !== 1) {
        throw new Error(
            `html parameter must represent a single node; got ${nNodes}. ` +
            'Note that leading or trailing spaces around an element in your ' +
            'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
            'the element; call .trim() on your input to avoid this.'
        );
    }
    return template.content.firstChild;
}