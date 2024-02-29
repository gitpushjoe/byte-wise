const rfdc = require("rfdc");
const clone = rfdc();

/** @typedef {Map<string, any>} Scope */
/** @typedef {Scope[]} Stack */

class Zap { // short for Zeno Snapshots

	/**
	 * @param {number} section
	 * @param {Stack} snapshotData
	*/
	constructor(section, snapshotData) {
		this.section = section;
		this.snapshotData = snapshotData;
	}
}

/**
	 * @typedef {{
	 *   (section: number)
	 *   (name: string, section: number, argNames: string[], body: Function): Function;
	 *   if: (condition: Function, section: number, body: Function, elseSection: number, elseBody: Function) => boolean;
	 *   for: (name: string, init: Function, condition: Function, update: Function, section: number, body: Function) => boolean;
	 *   print: () => void;
	 *   printConcise: () => void;
	 *   log: (data: any) => void;
	 * }} ZenoProxy
*/

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


	/** @type {Scope[]} */
	stack = [];

	/** @type {Zap[]} */
	zaps = [];

	/** @type { ZenoProxy } */
	proxy = undefined;

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

	/** Returns the current scope
	* @returns {Scope}
	*/
	currentScope() {
		return this.stack[this.stack.length - 1];
	}

	/** Searches for the value of a referenced variable in the current scope and all accessible scopes
	* @param {string} - The name of the variable to search for
	* @param {number} - The index of the scope to start at (defaults to the current scope)
	* @returns {any}
	* @throws {Error}
	*/
	findReference(name, scopeIdx = this.stack.length - 1) {
		scopeIdx ??= this.stack.length - 1;
		// console.log("findReference", name, scopeIdx);
		while (this.scopeIdxIs(scopeIdx--, Zeno.BLOCK));
		return this.find(name, scopeIdx);
	}

	/** Searches for a variable in the current scope and all accessible scopes
	* @param {string} - The name of the variable to search for
	* @param {number} - The index of the scope to start at (defaults to the current scope)
	* @returns {any}
	* @throws {Error}
	*/
	find(name, scopeIdx = this.stack.length - 1) {
		// console.log("find", name, scopeIdx);
		if (scopeIdx < 0) {
			throw new Error(`Variable "${name}" not found`);
		}
		for (const scope of this.accessibleScopes(scopeIdx)) {
			if (scope.has(`^${name}`)) {
				return this.findReference(name, scopeIdx);
			}
			if (scope.has(name)) {
				return scope.get(name);
			}
		}
		throw new Error(`Variable "${name}" not found`);
	}

	/** Checks if the scope at the given index is of the given type
	* @param {number} - The index of the scope to check
	* @param {string} - The type to check for
	* @returns {boolean}
	*/
	scopeIdxIs(idx, type) {
		return this.stack[idx].get(Zeno.SCOPE_TYPE) === type;
	}

	/** Returns an iterator over all accessible scopes
	 * @param {number=} startIdx - The index to start at
	* @returns {IterableIterator<Scope>}
	*/
	*accessibleScopes(scopeIdx = this.stack.length - 1) {
		do {
			yield this.stack[scopeIdx];
		} while (this.scopeIdxIs(scopeIdx--, Zeno.BLOCK));
	}

	/** Pushes a new scope onto the stack
	* @param {string} type - The type of the scope
	* @param {string} name - The name of the scope
	* @param {number|number[]} sourceSections - The section(s) the scope belongs to
	*/
	pushScope(type, name, sourceSections) {
		if (!Array.isArray(sourceSections)) {
			sourceSections = [sourceSections];
		}
		this.stack.push(new Map([[Zeno.SCOPE_TYPE, type], [Zeno.SCOPE_NAME, name], [Zeno.SOURCE_SECTIONS, sourceSections]]));
	}

	/** Sets a variable in the current scope or any accessible scope
	* @param {string} name - The name of the variable to set
	* @param {any} value - The value to set the variable to
	* @throws {Error}
	*/
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

	/** Removes a variable from the current scope
	* @param {string} name - The name of the variable to remove
	*/
	unregister(name) {
		this.currentScope().delete(name);
	}

	/** Logs a snapshot of the current state of the stack	
	* @param {number} section - The current section
	*/
	zap(section) {
		const snapshotData = this.stack.map(scope => clone(scope));
		this.zaps.push(new Zap(section, snapshotData));
	}

	/** Simulates a for loop
	* @param {string} name - The name of the loop variable
	* @param {Function} init - The initial value of the loop variable
	* @param {Function} condition - The condition to check before each iteration
	* @param {Function} update - The function to call after each iteration
	* @param {number} section - The section the for loop belongs to
	* @param {Function} body - The loop body
	*
	* @returns {boolean} - Places the return value of the body on the virtual stack if there is one and returns true, otherwise returns false
	*/
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
				return 0;
			}
		}
	}

	/** Simulates an if-else statement
	* @param {Function} condition - The condition to check
	* @param {number} section - The section the if statement belongs to
	* @param {Function} body - The if body
	* @param {number|undefined} elseSection - The section the else statement belongs to
	* @param {Function|undefined} elseBody - The else body
	*
	* @returns {boolean} - Places the return value of the body or elseBody on the virtual stack if there is one and returns true, otherwise returns false
	*/
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

	/** Simulates a function call
	* @param {string} name - The name of the function
	* @param {number} section - The section the function call belongs to
	* @param {any[]} args - The arguments to pass to the function
	* @param {Function} body - The function body
	*
	* @returns {Function} - A function that simulates the function call
	*/
	function(name, section, argsNames, body) { 
		return (function (sourceSection, ...args) {
			const signature = `${name}(` + argsNames.map((arg, idx) => {
				if (arg.startsWith("^")) {
					return arg.slice(1);
				}
				switch (typeof args[idx]) {
					case "object":
						return JSON.stringify(args[idx]);
					case "string":
						return `"${args[idx]}"`;
					default:
						return args[idx];
				}
			}).join(", ") + ")";
			this.zap(sourceSection);
			this.pushScope(Zeno.FUNCTION, signature, sourceSection);
			if (args.length !== argsNames.length) {
				console.log(sourceSection, args, this.zaps.length, this.stack);
				throw new Error(`Function "${name}" called with ${args.length} arguments, expected ${argsNames.length}`);
			}
			for (const i in argsNames) {
				if (argsNames[i].startsWith("^")) {
					( () => {
						let scopeIdx = this.stack.length - 2;
						do {
							const scope = this.stack[scopeIdx];
							if (scope.has(argsNames[i].slice(1))) {
								this.currentScope().set(argsNames[i], { reference: scopeIdx });
								return;
							}
							if (scope.has(argsNames[i])) {
								this.currentScope().set(argsNames[i], scope.get(argsNames[i]));
								return;
							}
						} while (this.scopeIdxIs(--scopeIdx, Zeno.BLOCK));
					})();
				} else {
					this.currentScope().set(argsNames[i], args[i]);
				}
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

	/** Logs a message to the virtual stdout
	* @param {any} data - The data to log
	*/
	log(data) {
		this.stack[0].set(Zeno.STDOUT, (this.stack[0].get(Zeno.STDOUT) ?? "") + JSON.stringify(data));
	}

	/** Logs the current state of the stack
	*/
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

	/** Logs the current state of the stack in a more concise format
	*/
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
