const Zeno = require("../../zeno.js");

const zeno = new Zeno();
const $ = zeno.proxy;
const zap = zeno.zap.bind(zeno);

$.people = [
	["John", 15],
	["Jane", 13],
	["Mike", 20],
	["Sara", 18],
	["Tom", 25],
	["Lily", 11],
	["Bob", 30],
	["Alice", 17],
	["Eve", 31],
	["Adam", 19]
];

zap(0);

$.adults = [];
$.children = [];

zap(1);

zeno.for("i", 0, (i) => i < $.people.length, (i) => { return i + 1; }, 2, (i) => {
	
	$.person = $.people[i];
	[ $.name, $.age ] = $.person;

	zap(3);

	zeno.if(() => $.age >= 18, 4, () => {
		$.adults.push($.name);
		zap(5);

	}, () => {
		$.children.push($.name);
		zap(6);
	});

});

$.adults.sort();
$.children.sort();

zap(7);

zeno.print();

console.log({ adults: $.adults, children: $.children });
