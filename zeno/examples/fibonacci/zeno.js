const Zeno = require("../../zeno.js");

const zeno = new Zeno();
const $ = zeno.proxy;
const zap = zeno.zap.bind(zeno);

$.num = 10;

zap(0);

const fib = $("fib", 1, ["n"], (n) => {

	const test = zeno.if(() => { return $.n <= 1;}, 2, () => {
		return [3, $.n];
	}) !== undefined && $();
	return [4, fib(n - 1) + fib(n - 2)];
});

zap(5);

$.result = fib($.num);

zeno.printConcise();

console.log($.result);
