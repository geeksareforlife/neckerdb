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
		console.log(i);
		resultsDiv.replaceChild(htmlToNode(module.html), nodes[i]);
	});
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