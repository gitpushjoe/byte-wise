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
		return "[[SCOPE_TYPE]]";
	}

	static get SOURCE_SECTION() {
		return "[[SOURCE_SECTION]]";
	}

	static get SCOPE_NAME() {
		return "[[SCOPE_NAME]]";
	}

	static get BLOCK() {
		return "BLOCK";
	}

	static get MAIN() {
		return "MAIN";
	}

	static get FOR() {
		return "FOR";
	}

	static get IF() {
		return "IF";
	}

	static get ELSE() {
		return "ELSE";
	}

	static get ELSEIF() {
		return "ELSEIF";
	}

	stack = [];
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
		this.pushScope(Zeno.MAIN, "main", 0);
	}

	currentScope() {
		return this.stack[this.stack.length - 1];
	}

	find(name) {
		for (const scope of this.accessibleScopes()) {
			if (scope.has(name)) {
				return scope.get(name);
			}
		}
		throw new Error(`Variable "${name}" not found`);
	}

	scopeIdxIs(idx, type) {
		return this.stack[idx].get(Zeno.SCOPE_TYPE) === type;
	}

	*accessibleScopes() {
		let scopeIdx = this.stack.length - 1;
		do {
			yield this.stack[scopeIdx];
		} while (this.scopeIdxIs(scopeIdx--, Zeno.BLOCK));
	}

	pushScope(type, name, section) {
		this.stack.push(new Map([[Zeno.SCOPE_TYPE, type], [Zeno.SCOPE_NAME, name], [Zeno.SOURCE_SECTION, section]]));
	}

	set(name, value) {
		if (value === undefined) {
			throw new Error("Cannot set variable to undefined");
		}
		for (const scope of this.accessibleScopes()) {
			if (scope.has(name)) {
				scope.set(name, value);
				return;
			}
		}
		this.currentScope().set(name, value);
	}

	unregister(name) {
		this.currentScope().delete(name);
	}

	zap(section) {
		const snapshotData = this.stack.map(scope => clone(scope));
		this.zaps.push(new Zap(section, snapshotData));
	}

	for(name, init, condition, update, section, body) {
		if (!condition(init)) {
			return;
		}
		let value = init;
		while (1) {
			this.pushScope(Zeno.BLOCK, Zeno.FOR, section);
			this.set(name, value);
			this.zap(section);
			body(value);
			value = update(this.find(name));
			this.set(name, value);
			this.stack.pop();
			if (!condition(value)) {
				return;
			}
		}
	}

	if(condition, section, body, elseBody) {
		const success = condition();
		if (success) {
			this.pushScope(Zeno.BLOCK, Zeno.IF, section);
			body();
			this.stack.pop();
		} else if (elseBody !== undefined) {
			this.pushScope(Zeno.BLOCK, Zeno.ELSE, section);
			elseBody();
			this.stack.pop();
		}
	}

	print() {
		this.zaps.forEach((zap, idx) => {
			const data = zap.snapshotData;
			let text = "";
			console.log(`Zap #${idx + 1} (Section ${zap.section})`);
			for (let i = 0; i < data.length; i++) {
				text += `Scope level ${i}: `;
				for (const [key, value] of data[i]) {
					// text += `(\x1b[33m"${key}"\x1b[0m: \x1b[36m${JSON.stringify(value)}\x1b[0m) `;
					text += `\n\t\u001b[33m"${key}"\u001b[0m: \u001b[36m${JSON.stringify(value)}\u001b[0m`;
				}
				text += "\n";
			}
			console.log(text);
		});
	}
};

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

zeno.for("i", 0, (i) => i < $.people.length, (i) => ++i, 2, (i) => {
	
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

