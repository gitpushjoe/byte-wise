const rfdc = require("rfdc");
const clone = rfdc();

class Zap { // short for Zeno Snapshots
	constructor(section, snapshotData) {
		this.section = section;
		this.snapshotData = snapshotData;
	}
}

class Zeno {

	static get SCOPE_TYPE() {
		return "%SCOPE_TYPE%";
	}

	static get FOR() {
		return "FOR";
	}

	static get MAIN() {
		return "MAIN";
	}

	stacks = [new Map([[Zeno.SCOPE_TYPE, Zeno.MAIN]])];
	proxy = undefined;
	zaps = [];

	constructor() {
		const func = (function () { return; }).bind(this);
		const handler = {
			apply: (_, __, args) => {
				this.set(args[0], args[1]);
				return true;
			},
			get: (_, name) => {
				return this.find(name);
			},
			set: (_, name, value) => {
				const scope = this.currentScope();
				scope.set(name, value);
				return true;
			},
		};
		this.proxy = new Proxy(func, handler);
	}

	currentScope() {
		return this.stacks[this.stacks.length - 1];
	}

	find(name) {
		let scope = this.currentScope();
		if (scope.has(name)) {
			return scope.get(name);
		} else {
			let scopeIndex = this.stacks.length - 1;
			while (scope.get(Zeno.SCOPE_TYPE) === Zeno.FOR) {
				scopeIndex--;
				scope = this.stacks[scopeIndex];
				if (scope.has(name)) {
					return scope.get(name);
				}
			}
			throw new Error(`Variable ${name} not found`);
		}
	}

	set(name, value) {
		if (value === undefined) {
			throw new Error("Cannot set variable to undefined");
		}
		if (this.currentScope().has(name)) {
			this.currentScope().set(name, value);
			return;
		}
		let scopeIndex = this.stacks.length - 1;
		while (this.stacks[scopeIndex].get(Zeno.SCOPE_TYPE) === Zeno.FOR) {
			scopeIndex--;
			if (this.stacks[scopeIndex].has(name)) {
				this.stacks[scopeIndex].set(name, value);
				return;
			}
		}
		this.currentScope().set(name, value);
	}

	unregister(name) {
		const scope = this.currentScope();
		scope.delete(name);
	}

	zap(section) {
		const snapshotData = this.stacks.map(scope => clone(scope));
		this.zaps.push(new Zap(section, snapshotData));
	}

	for(section, name, init, condition, update, body) {
		this.set(name, init);
		while (condition(this.find(name))) {
			const scope = new Map([[Zeno.SCOPE_TYPE, Zeno.FOR]]);
			this.stacks.push(scope);
			this.zap(section);
			body(this.find(name));
			this.stacks.pop();
			this.set(name, update(this.find(name)));
		}
		this.unregister(name);
	}
};

const zeno = new Zeno();
const $ = zeno.proxy;
const zap = zeno.zap.bind(zeno);

$("people", [
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
]);

zap(0);

$("adults", []);
$("children", []);

zap(1);

// for (let i = 0; i < 10; i++) {
zeno.for(2, "i", 0, (i) => i < $.people.length, (i) => ++i, (i) => {
	
	$("person", $.people[i]);

	$("name", $.person[0]);
	$("age", $.person[1]);
	zap(3);

	if ($.age >= 18) {
		$("adults", $.adults.concat($.person[0]));
		zap(4);
	} else {
		$("children", $.children.concat($.person[0]));
		zap(5);
	}

});

$("adults", $.adults.sort());
$("children", $.children.sort());
zap(6);

zeno.zaps.forEach((zap, idx) => {
	const data = zap.snapshotData;
	let text = "";
	console.log(`Zap #${idx + 1} (Section ${zap.section})`);
	for (let i = 0; i < data.length; i++) {
		text += `Scope idx ${i}: `;
		for (const [key, value] of data[i]) {
			text += `("${key}": ${JSON.stringify(value)}) `;
		}
		text += "\n";
	}
	console.log(text);
});

// console.log(zeno.zaps.map(zap => zap.snapshotData));

