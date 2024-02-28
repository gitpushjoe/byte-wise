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

	static get SOURCE_SECTIONS() {
		return "[[SOURCE_SECTIONS]]";
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

	static get STDOUT() {
		return "%STDOUT";
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
				if (args.length === 1) {
				this.zap(args[0]);
					return;
				}
				return this.function(...args);
			},
			get: (_, name) => {
				if (["if", "for", "print", "printConcise", "log"].includes(name)) {
					return this[name].bind(this);
				}
				return this.find(name);
			},
			set: (_, name, value) => {
				const scope = this.currentScope();
				scope.set(name, value);
				return true;
			},
		};
		this.proxy = new Proxy(func, handler);
		this.pushScope(Zeno.MAIN, "main()", null);
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

	pushScope(type, name, sourceSections) {
		if (!Array.isArray(sourceSections)) {
			sourceSections = [sourceSections];
		}
		this.stack.push(new Map([[Zeno.SCOPE_TYPE, type], [Zeno.SCOPE_NAME, name], [Zeno.SOURCE_SECTIONS, sourceSections]]));
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
			const res = body(value);
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return 1;
			}
			value = update(this.find(name));
			this.set(name, value);
			this.stack.pop();
			if (!condition(value)) {
				return;
			}
		}
	}

	if(condition, section, body, elseSection, elseBody) {
		const success = condition();
		if (success) {
			this.pushScope(Zeno.BLOCK, Zeno.IF, section);
			const res = body();
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return 1;
			}
			this.stack.pop();
		} else if (elseBody !== undefined) {
			this.pushScope(Zeno.BLOCK, Zeno.ELSE, [section, elseSection]);
			const res = elseBody();
			if (res !== undefined) {
				this.set(Zeno.RETURN_VALUE, res);
				return 1;
			}
			this.stack.pop();
		}
		return 0;
	}

	function(name, section, argsNames, body) { 
		return (function (sourceSection, ...args) {
			const signature = `${name}(${args.join(", ")})`;
			this.zap(sourceSection);
			this.pushScope(Zeno.FUNCTION, signature, sourceSection);
			if (args.length !== argsNames.length) {
				console.log(sourceSection, args, this.zaps.length, this.stack);
				throw new Error(`Function "${name}" called with ${args.length} arguments, expected ${argsNames.length}`);
			}
			for (const i in argsNames) {
				this.currentScope().set(argsNames[i], args[i]);
			}
			this.zap(section);
			let [ resSection, result ] = [ undefined, undefined];
			const res = body(...args);
			if (this.currentScope().has(Zeno.RETURN_VALUE)) {
				[ resSection, result ] = this.find(Zeno.RETURN_VALUE);
				this.set(Zeno.RETURN_VALUE, result);
				this.zap(resSection);
				while (this.currentScope().get(Zeno.SCOPE_TYPE) !== Zeno.FUNCTION) {
				this.stack.pop();
				}
			} else {
				if (res === undefined) {
					throw new Error(`Function "${name}" did not return a value`);
				}
				[ resSection, result ] = res;
				this.set(Zeno.RETURN_VALUE, result);
				this.zap(resSection);
			}
			this.stack.pop();
			return result;
			}).bind(this);
	}

	log(data) {
		this.stack[0].set(Zeno.STDOUT, (this.stack[0].get(Zeno.STDOUT) ?? "") + JSON.stringify(data) + "\n");
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
				for (const [key, value] of data[i]) {
					// process.stdout.write(`"${key}": ${JSON.stringify(value)} `);
					if (key.startsWith("[[")) {
						process.stdout.write(`\u001b[36m${value} \u001b[0m `);
						if (Zeno.SOURCE_SECTIONS.includes(key)) {
							process.stdout.write("\n\t");
						}
						continue;
					}
					if (key === Zeno.RETURN_VALUE) {
						process.stdout.write(`\u001b[33m"${key}": ${JSON.stringify(value)}\u001b[0m `);
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
