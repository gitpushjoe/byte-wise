const Zeno = require('../../zeno');
const slideshow = require('../../slideshow');

var source = 
`const graph = { // 0 [
	A: ["B", "F"],
	B: ["C"],
	C: ["A", "D"],
	D: [],
	E: ["F"],
	F: ["D"]
}; // ] 0

const visited = new Set(); // 1

const dfs = (node, visited) => { // 2
	if (visited.has(node)) { // 3
		return; // 7
	}
	visited.add(node); // 4
	graph[node].forEach(dfs); // 5
}

dfs("A"); // 6
`;

const zeno = new Zeno();
const $ = zeno.proxy;

$.graph = { 
	A: ["B", "F"],
	B: ["C"],
	C: ["A", "D"],
	D: [],
	E: ["F"],
	F: ["D", "E"]
}; 
$(0);

$.visited = new Set();
$(1);

const dfs = $("dfs", 2, ["node", "^visited", "^graph"], () => {
	if ($.if(_ => $.visited.has($.node), 3, () => {
		return [7, null];
	})) { return; }
	$.visited.add($.node);
	$(4);
	for (const node of $.graph[$.node]) {
		dfs(5, node, $.visited, $.graph);
	}
	$(5);
	return [5, null];
});

dfs(6, "A", $.visited, $.graph);
$(6);

$.log($.visited);
$(7);

if (process.argv[3] === "print") {
	$.print();
} else if (process.argv[3] === "concise") {
	$.printConcise();
} else {
	slideshow(zeno, source);
}

console.log('finished');
