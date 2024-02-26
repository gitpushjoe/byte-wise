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

	static get CALLER() {
		return "[[CALLER]]";
	}

	static get BLOCK() {
		return "BLOCK";
	}

	static get MAIN() {
		return "MAIN";
	}

	static get FUNCTION() {
		return "FUNCTION";
	}

	static get RETURN_VALUE() {
		return "%RET";
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
				if (args.length === 0) {
					const ret = this.find(Zeno.RETURN_VALUE);
					while (this.currentScope().get(Zeno.SCOPE_TYPE) !== Zeno.FUNCTION) {
						this.stack.pop();
					}
					return ret;
				}
				return this.function(...args);
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
		this.pushScope(Zeno.MAIN, "main", 0, "main()");
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

	pushScope(type, name, section, caller) {
		this.stack.push(new Map([[Zeno.SCOPE_TYPE, type], [Zeno.SCOPE_NAME, name], [Zeno.SOURCE_SECTION, section], [Zeno.CALLER, caller]]));
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
			this.pushScope(Zeno.BLOCK, Zeno.FOR, section, this.currentScope().get(Zeno.CALLER) + "*");
			this.set(name, value);
			this.zap(section);
			const res = body(value);
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return res;
			}
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
			this.pushScope(Zeno.BLOCK, Zeno.IF, section, this.currentScope().get(Zeno.CALLER) + "*");
			const res = body();
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return res;
			}
			this.stack.pop();
		} else if (elseBody !== undefined) {
			this.pushScope(Zeno.BLOCK, Zeno.ELSE, section, this.currentScope().get(Zeno.CALLER) + "*");
			const res = elseBody();
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return res;
			}
			this.stack.pop();
		}
	}

	function(name, section, argsNames, body) { 
		return ((...args) => {
			const caller = `${name}(${args.join(", ")})`;
			this.pushScope(Zeno.FUNCTION, name, section, caller);
			if (args.length !== argsNames.length) {
				throw new Error(`Function "${name}" called with ${args.length} arguments, expected ${argsNames.length}`);
			}
			for (const i in argsNames) {
				this.currentScope().set(argsNames[i], args[i]);
			}
			this.zap(section);
			const [ resSection, result ] = body(...args);
			this.set(Zeno.RETURN_VALUE, result);
			this.zap(resSection);
			this.stack.pop();
			return result;
		}).bind(this);
	}

	print() {
		this.zaps.forEach((zap, idx) => {
			const data = zap.snapshotData;
			let text = "";
			console.log(`Zap #${idx + 1} (Section ${zap.section})`);
			for (let i = 0; i < data.length; i++) {
				text += `Scope level ${i}: `;
				for (const [key, value] of data[i]) {
					text += `\n\t\u001b[33m"${key}"\u001b[0m: \u001b[36m${JSON.stringify(value)}\u001b[0m`;
				}
				text += "\n";
			}
			console.log(text);
		});
	}

	printConcise() {
		this.zaps.forEach((zap, idx) => {
			const data = zap.snapshotData;
			console.log(`Zap #${idx + 1} (Section ${zap.section})`);
			for (let i = 0; i < data.length; i++) {
				console.log(`Scope level ${i}: `);
				process.stdout.write("\t");
				let j = 0;
				for (const [key, value] of data[i]) {
					if (key.startsWith("[[")) {
						process.stdout.write(`\u001b[36m${value} \u001b[0m `);
						if (key === Zeno.CALLER) {
							process.stdout.write("\n\t");
						}
						continue;
					}
					process.stdout.write(`"${key}": ${JSON.stringify(value)} `);
				}
				console.log();
			}
			console.log();
		});
	}
};

module.exports = Zeno;
