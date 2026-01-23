const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const searchString = searchParams.get("q");

document.getElementById("searchTitle").textContent = searchString;

const results = idx.search(searchString);

const resultsDiv = document.getElementById('searchResults');

for (let i = 0; i < results.length; i++) {
	resultsDiv.appendChild(htmlToNode('<p><a href="' + results[i].ref + '">' + results[i].ref + '</a></p>'));
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